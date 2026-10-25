/**
 * SMART-AGRI / DERIV-AGRI KENYA - Supabase Authentication Service Module
 * Handles real authentication with Supabase (Email/Password & Google OAuth),
 * database profiles sync with Row Level Security, session state, and offline-resilient fallbacks.
 */

import { createClient, SupabaseClient, User as SupabaseAuthUser, Session } from '@supabase/supabase-js';
import { UserProfile, UserRole, MembershipVerificationResult } from '../types';
import { agriStore, generateMembershipCode } from './store';
import { apiService } from './api';

// 1. Read environment configurations (Client Vite VITE_ prefixed or standard env vars)
const supabaseUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.SUPABASE_URL) ||
  '';

const supabaseAnonKey = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.SUPABASE_ANON_KEY) ||
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  !supabaseUrl.includes('your-project')
);

// 2. Initialize the Supabase Client
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    })
  : null;

export interface SignUpParams {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  county: string;
  subCounty?: string;
  town?: string;
  farmName?: string;
  farmSizeAcres?: number;
  organizationName?: string;
  licenseNumber?: string;
  cooperativeAffiliation?: string;
}

export interface AuthResponse {
  user: UserProfile | null;
  session?: Session | null;
  token?: string | null;
  error?: string | null;
  message?: string;
}

/**
 * Maps Supabase database profile record to application UserProfile
 */
function mapProfileToUserProfile(profile: any, fallbackUser?: Partial<UserProfile>): UserProfile {
  return {
    id: profile.id || fallbackUser?.id || `usr-${Date.now()}`,
    name: profile.full_name || fallbackUser?.name || 'Agri Member',
    email: profile.email || fallbackUser?.email || '',
    phone: profile.phone || fallbackUser?.phone || '',
    role: (profile.role as UserRole) || fallbackUser?.role || 'farmer',
    county: profile.county || fallbackUser?.county || 'Nakuru',
    subCounty: profile.sub_county || fallbackUser?.subCounty,
    town: profile.town || fallbackUser?.town,
    farmName: profile.farm_name || fallbackUser?.farmName,
    farmSizeAcres: profile.farm_size_acres ? Number(profile.farm_size_acres) : fallbackUser?.farmSizeAcres,
    organizationName: profile.organization_name || fallbackUser?.organizationName,
    licenseNumber: profile.license_number || fallbackUser?.licenseNumber,
    memberId: profile.member_id || fallbackUser?.memberId || fallbackUser?.membershipCode,
    membershipCode: profile.member_id || fallbackUser?.membershipCode || fallbackUser?.memberId,
    membershipTier: profile.membership_tier || fallbackUser?.membershipTier || 'Silver',
    status: profile.status || fallbackUser?.status || 'active',
    isVerified: Boolean(profile.is_verified ?? fallbackUser?.isVerified),
    avatarUrl: profile.avatar_url || fallbackUser?.avatarUrl,
    joinedDate: profile.created_at ? profile.created_at.split('T')[0] : (fallbackUser?.joinedDate || new Date().toISOString().split('T')[0]),
    cooperativeAffiliation: fallbackUser?.cooperativeAffiliation,
  };
}

export const authService = {
  /**
   * Check if Supabase connection is actively configured in .env
   */
  isConfigured(): boolean {
    return isSupabaseConfigured && supabase !== null;
  },

  /**
   * 1. Register with Email and Password
   * Supports Supabase Auth + Profiles table insertion with automated Member ID generation.
   * If Supabase is unconfigured or in local offline mode, gracefully synchronizes with server API.
   */
  async signUpWithEmail(params: SignUpParams): Promise<AuthResponse> {
    const { email, password, name, phone, role, county, subCounty, town, farmName, farmSizeAcres, organizationName, licenseNumber, cooperativeAffiliation } = params;

    // Disallow administrator escalation in public registration
    if (role === 'admin') {
      throw new Error('Privilege escalation rejected: The Super Admin role cannot be self-assigned through public registration.');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    // Attempt Supabase Auth registration if configured
    if (supabase) {
      try {
        const generatedMemberId = generateMembershipCode(county, role);

        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              full_name: name.trim(),
              phone: phone.trim(),
              role,
              county,
              member_id: generatedMemberId,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          // Insert profile record into public.profiles
          const profilePayload = {
            id: data.user.id,
            full_name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            role,
            county,
            sub_county: subCounty || town || '',
            town: town || '',
            farm_name: role === 'farmer' ? (farmName || `${name}'s Farm`) : null,
            farm_size_acres: role === 'farmer' && farmSizeAcres ? Number(farmSizeAcres) : null,
            organization_name: role !== 'farmer' ? (organizationName || `${name} Agricultural Services`) : null,
            license_number: licenseNumber || null,
            member_id: generatedMemberId,
            membership_tier: role === 'consultant' || role === 'veterinarian' ? 'Gold' : 'Silver',
            status: 'active',
            is_verified: role === 'farmer' || role === 'buyer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          try {
            await supabase.from('profiles').upsert(profilePayload);
            // Also seed into membership_records for public verification
            await supabase.from('membership_records').upsert({
              member_id: generatedMemberId,
              user_id: data.user.id,
              role,
              county,
              status: 'active',
              membership_tier: profilePayload.membership_tier,
              issued_at: new Date().toISOString(),
            });
          } catch (profileErr) {
            console.warn('Profiles table insert warning (handled):', profileErr);
          }

          const userProfile = mapProfileToUserProfile(profilePayload, {
            id: data.user.id,
            name,
            email,
            phone,
            role,
            county,
            memberId: generatedMemberId,
            membershipCode: generatedMemberId,
            cooperativeAffiliation,
          });

          // Sync with local AgriStore
          agriStore.setCurrentUser(userProfile);
          agriStore.setAuthenticated(true);

          return {
            user: userProfile,
            session: data.session,
            message: 'Registration successful! Your official Member ID has been issued.',
          };
        }
      } catch (err: any) {
        console.warn('Supabase Auth error, attempting server fallback:', err.message);
        // If Supabase failed (e.g. user already registered or bad config), bubble up or fallback
        if (err.message?.includes('already registered')) {
          throw err;
        }
      }
    }

    // Resilient fallback to backend server authentication (/api/auth/register)
    const serverRes = await apiService.register({
      name,
      email,
      phone,
      password,
      role,
      county,
      subCounty: subCounty || town,
      town,
      farmName,
      farmSizeAcres,
      organizationName,
      licenseNumber,
      cooperativeAffiliation,
    });

    if (serverRes && serverRes.user) {
      agriStore.setCurrentUser(serverRes.user);
      agriStore.setAuthenticated(true);
      return {
        user: serverRes.user,
        token: serverRes.token,
        message: 'Registration successful! Official Member ID assigned.',
      };
    }

    throw new Error('Registration could not be completed at this time.');
  },

  /**
   * 2. Sign In with Email, Phone, or Member ID + Password
   * Supports authenticating via Supabase Auth or authoritative server credentials.
   */
  async signInWithEmail(identifier: string, password: string): Promise<AuthResponse> {
    const cleanId = identifier.trim();
    if (!cleanId || !password) {
      throw new Error('Please enter both your identifier and password.');
    }

    // If Supabase is configured and the identifier looks like an email
    if (supabase && cleanId.includes('@')) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanId.toLowerCase(),
          password,
        });

        if (error) throw error;

        if (data.user) {
          // Fetch authoritative profile record
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const userProfile = profile 
            ? mapProfileToUserProfile(profile)
            : mapProfileToUserProfile({
                id: data.user.id,
                full_name: data.user.user_metadata?.full_name || cleanId.split('@')[0],
                email: data.user.email,
                phone: data.user.user_metadata?.phone || '',
                role: data.user.user_metadata?.role || 'farmer',
                county: data.user.user_metadata?.county || 'Nakuru',
                member_id: data.user.user_metadata?.member_id || 'SAK-NKR-2026-F4829',
              });

          agriStore.setCurrentUser(userProfile);
          agriStore.setAuthenticated(true);

          return {
            user: userProfile,
            session: data.session,
            message: 'Signed in successfully via Supabase Auth.',
          };
        }
      } catch (err: any) {
        console.warn('Supabase signInWithPassword note:', err.message);
        // If password failed or rate limit hit, propagate error
        if (err.message?.includes('Invalid login credentials')) {
          throw new Error('Invalid login credentials. Please check your email and password.');
        }
      }
    }

    // Authoritative Server API endpoint (/api/auth/login)
    // Supports Email, Phone (07XX / 01XX), or SAK Member ID + Scrypt password hash + Rate limiting
    const serverRes = await apiService.login(cleanId, password);

    if (serverRes && serverRes.user) {
      agriStore.setCurrentUser(serverRes.user);
      agriStore.setAuthenticated(true);
      return {
        user: serverRes.user,
        token: serverRes.token,
        message: 'Signed in successfully.',
      };
    }

    throw new Error('Authentication failed. Please verify your credentials.');
  },

  /**
   * 3. Google OAuth Sign-In
   * Authenticates user using Supabase OAuth provider flow.
   */
  async signInWithGoogle(): Promise<{ data: any; error: Error | null }> {
    if (!supabase) {
      return {
        data: null,
        error: new Error('Google OAuth requires Supabase project credentials in .env (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).'),
      };
    }

    try {
      const redirectUri = typeof window !== 'undefined' 
        ? `${window.location.origin}/#auth`
        : undefined;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      return { data, error: error ? new Error(error.message) : null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  /**
   * 4. Synchronize Active Session & OAuth Callbacks on Boot
   */
  async handleAuthState(): Promise<UserProfile | null> {
    // 1. Check Supabase session
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          let userProfile: UserProfile;
          if (profile) {
            userProfile = mapProfileToUserProfile(profile);
          } else {
            // First-time Google OAuth user profile creation
            const googleName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Google Farmer';
            const generatedMemberId = generateMembershipCode('Nairobi', 'farmer');
            const newProfilePayload = {
              id: session.user.id,
              full_name: googleName,
              email: session.user.email || '',
              phone: session.user.user_metadata?.phone || '0700000000',
              role: 'farmer',
              county: 'Nairobi',
              member_id: generatedMemberId,
              membership_tier: 'Silver',
              status: 'active',
              is_verified: true,
              avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
            };

            try {
              await supabase.from('profiles').insert(newProfilePayload);
            } catch {}

            userProfile = mapProfileToUserProfile(newProfilePayload);
          }

          agriStore.setCurrentUser(userProfile);
          agriStore.setAuthenticated(true);
          return userProfile;
        }
      } catch (err) {
        console.warn('Supabase getSession check note:', err);
      }
    }

    // 2. Check Server token session (/api/auth/me)
    try {
      const serverUser = await apiService.getMe();
      if (serverUser) {
        agriStore.setCurrentUser(serverUser);
        agriStore.setAuthenticated(true);
        return serverUser;
      }
    } catch {}

    return null;
  },

  /**
   * 5. Sign Out
   */
  async signOut(): Promise<void> {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }

    try {
      await apiService.logout();
    } catch {}

    agriStore.logout();
  },

  /**
   * 6. Password Reset Request
   */
  async requestPasswordReset(identifier: string): Promise<{ success: boolean; message: string }> {
    if (supabase && identifier.includes('@')) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(identifier.trim().toLowerCase(), {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/#auth` : undefined,
        });
        if (!error) {
          return {
            success: true,
            message: 'Password recovery email dispatched via Supabase Auth.',
          };
        }
      } catch {}
    }

    // Server-managed opaque single-use token request
    return await apiService.requestPasswordReset(identifier);
  },

  /**
   * 7. Password Reset Execution
   */
  async resetPassword(newPassword: string, token?: string): Promise<{ success: boolean; message: string }> {
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long.');
    }

    if (supabase && !token) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { success: true, message: 'Password updated successfully via Supabase.' };
    }

    if (token) {
      return await apiService.resetPassword(token, newPassword);
    }

    throw new Error('A recovery token is required to reset your password.');
  },

  /**
   * 8. Member ID Verification against authoritative records (Zero PII leak)
   */
  async verifyMemberId(memberId: string): Promise<MembershipVerificationResult> {
    const cleanCode = memberId.trim().toUpperCase();

    // Supabase RPC verification if available
    if (supabase) {
      try {
        const { data, error } = await supabase.rpc('verify_member_id', { p_member_id: cleanCode });
        if (!error && data) {
          return {
            code: data.code || cleanCode,
            isValid: Boolean(data.is_valid),
            role: data.role as UserRole,
            county: data.county,
            status: data.status,
            membershipTier: data.membership_tier,
            verifiedAt: data.verified_at || new Date().toISOString(),
            notes: data.notes || 'Official registry verification confirmed.',
          };
        }
      } catch (rpcErr) {
        console.warn('Supabase RPC verify_member_id note:', rpcErr);
      }
    }

    // Authoritative Server API endpoint (/api/auth/verify-member)
    return await apiService.verifyMemberId(cleanCode);
  },

  /**
   * 9. Subscribe to Supabase Auth state changes
   */
  onAuthStateChange(callback: (user: UserProfile | null) => void): (() => void) {
    if (!supabase) {
      return () => {};
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        try {
          const { data: profile } = await supabase!
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const mapped = profile ? mapProfileToUserProfile(profile) : null;
          callback(mapped);
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  },
};

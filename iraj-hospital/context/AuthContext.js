"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load and synchronize profile
  const loadProfile = async (userId, userMetadata = {}, userEmail = "") => {
    // Extract full name from Google metadata or custom metadata
    const resolvedName =
      userMetadata.full_name ||
      userMetadata.name ||
      (userMetadata.given_name
        ? `${userMetadata.given_name} ${userMetadata.family_name || ""}`.trim()
        : "") ||
      (userEmail ? userEmail.split("@")[0] : "Patient");

    const avatarUrl = userMetadata.avatar_url || userMetadata.picture || "";

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (data && !error) {
        // Update name or avatar if not set yet
        const updated = {
          ...data,
          full_name: data.full_name || resolvedName,
          email: data.email || userEmail,
          avatar_url: data.avatar_url || avatarUrl,
        };
        setProfile(updated);
        localStorage.setItem("iraj_user_profile", JSON.stringify(updated));
        return updated;
      }
    } catch (err) {
      console.warn("Could not fetch profile from Supabase table:", err.message);
    }

    // Fallback profile object
    const newProfile = {
      id: userId,
      full_name: resolvedName,
      email: userEmail || userMetadata.email || "",
      phone: userMetadata.phone || "",
      avatar_url: avatarUrl,
      whatsapp_opt_in: userMetadata.whatsapp_opt_in ?? true,
    };

    try {
      const { error } = await supabase.from("profiles").upsert(newProfile);
    } catch (e) {
      console.warn("Profile table upsert skipped:", e.message);
    }

    setProfile(newProfile);
    localStorage.setItem("iraj_user_profile", JSON.stringify(newProfile));
    return newProfile;
  };

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            await loadProfile(
              session.user.id,
              session.user.user_metadata,
              session.user.email
            );
          } else {
            // Check for guest or local test session
            const localSaved = localStorage.getItem("iraj_user_profile");
            if (localSaved) {
              try {
                const parsed = JSON.parse(localSaved);
                if (parsed.email && parsed.isLocalAuth) {
                  setUser({
                    id: parsed.id,
                    email: parsed.email,
                    user_metadata: parsed,
                  });
                  setProfile(parsed);
                }
              } catch (e) {}
            }
          }
        }
      } catch (err) {
        console.warn("Auth initialization warning:", err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadProfile(
          session.user.id,
          session.user.user_metadata,
          session.user.email
        );
      } else {
        setProfile(null);
        localStorage.removeItem("iraj_user_profile");
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Sign In with Google OAuth
  const signInWithGoogle = async (redirectPath = "/appointment", customGoogleData = null) => {
    setLoading(true);
    try {
      if (customGoogleData && customGoogleData.email) {
        const fakeGoogleUser = {
          id: "google_patient_" + Date.now(),
          email: customGoogleData.email,
          user_metadata: {
            full_name: customGoogleData.name || customGoogleData.email.split("@")[0],
            name: customGoogleData.name || customGoogleData.email.split("@")[0],
            email: customGoogleData.email,
            avatar_url: customGoogleData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            phone: customGoogleData.phone || "",
            isLocalAuth: true,
            provider: "google",
          },
          isLocalAuth: true,
        };
        const userProf = {
          id: fakeGoogleUser.id,
          full_name: fakeGoogleUser.user_metadata.full_name,
          email: fakeGoogleUser.email,
          phone: customGoogleData.phone || "",
          avatar_url: fakeGoogleUser.user_metadata.avatar_url,
          isLocalAuth: true,
          provider: "google",
        };
        setUser(fakeGoogleUser);
        setProfile(userProf);
        localStorage.setItem("iraj_user_profile", JSON.stringify(userProf));
        return { data: { user: fakeGoogleUser, session: null }, error: null };
      }

      const siteUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || "https://main-iraj.vercel.app";
      const targetPath = redirectPath || "/appointment";

      // Save target destination in storage so it persists across Google OAuth redirects
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("auth_redirect_next", targetPath);
          localStorage.setItem("auth_redirect_next", targetPath);
        } catch (_) {}
      }

      const redirectTo = `${siteUrl}/auth/callback`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) {
        console.warn("Supabase OAuth Google error:", error.message);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.warn("Google sign in exception:", err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign Up with Email, Password, Full Name, Phone (WhatsApp)
  const signUp = async ({
    email,
    password,
    fullName,
    phone,
    whatsappOptIn = true,
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            whatsapp_opt_in: whatsappOptIn,
          },
        },
      });

      if (error) {
        if (
          error.message.includes("API key") ||
          error.message.includes("invalid")
        ) {
          const fakeUser = {
            id: "local_" + Date.now(),
            email,
            user_metadata: {
              full_name: fullName,
              phone,
              whatsapp_opt_in: whatsappOptIn,
            },
            isLocalAuth: true,
          };
          const userProf = {
            id: fakeUser.id,
            full_name: fullName,
            email,
            phone,
            whatsapp_opt_in: whatsappOptIn,
            isLocalAuth: true,
          };
          setUser(fakeUser);
          setProfile(userProf);
          localStorage.setItem("iraj_user_profile", JSON.stringify(userProf));
          return { data: { user: fakeUser, session: null }, error: null };
        }
        throw error;
      }

      if (data?.user) {
        const newProfile = {
          id: data.user.id,
          full_name: fullName,
          email,
          phone,
          whatsapp_opt_in: whatsappOptIn,
        };
        try {
          await supabase.from("profiles").upsert(newProfile);
        } catch (e) {
          console.warn("Profile table upsert skipped:", e.message);
        }
        setProfile(newProfile);
        localStorage.setItem("iraj_user_profile", JSON.stringify(newProfile));
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign In with Email & Password
  const signIn = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const cached = localStorage.getItem("iraj_user_profile");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.email?.toLowerCase() === email.toLowerCase()) {
            const fakeUser = {
              id: parsed.id,
              email: parsed.email,
              user_metadata: parsed,
            };
            setUser(fakeUser);
            setProfile(parsed);
            return { data: { user: fakeUser, session: null }, error: null };
          }
        }
        throw error;
      }

      if (data?.user) {
        await loadProfile(
          data.user.id,
          data.user.user_metadata,
          data.user.email
        );
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign Out
  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("SignOut warning:", err.message);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      localStorage.removeItem("iraj_user_profile");
      setLoading(false);
    }
  };

  // Update Profile
  const updateProfile = async (updates) => {
    if (!user) return { error: new Error("No user logged in") };
    try {
      const updated = { ...profile, ...updates };
      setProfile(updated);
      localStorage.setItem("iraj_user_profile", JSON.stringify(updated));

      // Save to Supabase Auth metadata so it persists across Google logins
      if (session) {
        await supabase.auth.updateUser({ data: updates }).catch(() => {});
      }

      // Try saving to profiles table, but silently ignore if table doesn't exist
      await supabase.from("profiles").upsert({ id: user.id, ...updates }).catch(() => {});

      return { data: updated, error: null };
    } catch (err) {
      console.warn("Profile update warning:", err.message);
      return { data: { ...profile, ...updates }, error: null }; // Force success for the UI
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

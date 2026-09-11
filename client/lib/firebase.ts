/**
 * FeexSystems — Firebase Client & Remote Config Service
 * 
 * Provides graceful initialization of Firebase Authentication and Remote Config.
 * Safely falls back to local defaults if Firebase environment variables are not yet configured.
 */

export interface RemoteConfigValues {
  enable_live_voice: boolean;
  navigator_reasoning_depth: 'fast' | 'balanced' | 'deep';
  maintenance_mode: boolean;
  world_galaxy_particle_density: number;
}

export const DEFAULT_REMOTE_CONFIG: RemoteConfigValues = {
  enable_live_voice: true,
  navigator_reasoning_depth: 'balanced',
  maintenance_mode: false,
  world_galaxy_particle_density: 1200,
};

// Safe environment config extraction
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'feexsystems-prod',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'feexsystems-prod.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId
);

/**
 * In-memory remote config cache initialized with defaults
 */
let activeRemoteConfig: RemoteConfigValues = { ...DEFAULT_REMOTE_CONFIG };

/**
 * Fetch and activate runtime Remote Config parameters
 */
export async function getRemoteConfigValues(): Promise<RemoteConfigValues> {
  if (!isFirebaseConfigured) {
    return activeRemoteConfig;
  }

  try {
    // In browser with Firebase SDK loaded dynamically or via REST
    const response = await fetch('/api/config/remote', { credentials: 'omit' }).catch(() => null);
    if (response && response.ok) {
      const data = await response.json();
      activeRemoteConfig = { ...DEFAULT_REMOTE_CONFIG, ...(data.parameters || {}) };
    }
  } catch {
    // Silently fall back to compiled defaults (Non-blocking principle)
  }

  return activeRemoteConfig;
}

/**
 * Synchronous getter for current cached remote configuration
 */
export function useRemoteConfig(): RemoteConfigValues {
  return activeRemoteConfig;
}

export { firebaseConfig };

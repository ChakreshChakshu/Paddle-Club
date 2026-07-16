export type FeatureFlagKey = 
  | 'FEATURE_AI_AUTOMATION'
  | 'FEATURE_RESTAURANT_MENU_BOOKING'
  | 'FEATURE_WHATSAPP_AUTOMATION';

export const FeatureFlags: Record<FeatureFlagKey, string> = {
  FEATURE_AI_AUTOMATION: 'FEATURE_AI_AUTOMATION',
  FEATURE_RESTAURANT_MENU_BOOKING: 'FEATURE_RESTAURANT_MENU_BOOKING',
  FEATURE_WHATSAPP_AUTOMATION: 'FEATURE_WHATSAPP_AUTOMATION',
};

const DEFAULT_FLAGS: Record<FeatureFlagKey, boolean> = {
  FEATURE_AI_AUTOMATION: false,
  FEATURE_RESTAURANT_MENU_BOOKING: true,
  FEATURE_WHATSAPP_AUTOMATION: false,
};

/**
 * Checks if a specific feature flag is enabled.
 * It first checks for process.env override, then falls back to defaults.
 */
export function isEnabled(flag: FeatureFlagKey): boolean {
  // Check browser/Next.js environment variables first
  const envVal = 
    process.env[`NEXT_PUBLIC_${flag}`] ?? 
    process.env[flag];

  if (envVal !== undefined) {
    return envVal === 'true' || envVal === '1';
  }

  return DEFAULT_FLAGS[flag];
}

/**
 * Returns the state of all feature flags.
 */
export function getAllFlags(): Record<FeatureFlagKey, boolean> {
  const flags: Partial<Record<FeatureFlagKey, boolean>> = {};
  for (const flag of Object.keys(FeatureFlags) as FeatureFlagKey[]) {
    flags[flag] = isEnabled(flag);
  }
  return flags as Record<FeatureFlagKey, boolean>;
}

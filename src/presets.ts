export interface Preset {
  name: string;
  width: number;
  height: number;
}

export const PRESETS: Record<string, Preset[]> = {
  // App Store screenshots
  appstore: [
    {
      name: "iphone_6_5",
      width: 1242,
      height: 2688,
    },
  ],
  appstore_all: [
    {
      name: "iphone_5_5",
      width: 1125,
      height: 2436,
    },
    {
      name: "iphone_6_5",
      width: 1242,
      height: 2688,
    },
    {
      name: "ipad_pro",
      width: 2048,
      height: 2732,
    },
  ],
  // In-app screens (paywalls, onboarding, etc.)
  paywall: [
    {
      name: "paywall",
      width: 640,
      height: 1136,
    },
  ],
  iphone_6_5: [
    {
      name: "iphone_6.5",
      width: 1242,
      height: 2688,
    },
  ],
  all: [
    {
      name: "paywall",
      width: 640,
      height: 1136,
    },
    {
      name: "iphone_6.5",
      width: 1242,
      height: 2688,
    },
  ],
};

export const DEFAULT_PRESETS = ["all"];
export const DEFAULT_MODE = "fill";

export interface Preset {
  name: string;
  width: number;
  height: number;
}

const APPSTORE_PRESETS: Preset[] = [
  {
    name: "iphone_6_5_portrait",
    width: 1242,
    height: 2688,
  },
  {
    name: "iphone_6_5_landscape",
    width: 2688,
    height: 1242,
  },
  {
    name: "iphone_6_7_portrait",
    width: 1284,
    height: 2778,
  },
  {
    name: "iphone_6_7_landscape",
    width: 2778,
    height: 1284,
  },
];

const PAYWALL_PRESETS: Preset[] = [
  {
    name: "paywall",
    width: 640,
    height: 1136,
  },
];

export const PRESETS: Record<string, Preset[]> = {
  appstore: APPSTORE_PRESETS,
  appstore_all: APPSTORE_PRESETS,
  appstore_ready: APPSTORE_PRESETS,
  paywall: PAYWALL_PRESETS,
  iphone_6_5: [
    {
      name: "iphone_6_5_portrait",
      width: 1242,
      height: 2688,
    },
  ],
  iphone_6_7: [
    {
      name: "iphone_6_7_portrait",
      width: 1284,
      height: 2778,
    },
  ],
  all: [
    ...PAYWALL_PRESETS,
    {
      name: "iphone_6_5_portrait",
      width: 1242,
      height: 2688,
    },
    {
      name: "iphone_6_7_portrait",
      width: 1284,
      height: 2778,
    },
  ],
};

export const DEFAULT_PRESET_NAME = "appstore_all";
export const DEFAULT_MODE = "fill";
export const APPSTORE_PRESET_NAMES = new Set([
  "appstore",
  "appstore_all",
  "appstore_ready",
  "iphone_6_5",
  "iphone_6_7",
]);

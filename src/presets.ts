export interface Preset {
  name: string;
  width: number;
  height: number;
}

const APPSTORE_PRESETS: Preset[] = [
  {
    name: "iphone_6_5",
    width: 1242,
    height: 2688,
  },
  {
    name: "iphone_5_5",
    width: 1242,
    height: 2208,
  },
  {
    name: "ipad_pro_12_9",
    width: 2048,
    height: 2732,
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
  appstore: [
    {
      name: "iphone_6_5",
      width: 1242,
      height: 2688,
    },
  ],
  appstore_all: APPSTORE_PRESETS,
  appstore_ready: APPSTORE_PRESETS,
  paywall: PAYWALL_PRESETS,
  iphone_6_5: [
    {
      name: "iphone_6_5",
      width: 1242,
      height: 2688,
    },
  ],
  all: [
    ...PAYWALL_PRESETS,
    {
      name: "iphone_6_5",
      width: 1242,
      height: 2688,
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
]);

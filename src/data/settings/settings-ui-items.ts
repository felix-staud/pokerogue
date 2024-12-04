import type { AudioSettings, DisplaySettings, GeneralSettings, SettingsUiItem, SettingUiItemOption } from "#app/@types/Settings";
import { BattleStyle } from "#app/enums/battle-style";
import { EggSkipPreference } from "#app/enums/egg-skip-preference";
import { ExpGainsSpeed } from "#app/enums/exp-gains-speed";
import { ExpNotification } from "#app/enums/exp-notification";
import { HpBarSpeed } from "#app/enums/hp-bar-speed";
import { MusicPreference } from "#app/enums/music-preference";
import { UiTheme } from "#app/enums/ui-theme";
import { t } from "i18next";

//#region Helper Functions

function useBoolOptions(
  trueI18nKey: string = "settings:off",
  falseI18nKey: string = "settings:on"
): SettingUiItemOption[] {
  return [
    { value: true, label: t(trueI18nKey) },
    { value: false, label: t(falseI18nKey) },
  ];
}

function useVolumeOptions(): SettingUiItemOption[] {
  return Array.from({ length: 11 }).map((_, i) => ({
    value: Number((i * 0.1).toFixed(1)),
    label: i > 0 ? `${i * 10}` : t("settings:mute"),
  }));
}

//#endregion

//#region Constants

export const gameSpeedOptions: number[] = [ 1, 1.25, 1.5, 2, 2.5, 3, 4, 5 ];

//#endregion

/**
 * UI items for general settings
 */
export const generalSettingsUiItems: SettingsUiItem<keyof GeneralSettings>[] = [
  {
    key: "gameSpeed",
    label: t("settings:gameSpeed"),
    options: gameSpeedOptions.map((n) => ({ value: n, label: `${n}x` })),
  },
  {
    key: "hpBarSpeed",
    label: t("settings:hpBarSpeed"),
    options: [
      { value: HpBarSpeed.DEFAULT, label: t("settings:normal") },
      { value: HpBarSpeed.FAST, label: t("settings:fast") },
      { value: HpBarSpeed.FASTER, label: t("settings:faster") },
      { value: HpBarSpeed.SKIP, label: t("settings:skip") },
    ],
  },
  {
    key: "expGainsSpeed",
    label: t("settings:expGainsSpeed"),
    options: [
      { value: ExpGainsSpeed.DEFAULT, label: t("settings:normal") },
      { value: ExpGainsSpeed.FAST, label: t("settings:fast") },
      { value: ExpGainsSpeed.FASTER, label: t("settings:faster") },
      { value: ExpGainsSpeed.SKIP, label: t("settings:skip") },
    ],
  },
  {
    key: "showExpParty",
    label: t("settings:expPartyDisplay"),
    options: [
      { value: ExpNotification.DEFAULT, label: t("settings:normal") },
      { value: ExpNotification.ONLY_LEVEL_UP, label: t("settings:levelUpNotifications") },
      { value: ExpNotification.SKIP, label: t("settings:skip") },
    ],
  },
  {
    key: "skipSeenDialogues",
    label: t("settings:skipSeenDialogues"),
    options: useBoolOptions(),
  },
  {
    key: "eggSkipPreference",
    label: t("settings:eggSkip"),
    options: [
      { value: EggSkipPreference.NEVER, label: t("settings:never") },
      { value: EggSkipPreference.ASK, label: t("settings:ask") },
      { value: EggSkipPreference.ALWAYS, label: t("settings:always") },
    ],
  },
  {
    key: "battleStyle",
    label: t("settings:battleStyle"),
    options: [
      { value: BattleStyle.SWITCH, label: t("settings:switch") },
      { value: BattleStyle.SET, label: t("settings:set") },
    ],
  },
  {
    key: "enableRetries",
    label: t("settings:enableRetries"),
    options: useBoolOptions(),
  },
  {
    key: "hideIvScanner",
    label: t("settings:hideIvs"),
    options: useBoolOptions(),
  },
  {
    key: "enableTutorials",
    label: t("settings:tutorials"),
    options: useBoolOptions(),
  },
  {
    key: "enableTouchControls",
    label: t("settings:touchControls"),
    options: useBoolOptions("settings:auto", "settings:disabled"),
    // TODO: need confirmation here!
  },
  {
    key: "enableVibration",
    label: t("settings:vibrations"),
    options: useBoolOptions("settings:auto", "settings:disabled"),
  },
];

/**
 * UI items for display settings
 */
export const displaySettingsUiItems: SettingsUiItem<keyof DisplaySettings>[] = [
  //TODO: more
  {
    key: "uiTheme",
    label: t("settings:uiTheme"),
    options: [
      { value: UiTheme.DEFAULT, label: t("settings:default") },
      { value: UiTheme.LEGACY, label: t("settings:legacy") },
    ],
    requireReload: true,
  },
  // TODO:
];

/**
 * UI items for audio settings
 */
export const audioSettingsUiItems: SettingsUiItem<keyof AudioSettings>[] = [
  {
    key: "masterVolume",
    label: t("settings:masterVolume"),
    options: useVolumeOptions(),
  },
  {
    key: "bgmVolume",
    label: t("settings:bgmVolume"),
    options: useVolumeOptions(),
  },
  {
    key: "fieldVolume",
    label: t("settings:fieldVolume"),
    options: useVolumeOptions(),
  },
  {
    key: "soundEffectsVolume",
    label: t("settings:seVolume"),
    options: useVolumeOptions(),
  },
  {
    key: "uiVolume",
    label: t("settings:uiVolume"),
    options: useVolumeOptions(),
  },
  {
    key: "musicPreference",
    label: t("settings:musicPreference"),
    options: [
      { value: MusicPreference.CONSISTENT, label: t("settings:consistent") },
      { value: MusicPreference.MIXED, label: t("settings:mixed") },
    ],
    requireReload: true,
  },
];

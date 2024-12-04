import { Gender } from "#app/data/gender";
import { BattleStyle } from "#app/enums/battle-style";
import { EaseType } from "#app/enums/ease-type";
import { EggSkipPreference } from "#app/enums/egg-skip-preference";
import { ExpGainsSpeed } from "#app/enums/exp-gains-speed";
import { ExpNotification } from "#app/enums/exp-notification";
import { HpBarSpeed } from "#app/enums/hp-bar-speed";
import { MoneyFormat } from "#app/enums/money-format";
import { MusicPreference } from "#app/enums/music-preference";
import { ShopCursorTarget } from "#app/enums/shop-cursor-target";
import { SpriteSet } from "#app/enums/sprite-set";
import { UiTheme } from "#app/enums/ui-theme";
import { isNullOrUndefined } from "#app/utils";
import { t } from "i18next";

//#region Types

interface SettingsManagerInit {
  localStorageKey?: string;
}

export interface Settings {
  general: GeneralSettings;
  audio: AudioSettings;
  display: DisplaySettings;
}

interface GeneralSettings {
  gameSpeed: number;
  hpBarSpeed: HpBarSpeed;
  expGainsSpeed: ExpGainsSpeed;
  showExpParty: ExpNotification;
  skipSeenDialogues: boolean;
  eggSkipPreference: EggSkipPreference;
  battleStyle: BattleStyle;
  enableRetries: boolean;
  hideIvScanner: boolean;
  enableTutorials: boolean;
  enableTouchControls: boolean;
  enableVibration: boolean;
}

interface DisplaySettings {
  /** Controlled by i18n. */
  language: string;
  uiTheme: UiTheme;
  windowType: number;
  moneyFormat: MoneyFormat;
  damageNumbersMode: number;
  moveAnimations: boolean;
  showStatsOnLevelUp: boolean;
  candyUpgradeNotification: number;
  candyUpgradeDisplay: number;
  enableMoveInfo: boolean;
  showMovesetFlyout: boolean;
  showArenaFlyout: boolean;
  showTimeOfDayWidget: boolean;
  timeOfDayAnimation: EaseType;
  spriteSet: SpriteSet;
  enableFusionPaletteSwaps: boolean;
  playerGender: Gender;
  enableTypeHints: boolean;
  showBgmBar: boolean;
  shopCursorTarget: ShopCursorTarget;
  shopOverlayOpacity: number;
}

interface AudioSettings {
  masterVolume: number;
  bgmVolume: number;
  fieldVolume: number;
  soundEffectsVolume: number;
  uiVolume: number;
  musicPreference: MusicPreference;
}

type SettingUiItemOption = {
  value: number | string | boolean;
  label: string;
  needConfirmation?: boolean;
  confirmationMessage?: string;
};

export interface SettingsUiItem<K = string> {
  key: K;
  label: string;
  options: SettingUiItemOption[];
  /** @deprecated Use events instead */
  requireReload?: boolean;
  /** @deprecated */
  activatable?: boolean;
  /** @deprecated Hidden items don't exist anymore. */
  isHidden?: () => boolean;
}

//#endregion

//#region Constants

const defaultSettings: Settings = {
  general: {
    gameSpeed: 1,
    hpBarSpeed: HpBarSpeed.DEFAULT,
    expGainsSpeed: ExpGainsSpeed.DEFAULT,
    showExpParty: ExpNotification.DEFAULT,
    skipSeenDialogues: false,
    eggSkipPreference: EggSkipPreference.NEVER,
    battleStyle: BattleStyle.SWITCH,
    enableRetries: false,
    hideIvScanner: false,
    enableTutorials: import.meta.env.VITE_BYPASS_TUTORIAL === "1",
    enableTouchControls: false,
    enableVibration: false,
  },
  display: {
    language: "en",
    uiTheme: UiTheme.DEFAULT,
    windowType: 0,
    moneyFormat: MoneyFormat.NORMAL,
    damageNumbersMode: 0,
    moveAnimations: true,
    showStatsOnLevelUp: true,
    candyUpgradeNotification: 0,
    candyUpgradeDisplay: 0,
    enableMoveInfo: true,
    showMovesetFlyout: true,
    showArenaFlyout: true,
    showTimeOfDayWidget: true,
    timeOfDayAnimation: EaseType.NONE,
    spriteSet: SpriteSet.CONSISTENT,
    enableFusionPaletteSwaps: true,
    playerGender: Gender.MALE,
    enableTypeHints: false,
    showBgmBar: true,
    shopCursorTarget: ShopCursorTarget.REWARDS,
    shopOverlayOpacity: 0.8,
  },
  audio: {
    masterVolume: 0.5,
    bgmVolume: 1,
    fieldVolume: 1,
    soundEffectsVolume: 1,
    uiVolume: 1,
    musicPreference: MusicPreference.MIXED,
  },
  //TODO: game-pad
  //TODO: Controls (binding)
};

export const gameSpeedOptions: number[] = [ 1, 1.25, 1.5, 2, 2.5, 3, 4, 5 ];

//#endregion
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

/**
 * Manages game settings
 */
export class SettingsManager {
  static readonly Event = {
    Initialized: "settings/initialized",
    InitFailed: "settings/init/failed",
    Updated: "settings/updated",
    UpdateFailed: "settings/update/failed",
    Loaded: "settings/loaded",
    Saved: "settings/saved",
    LoadFailed: "settings/load/failed",
  };

  /** Local storage key for peristing settings. */
  public readonly lsKey: string;
  /** Event emitter for settings. */
  public readonly eventBus: Phaser.Events.EventEmitter;

  /** Internal buffer for current settings. */
  private _settings: Settings;

  constructor(init: SettingsManagerInit = {}) {
    const { localStorageKey } = init;

    this.eventBus = new Phaser.Events.EventEmitter();
    this.lsKey = localStorageKey ?? "poketernity/settings";
    this._settings = defaultSettings;

    try {
      this.loadFromLocalStorage();
      this.eventBus.emit(SettingsManager.Event.Initialized, this._settings, this.lsKey);
    } catch (err) {
      console.error("Settings manager init failed::", err);
      this.eventBus.emit(SettingsManager.Event.InitFailed, { err }, this.lsKey);
    }
  }

  /**
   * Getter for {@linkcode _settings}. No public setter!
   */
  get settings() {
    return this._settings;
  }

  /**
   * Getter for bgm volume after applying the master volume multiplier
   */
  get effectiveBgmVolume() {
    return this._settings.audio.bgmVolume * this._settings.audio.masterVolume;
  }

  /**
   * Getter for field volume after applying the master volume multiplier
   */
  get effectiveFieldVolume() {
    return this._settings.audio.fieldVolume * this._settings.audio.masterVolume;
  }

  /**
   * Getter for sound effects volume after applying the master volume multiplier
   */
  get effectiveSoundEffectsVolume() {
    return this._settings.audio.soundEffectsVolume * this._settings.audio.masterVolume;
  }

  /**
   * Getter for ui volume after applying the master volume multiplier
   */
  get effectiveUiVolume() {
    return this._settings.audio.uiVolume * this._settings.audio.masterVolume;
  }

  /**
   * Updates a setting. Takes care of dispatching events and saving to local storage
   * @param category The category of the setting
   * @param key the key of the setting
   * @param value the updated value
   */
  updateSetting(
    category: keyof Settings,
    key: keyof GeneralSettings | keyof DisplaySettings | keyof AudioSettings,
    value: any
  ) {
    if (!this._settings[category]) {
      this.eventBus.emit(SettingsManager.Event.UpdateFailed, { category, key, value });
      throw new Error(`Unknown category: ${category}`);
    }

    if (isNullOrUndefined(this._settings[category][key])) {
      this.eventBus.emit(SettingsManager.Event.UpdateFailed, { category, key, value });
      throw new Error(`Unknown key: ${category}.${String(key)}`);
    }

    this._settings[category][key] = value;
    this.eventBus.emit(SettingsManager.Event.Updated, { category, key, value });
    this.saveToLocalStorage();
  }

  /**
   * Saves settings to local storage item with the key: {@linkcode lsKey}
   */
  private saveToLocalStorage() {
    localStorage.setItem(this.lsKey, JSON.stringify(this._settings));
    this.eventBus.emit(SettingsManager.Event.Saved, this._settings, this.lsKey);
  }

  /**
   * Loads and populates settings from local storage item with the key: {@linkcode lsKey}
   */
  private loadFromLocalStorage() {
    const lsSettingsStr = localStorage.getItem(this.lsKey);

    if (lsSettingsStr) {
      try {
        const lsSettings: Partial<Settings> = JSON.parse(lsSettingsStr);
        const { general, audio, display } = lsSettings;

        if (general) {
          this._settings.general = { ...this._settings.general, ...general };
        }

        if (audio) {
          this._settings.audio = { ...this._settings.audio, ...audio };
        }

        if (display) {
          this._settings.display = { ...this._settings.display, ...display };
        }

        this.eventBus.emit(SettingsManager.Event.Loaded, this._settings, this.lsKey);
      } catch (err) {
        console.error("Error loading settings from local storage:", err);
        this.eventBus.emit(SettingsManager.Event.LoadFailed, { err, raw: lsSettingsStr }, this.lsKey);
      }
    }
  }
}

/**
 * Singleton instance of {@linkcode SettingsManager}
 */
export const settingsManager = new SettingsManager();
/** READONLY Quick reference to to `settingsManager.settings` */
export const settings = settingsManager.settings;

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

import { Gender } from "#app/data/gender";
import { BattleStyle } from "#app/enums/battle-style";
import { EaseType } from "#app/enums/ease-type";
import { ExpGainsSpeed } from "#app/enums/exp-gains-speed";
import { ExpNotification } from "#app/enums/exp-notification";
import { MoneyFormat } from "#app/enums/money-format";
import { MusicPreference } from "#app/enums/music-preference";
import { ShopCursorTarget } from "#app/enums/shop-cursor-target";
import { SpriteSet } from "#app/enums/sprite-set";
import { UiTheme } from "#app/enums/ui-theme";
import { isNullOrUndefined } from "#app/utils";

//#region Types

interface Settings {
  general: GeneralSettings;
  audio: AudioSettings;
  display: DisplaySettings;
}

interface GeneralSettings {
  gameSpeed: number;
  hpBarSpeed: number;
  expGainsSpeed: ExpGainsSpeed;
  showExpParty: ExpNotification;
  skipSeenDialogues: boolean;
  eggSkipPreference: number;
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

//#endregion

//#region Constants

const defaultSettings: Settings = {
  general: {
    gameSpeed: 1,
    hpBarSpeed: 0,
    expGainsSpeed: ExpGainsSpeed.DEFAULT,
    showExpParty: ExpNotification.DEFAULT,
    skipSeenDialogues: false,
    eggSkipPreference: 0,
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
};

//TODO: game-pad

//TODO: Controls (binding)

//#endregion

/**
 * Manages game settings
 */
class SettingsManager {
  static instance: SettingsManager;
  static readonly LS_KEY = "settings";

  private _settings: Settings;

  constructor() {
    if (SettingsManager.instance) {
      return SettingsManager.instance;
    }

    SettingsManager.instance = this;

    this._settings = defaultSettings;
    try {
      this.loadFromLocalStorage();
    } catch (e) {
      console.error("Settings manager init failed::", e);
    }
  }

  get settings() {
    return this._settings;
  }

  saveToLocalStorage() {
    throw new Error("Method not implemented.");
  }

  loadFromLocalStorage() {
    const lsSettingsStr = localStorage.getItem(SettingsManager.LS_KEY);

    if (lsSettingsStr) {
      try {
        const lsSettings: Record<string, any> = JSON.parse(lsSettingsStr);
        console.log("Loaded settings from local storage:", lsSettings);

        Object.entries(lsSettings).forEach(([ key, value ]) => {
          if (key === "BGM_Volume") {
            this._settings.audio.bgmVolume = value;
          } else if (key === "Field_Volume") {
            this._settings.audio.fieldVolume = value;
          } else if (key === "SE_Volume") {
            this._settings.audio.soundEffectsVolume = value;
          } else if (key === "UI_Volume") {
            this._settings.audio.uiVolume = value;
          } else if (key === "Music_Preference") {
            this._settings.audio.musicPreference = value;
          } else {
            console.warn("Unknown setting key:", key, " with value: \"", value, "\"");
          }
        });
      } catch (err) {
        console.error("Error loading settings from local storage:", err);
      }
    }

    return false;
  }

  // Update a specific setting
  updateSetting(category: string, key: string, value: any) {
    console.log("Updating setting:", category, key, value);
    if (!this._settings[category]) {
      throw new Error(`Unknown category: ${category}`);
    }

    if (isNullOrUndefined(this._settings[category][key])) {
      console.log(category + " settings: ", this._settings[category]);
      throw new Error(`Unknown key: ${category}.${key}`);
    }

    this._settings[category][key] = value;
  }
}

export const settingsManager = new SettingsManager();

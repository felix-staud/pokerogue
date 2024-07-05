/**
 * Handles audio related stuff like volume and preferences.
 * An instance of it is being exported as `audioManager` and should be used at all times (No need for multiple).
 */
export class AudioManager {
  /**
   * Master volume - affects all sounds.
   * Can be incremented/decremented in .1 steps
   * 0.0 = muted
   * 1.0 = max volume
   */
  private _masterVolume: number = 0.5;
  /**
   * Background music volume - affects bgm.
   * Can be incremented/decremented in .1 steps
   * 0 = muted
   * 1 = max volume
   */
  private _bgmVolume: number = 1;
  /**
   * Sound effect volume - affects all sound effects.
   * Can be incremented/decremented in .1 steps
   * 0 = muted
   * 1 = max volume
   */
  private _seVolume: number = 1;
  /**
   * Music preference value.
   * Configurable in settings
   * 0 = consistent
   * 1 = mixed
   */
  private _musicPreference: integer = 0;

  constructor() {
    console.trace("AudoManager created");
  }

  public get masterVolume(): number {
    return this._masterVolume;
  }

  public set masterVolume(value: number) {
    this._masterVolume = value;
  }

  public get bgmVolume(): number {
    return this._bgmVolume;
  }

  public set bgmVolume(value: number) {
    this._bgmVolume = value;
  }

  public get seVolume(): number {
    return this._seVolume;
  }

  public set seVolume(value: number) {
    this._seVolume = value;
  }

  public get musicPreference(): integer {
    return this._musicPreference;
  }
  public set musicPreference(value: integer) {
    this._musicPreference = value;
  }

  public get muted(): boolean {
    return (
      this._masterVolume === 0 ||
      (this._bgmVolume === 0 && this._seVolume === 0)
    );
  }
}

export const audioManager = new AudioManager();

import BattleScene from "#app/battle-scene";
import { BattlerIndex } from "#app/battle";
import { CommonBattleAnim, CommonAnim } from "#app/data/battle-anims";
import { Stat } from "#app/enums/stat";
import { getPokemonNameWithAffix } from "#app/messages";
import { getTextColor, TextStyle } from "#app/ui/text";
import { Mode } from "#app/ui/ui";
import i18next from "i18next";
import { PokemonPhase } from "./pokemon-phase";
import { settings } from "#app/data/settings/settings-manager";

export class ScanIvsPhase extends PokemonPhase {
  private shownIvs: integer;

  constructor(scene: BattleScene, battlerIndex: BattlerIndex, shownIvs: integer) {
    super(scene, battlerIndex);

    this.shownIvs = shownIvs;
  }

  start() {
    super.start();

    if (!this.shownIvs) {
      return this.end();
    }

    const {
      display: { uiTheme },
      general: { hideIvScanner },
    } = settings;
    const pokemon = this.getPokemon();

    let enemyIvs: number[] = [];
    let statsContainer: Phaser.GameObjects.Sprite[] = [];
    let statsContainerLabels: Phaser.GameObjects.Sprite[] = [];
    const enemyField = this.scene.getEnemyField();
    for (let e = 0; e < enemyField.length; e++) {
      enemyIvs = enemyField[e].ivs;
      const currentIvs = this.scene.gameData.dexData[enemyField[e].species.getRootSpeciesId()].ivs; // we are using getRootSpeciesId() here because we want to check against the baby form, not the mid form if it exists
      const ivsToShow = this.scene.ui.getMessageHandler().getTopIvs(enemyIvs, this.shownIvs);
      statsContainer = enemyField[e].getBattleInfo().getStatsValueContainer().list as Phaser.GameObjects.Sprite[];
      statsContainerLabels = statsContainer.filter((m) => m.name.indexOf("icon_stat_label") >= 0);
      for (let s = 0; s < statsContainerLabels.length; s++) {
        const ivStat = Stat[statsContainerLabels[s].frame.name];
        if (enemyIvs[ivStat] > currentIvs[ivStat] && ivsToShow.indexOf(Number(ivStat)) >= 0) {
          const hexColour =
            enemyIvs[ivStat] === 31
              ? getTextColor(TextStyle.PERFECT_IV, false, uiTheme)
              : getTextColor(TextStyle.SUMMARY_GREEN, false, uiTheme);
          const hexTextColour = Phaser.Display.Color.HexStringToColor(hexColour).color;
          statsContainerLabels[s].setTint(hexTextColour);
        }
        statsContainerLabels[s].setVisible(true);
      }
    }

    if (!hideIvScanner) {
      this.scene.ui.showText(
        i18next.t("battle:ivScannerUseQuestion", { pokemonName: getPokemonNameWithAffix(pokemon) }),
        null,
        () => {
          this.scene.ui.setMode(
            Mode.CONFIRM,
            () => {
              this.scene.ui.setMode(Mode.MESSAGE);
              this.scene.ui.clearText();
              new CommonBattleAnim(CommonAnim.LOCK_ON, pokemon, pokemon).play(this.scene, false, () => {
                this.scene.ui
                  .getMessageHandler()
                  .promptIvs(pokemon.id, pokemon.ivs, this.shownIvs)
                  .then(() => this.end());
              });
            },
            () => {
              this.scene.ui.setMode(Mode.MESSAGE);
              this.scene.ui.clearText();
              this.end();
            },
          );
        },
      );
    } else {
      this.end();
    }
  }
}

import Phaser from "phaser";

import BombKing from "./BombKing";
import Boxing from "./Boxing";
import Crown from "./Crown";

class ResultText extends Phaser.GameObjects.Text {
  constructor(scene) {
    super(
      scene,
      scene.cameras.main.width / 2,
      scene.cameras.main.height / 2 -
        scene.cameras.main.height / 4 / scene.cameras.main.zoom,
      "",
      {
        fontFamily: "Arial Black",
        fontSize: 100,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
        fontFamily: "BMJUA",
      }
    );
    this.scene = scene;
    this.setDepth(100);
    this.setScrollFactor(0);
    this.setOrigin(0.5, 0);
    this.scene.add.existing(this);

    this.winnerText = null;
    this.punchKingText = null;
    this.bombmasterText = null;
    this.crownImage = null;
    this.punchKingImage = null;
    this.bombKingImage = null;
  }

  createCrownImage() {
    if (this.crownImage) {
      this.crownImage.destroy();
      this.crownImage = null;
    }
    this.crownImage = new Crown(this.scene, this);
  }

  createPunchKingImage() {
    if (this.punchKingImage) {
      this.punchKingImage.destroy();
      this.punchKingImage = null;
    }
    this.punchKingImage = new Boxing(this.scene, this);
  }

  createBombKingImage() {
    if (this.bombKingImage) {
      this.bombKingImage.destroy();
      this.bombKingImage = null;
    }
    this.bombKingImage = new BombKing(this.scene, this);
  }

  showWinner(name) {
    this.createCrownImage();

    this.winnerSound = this.scene.sound.add("winner_sound", { volume: 0.2 });
    this.winnerSound.play();

    this.winnerText = `최종 우승자!! ${name}`;
    this.setText(this.winnerText);
  }

  showPunchKing(name) {
    this.createPunchKingImage();

    this.winnerSound = this.scene.sound.add("winner_sound", { volume: 0.2 });
    this.winnerSound.play();

    this.punchKingText = `동 네 깡 패 !! ${name}`;
    this.setText(this.punchKingText);
  }

  showBombMaster(name) {
    this.createBombKingImage();

    this.winnerSound = this.scene.sound.add("winner_sound", { volume: 0.2 });
    this.winnerSound.play();

    this.bombMasterText = `폭탄돌리기왕 ${name}`;
    this.setText(this.bombMasterText);
  }

  del() {
    this.setText("");

    if (this.crownImage) {
      this.crownImage.destroy();
      this.crownImage = null;
    }
    if (this.punchKingImage) {
      this.punchKingImage.destroy();
      this.punchKingImage = null;
    }
    if (this.bombKingImage) {
      this.bombKingImage.destroy();
      this.bombKingImage = null;
    }
  }

  destroy() {
    this.del();
    super.destroy();
  }
}

export default ResultText;

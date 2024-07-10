import Bomb_master from "./Bomb_master";
import Crown from "./Crown";
import Boxing from "./Boxing";

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
    this.bomb_masterImage = null;
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

  createBomb_masterImage() {
    if (this.bomb_masterImage) {
      this.bomb_masterImage.destroy();
      this.bomb_masterImage = null;
    }
    this.bomb_masterImage = new Bomb_master(this.scene, this);
  }

  showWinner(name) {
    this.createCrownImage();

    this.winnerSound = this.scene.sound.add("winner_sound", { volume: 0.2 });
    this.winnerSound.play();

    this.winnerText = `최종 우승자!! ${name}`;
    this.setText(this.winnerText);
    this.setAlpha(1);
    this.scene.time.delayedCall(
      5000,
      () => {
        this.setAlpha(0);
        if (this.crownImage) {
          this.crownImage.destroy();
          this.crownImage = null;
        }
        if (this.winnerText) {
          this.winnerText = null;
        }
      },
      [],
      this.scene
    );
  }

  showPunchKing(name) {
    this.createPunchKingImage();

    this.winnerSound = this.scene.sound.add("winner_sound", { volume: 0.2 });
    this.winnerSound.play();

    this.punchKingText = `동 네 깡 패 !! ${name}`;
    this.setText(this.punchKingText);
    this.setAlpha(1);
    this.scene.time.delayedCall(
      5000,
      () => {
        this.setAlpha(0);
        if (this.punchKingImage) {
          this.punchKingImage.destroy();
          this.punchKingImage = null;
        }
        if (this.punchKingText) {
          this.punchKingText = null;
        }
      },
      [],
      this.scene
    );
  }

  showBombMaster(name) {
    this.createBomb_masterImage();

    this.winnerSound = this.scene.sound.add("winner_sound", { volume: 0.2 });
    this.winnerSound.play();

    this.bombMasterText = `폭탄돌리기왕 ${name}`;
    this.setText(this.bombMasterText);
    this.setAlpha(1);

    this.scene.time.delayedCall(
      5000,
      () => {
        this.setAlpha(0);
        if (this.bomb_masterImage) {
          this.bomb_masterImage.destroy();
          this.bomb_masterImage = null;
        }
        if (this.bombMasterText) {
          this.bombMasterText = null;
        }
      },
      [],
      this.scene
    );
  }

  destroy() {
    if (this.crownImage) {
      this.crownImage.destroy();
      this.crownImage = null;
    }
    if (this.punchKingImage) {
      this.punchKingImage.destroy();
      this.punchKingImage = null;
    }
    if (this.bomb_masterImage) {
      this.bomb_masterImage.destroy();
      this.bomb_masterImage = null;
    }
    super.destroy();
  }
}

export default ResultText;

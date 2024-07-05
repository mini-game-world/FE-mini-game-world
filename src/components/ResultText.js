import Bomb_master from "./Bomb_master";
import Crown from "./Crown";
import Punching_bag from "./Punching_bag";
import Item from "./Item";

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
    this.crownImage = null;
    this.punching_bagImage = null;
    this.bomb_masterImage = null;
  }

  createCrownImage() {
    if (this.crownImage) {
      this.crownImage.destroy();
      this.crownImage = null;
    }
    this.crownImage = new Crown(this.scene, this);
  }

  createPunching_bagImage() {
    if (this.punching_bagImage) {
      this.punching_bagImage.destroy();
      this.punching_bagImage = null;
    }
    this.punching_bagImage = new Punching_bag(this.scene, this);
  }

  createBomb_masterImage() {
    if (this.bomb_masterImage) {
      this.bomb_masterImage.destroy();
      this.bomb_masterImage = null;
    }
    this.bomb_masterImage = new Bomb_master(this.scene, this);
  }

  showWinner(name) {
    Item.clearEffects(this.scene);
    if (this.winnerText) {
      this.winnerText.destroy();
    }
    this.createCrownImage();

    this.winnerSound = this.scene.sound.add("winner_sound", { volume: 0.2 });
    this.winnerSound.play();

    this.setText(`최종 우승자!! ${name}`);
    this.setAlpha(1);

    this.scene.time.delayedCall(
      5000,
      () => {
        this.setAlpha(0);
        if (this.crownImage) {
          this.crownImage.destroy();
          this.crownImage = null;
        }
        this.winnerText = null;
      },
      [],
      this.scene
    );
  }

  showPunchingBag(name) {
    if (this.winnerText) {
      this.winnerText.destroy();
    }
    this.createPunching_bagImage();

    this.winnerSound = this.scene.sound.add("winner_sound", { volume: 0.2 });
    this.winnerSound.play();

    this.setText(`동네북!! ${name}`);
    this.setAlpha(1);

    this.scene.time.delayedCall(
      5000,
      () => {
        this.setAlpha(0);
        if (this.punching_bagImage) {
          this.punching_bagImage.destroy();
          this.punching_bagImage = null;
        }
        this.winnerText = null;
      },
      [],
      this.scene
    );
  }

  showBombMaster(name) {
    if (this.winnerText) {
      this.winnerText.destroy();
    }
    this.createBomb_masterImage();

    this.winnerSound = this.scene.sound.add("winner_sound", { volume: 0.2 });
    this.winnerSound.play();

    this.setText(`폭탄돌리기왕 ${name}`);
    this.setAlpha(1);

    this.scene.time.delayedCall(
      5000,
      () => {
        this.setAlpha(0);
        if (this.bomb_masterImage) {
          this.bomb_masterImage.destroy();
          this.bomb_masterImage = null;
        }
        this.winnerText = null;
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
    if (this.punching_bagImage) {
      this.punching_bagImage.destroy();
      this.punching_bagImage = null;
    }
    if (this.bomb_masterImage) {
      this.bomb_masterImage.destroy();
      this.bomb_masterImage = null;
    }
    this.scene.events.off("update", this.updatePosition, this);
    super.destroy();
  }
}

export default ResultText;

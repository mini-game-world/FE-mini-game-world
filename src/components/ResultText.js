import Bomb_master from "./Bomb_master";
import Crown from "./Crown";
import Punching_bag from "./Punching_bag";

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
    this.punchingbagText = null;
    this.bombmasterText = null;
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
    if (this.winnerText) {
      this.winnerText.destroy();
    }
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
        this.winnerText = "";
      },
      [],
      this.scene
    );
  }

  showPunchingBag(name) {
    if (this.punchingbagText) {
      this.punchingbagText = null;
    }
    this.createPunching_bagImage();

    this.winnerSound = this.scene.sound.add("winner_sound", { volume: 0.2 });
    this.winnerSound.play();
    this.punchingbagText = `동 네 깡 패 !! ${name}`;
    this.setText(this.punchingbagText);
    this.setAlpha(1);
    console.log("showPunchingBag");
    this.scene.time.delayedCall(
      5000,
      () => {
        this.setAlpha(0);
        if (this.punching_bagImage) {
          this.punching_bagImage.destroy();
          this.punching_bagImage = null;
        }
        this.punchingbagText = null;
      },
      [],
      this.scene
    );
  }

  showBombMaster(name) {
    this.clearText();

    this.createBomb_masterImage();

    this.winnerSound = this.scene.sound.add("winner_sound", { volume: 0.2 });
    this.winnerSound.play();

    this.bombMasterText = this.scene.add.text(
      this.scene.cameras.main.width / 2,
      this.scene.cameras.main.height / 2 -
        this.scene.cameras.main.height / 4 / this.scene.cameras.main.zoom,
      `폭탄돌리기왕 ${name}`,
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
    this.bombMasterText.setDepth(101);
    this.bombMasterText.setScrollFactor(0);
    this.bombMasterText.setOrigin(0.5, 0);
    this.bombMasterText.setAlpha(1);

    this.scene.time.delayedCall(
      5000,
      () => {
        this.setAlpha(0);
        if (this.bomb_masterImage) {
          this.bomb_masterImage.destroy();
          this.bomb_masterImage = null;
        }
        this.bombMasterText.setAlpha(0);
        this.bombMasterText.destroy();
        this.bombMasterText = null;
        this.clearText();
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

  clearText() {
    this.setAlpha(0);
    this.setText("");
  }
}

export default ResultText;

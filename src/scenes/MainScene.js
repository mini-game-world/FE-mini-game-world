import Phaser from "phaser";
import BGMManager from "../utils/BGMManager";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  create() {
    this.bgmManager = new BGMManager(this);
    this.bgmManager.playMainBGM();

    this.add
      .image(this.scale.width / 2, this.scale.height / 2, "background")
      .setDisplaySize(this.scale.width, this.scale.height);

    const title = this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 850, "폭탄대소동", {
        fontFamily: "BMJUA",
        fontSize: "400px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 20,
        align: "center",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: title,
      scale: { from: 1, to: 1.1 },
      yoyo: true,
      repeat: -1,
      duration: 1000,
      ease: "Sine.easeInOut",
    });

    this.anims.create({
      key: "move1",
      frames: this.anims.generateFrameNumbers("player_move1", {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "move2",
      frames: this.anims.generateFrameNumbers("player_move2", {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.player1 = this.physics.add
      .sprite(2090, 1936, "player_move1")
      .setScale(2);
    this.player1.setCollideWorldBounds(false);
    this.player1.play("move1");

    this.player2 = this.physics.add
      .sprite(1290, 1936, "player_move2")
      .setScale(2);
    this.player2.setCollideWorldBounds(false);
    this.player2.play("move2");

    this.bomb1 = this.add
      .sprite(this.player1.x - 20, this.player1.y - 180, "bomb")
      .setScale(2);
    this.bomb1.play("bomb");

    this.createButton(
      this.scale.width / 2,
      this.scale.height - 1450,
      "시작하기",
      () => {
        this.sound.play("click_sound");
        this.scene.start("GameScene");
      }
    );

    this.createButton(
      this.scale.width / 2,
      this.scale.height - 1150,
      "튜토리얼",
      () => {
        this.sound.play("click_sound");
        this.scene.start("TutorialScene");
      }
    );

    this.player1.setVelocityX(-400);
    this.player2.setVelocityX(-400);

    // Listen for the shutdown event
    this.events.on("shutdown", this.shutdown, this);
  }

  update() {
    if (this.player1 && this.player1.x < -this.player1.width / 2) {
      this.player1.setX(this.scale.width + this.player1.width / 2);
    }

    if (this.player2 && this.player2.x < -this.player2.width / 2) {
      this.player2.setX(this.scale.width + this.player2.width / 2);
    }

    if (this.bomb1 && this.player1) {
      this.bomb1.setPosition(this.player1.x - 20, this.player1.y - 180);
    }
  }

  createButton(x, y, text, callback) {
    const buttonWidth = 1000;
    const buttonHeight = 200;

    const button = this.add
      .rectangle(x, y, buttonWidth, buttonHeight, 0xadd8e6, 1)
      .setStrokeStyle(8, 0xffffff, 1)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", callback)
      .on("pointerover", () => this.updateButtonColor(button, 0xffb6c1))
      .on("pointerout", () => this.updateButtonColor(button, 0xadd8e6));

    const buttonText = this.add
      .text(x, y, text, {
        fontFamily: "BMJUA",
        fontSize: "74px",
        fill: "#000000",
      })
      .setOrigin(0.5);
  }

  updateButtonColor(button, color) {
    button.setFillStyle(color, 1);
  }

  shutdown() {
    // 씬이 파괴되기 전에 리스너 제거
    this.input.off("pointerdown");
    this.input.off("pointerover");
    this.input.off("pointerout");

    // BGMManager 정리
    if (this.bgmManager) {
      this.bgmManager.stop();
      this.bgmManager = null;
    }

    // Stop and remove all tweens
    this.tweens.killAll();
  }
}

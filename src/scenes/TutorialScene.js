import Phaser from "phaser";
import Tutorial1 from "../components/Tutorial1";
import Tutorial3 from "../components/Tutorial3";
import BGMManager from "../utils/BGMManager";

class TutorialScene extends Phaser.Scene {
  constructor() {
    super("TutorialScene");
  }

  create() {
    this.bgmManager = new BGMManager(this);
    this.bgmManager.playMainBGM();

    this.add
      .image(this.scale.width / 2, this.scale.height / 2, "background")
      .setDisplaySize(this.scale.width, this.scale.height);

    this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 850, "튜토리얼", {
        fontFamily: "BMJUA",
        fontSize: "300px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 20,
        align: "center",
      })
      .setOrigin(0.5);

    const textStyle = {
      fontFamily: "BMJUA",
      fontSize: "74px",
      color: "#000000",
      align: "center",
      lineSpacing: 20,
    };

    this.createButton(this.scale.width - 300, 200, "시작하기", () => {
      this.sound.play("click_sound");
      this.scene.start("GameScene");
    });

    const text1 = this.add
      .text(
        this.scale.width * 0.2,
        this.scale.height * 0.3,
        "1\n\n폭탄이 터지기 전에\n방향키로 움직이며\n다른 플레이어에게 넘겨요!",
        textStyle
      )
      .setOrigin(0.5, 0);

    const text2 = this.add
      .text(
        this.scale.width * 0.5,
        this.scale.height * 0.3,
        "2\n\nZ키를 누르면 공격을\n할 수 있어요.",
        textStyle
      )
      .setOrigin(0.5, 0);

    const text3 = this.add
      .text(
        this.scale.width * 0.8,
        this.scale.height * 0.3,
        "3\n\n아이템을 획득해보세요!",
        textStyle
      )
      .setOrigin(0.5, 0);

    // 튜토리얼 1
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
      .sprite(1000, 1936, "player_move1")
      .setScale(2);
    this.player1.setCollideWorldBounds(false);
    this.player1.play("move1");

    this.player2 = this.physics.add
      .sprite(250, 1936, "player_move2")
      .setScale(2);
    this.player2.setCollideWorldBounds(false);
    this.player2.play("move2");

    this.Tutorial1 = new Tutorial1(this, this.player1, this.player2, "bomb");

    // 튜토리얼 2
    this.anims.create({
      key: "attack1",
      frames: this.anims.generateFrameNumbers("player_attack1", {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "stun2",
      frames: this.anims.generateFrameNumbers("player_stun2", {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "claw_white3",
      frames: this.anims.generateFrameNumbers("claw_white", {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });

    // star 애니메이션 생성
    this.anims.create({
      key: "star1",
      frames: this.anims.generateFrameNumbers("star"),
      frameRate: 3,
      repeat: -1,
    });

    this.player3 = this.physics.add
      .sprite(2100, 1936, "player_attack1")
      .setScale(2);
    this.player3.play("attack1");

    this.player4 = this.physics.add
      .sprite(1700, 1936, "player_stun2")
      .setScale(2);
    this.player4.play("stun2");

    this.claw = this.physics.add.sprite(1900, 1936, "claw_white3").setScale(8);
    this.claw.setDepth(200);
    this.claw.flipX = true;
    this.claw.anims.play("claw_white3", true);

    this.star = this.physics.add.sprite(
      this.player4.x,
      this.player4.y - this.player4.displayHeight / 2.5,
      "star"
    );
    this.star.setScale(2);
    this.star.anims.play("star1", true);

    // 튜토리얼 3
    this.item = this.add.image(2800, 2050, "item").setScale(2).setScale(0.3);
    this.player5 = this.physics.add
      .sprite(3600, 1936, "player_move1")
      .setScale(2);
    this.player5.play("move1");
    this.tutorial3 = new Tutorial3(this, this.player5);

    // Listen for the shutdown event
    this.events.on("shutdown", this.shutdown, this);
  }

  createButton(x, y, text, callback) {
    const buttonWidth = 400;
    const buttonHeight = 150;

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
        fontSize: "64px",
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

    // 모든 물리 객체 정리
    // this.physics.world.colliders.destroy();

    // 모든 게임 객체 정리
    this.children.removeAll();

    // Stop and remove all tweens
    this.tweens.killAll();

    // Remove all listeners
    this.events.off();
  }
}

export default TutorialScene;

import Phaser from "phaser";

class TutorialScene extends Phaser.Scene {
  constructor() {
    super("TutorialScene");

    this.player = null;
    this.cursors = null;
    this.playerSpeed = 200; // 플레이어의 이동 속도 설정
  }

  create() {
    this.add.image(this.scale.width / 2, this.scale.height / 2, "tutorial").setDisplaySize(this.scale.width, this.scale.height);

    this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, "player1").setScale(2); // 초기 스프라이트 시트인 player1을 사용

    this.cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: "move",
      frames: this.anims.generateFrameNumbers("player_move1", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "attack",
      frames: this.anims.generateFrameNumbers("player_attack1", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: 0,
    });

    this.createButton(this.scale.width / 2, this.scale.height - 100, '시작하기', () => {
      this.scene.start('GameScene');
    });
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
      this.player.anims.play("move", true);
      this.player.flipX = false; 
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
      this.player.anims.play("move", true);
      this.player.flipX = true; 
    } else {
      this.player.setVelocityX(0);
      this.player.anims.stop("move");
      this.player.setFrame(0);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-this.playerSpeed);
      this.player.anims.play("move", true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(this.playerSpeed);
      this.player.anims.play("move", true);
    } else {
      this.player.setVelocityY(0);
    }
  }

  createButton(x, y, text, callback) {
    const button = this.add.graphics();
    button.fillStyle(0xADD8E6, 1); 
    button.fillRoundedRect(-250, -50, 500, 100, 20); 
    button.lineStyle(4, 0xFFFFFF, 1); 
    button.strokeRoundedRect(-250, -50, 500, 100, 20);

    const buttonText = this.add.text(0, 0, text, {
      fontFamily: 'Arial',
      fontSize: '48px',
      fill: '#000000'
    }).setOrigin(0.5); 

    const container = this.add.container(x, y, [button, buttonText]);

    container.setSize(500, 100);
    container.setInteractive({ useHandCursor: true }).on('pointerdown', callback);

    container.on('pointerover', () => {
      button.clear();
      button.fillStyle(0xFFB6C1, 1); // 마우스 오버 시 파스텔 핑크 버튼
      button.fillRoundedRect(-250, -50, 500, 100, 20);
      button.lineStyle(4, 0xFFFFFF, 1);
      button.strokeRoundedRect(-250, -50, 500, 100, 20);
    });

    container.on('pointerout', () => {
      button.clear();
      button.fillStyle(0xADD8E6, 1); // 마우스 아웃 시 파스텔 파란색 버튼
      button.fillRoundedRect(-250, -50, 500, 100, 20);
      button.lineStyle(4, 0xFFFFFF, 1);
      button.strokeRoundedRect(-250, -50, 500, 100, 20);
    });
  }
}

export default TutorialScene;

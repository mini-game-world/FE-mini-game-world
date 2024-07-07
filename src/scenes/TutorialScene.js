import Phaser from "phaser";

class TutorialScene extends Phaser.Scene {
  constructor() {
    super("TutorialScene");

    this.player1 = null;
    this.player2 = null;
    this.attackTimeline = null;
  }

  create() {
    this.add.image(this.scale.width / 2, this.scale.height / 2, "background").setDisplaySize(this.scale.width, this.scale.height);

    // 플레이어 1
    this.player1 = this.physics.add.sprite(3156, 1936, "player1").setScale(2); // 초기 위치 설정
    this.player1.setCollideWorldBounds(true); // 화면 경계에서 플레이어가 튕기지 않도록 설정

    // 플레이어 2
    this.player2 = this.physics.add.sprite(2416, 1936, "player2").setScale(2); // 초기 위치 설정
    this.player2.setCollideWorldBounds(true); // 화면 경계에서 플레이어가 튕기지 않도록 설정

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

    // 공격 타임라인 설정
    this.attackTimeline = this.tweens.createTimeline();

    // 텍스트 스타일 설정
    const textStyle = {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center'
    };

    // 플레이어 위치 텍스트 생성
    this.positionText = this.add.text(20, 20, '', textStyle).setScrollFactor(0);

    // 공격 가능 여부 텍스트 생성
    this.attackText = this.add.text(20, 50, 'Press Z to attack', textStyle).setScrollFactor(0);

    // 시작하기 버튼 생성
    this.createButton(this.scale.width / 2, this.scale.height - 100, '시작하기', () => {
      this.startAttack();
    });
  }

  update() {
    // 플레이어 위치 정보 텍스트 업데이트
    this.positionText.setText(`플레이어 위치: x = ${Math.floor(this.player1.x)}, y = ${Math.floor(this.player1.y)}`);
  }

  startAttack() {
    // 타임라인 초기화
    this.attackTimeline.clear();

    // 플레이어 1을 플레이어 2 쪽으로 자동으로 이동하도록 설정
    this.attackTimeline.add({
      targets: this.player1,
      x: this.player2.x,
      y: this.player2.y,
      ease: 'Linear',
      duration: 2000,
      onStart: () => {
        this.player1.anims.play("move", true);
        this.player1.flipX = (this.player1.x > this.player2.x);
      },
      onComplete: () => {
        this.player1.setVelocity(0, 0);
        this.player1.anims.stop("move");
        this.player1.anims.play("attack", true);
        this.player2.visible = true;
      }
    });

    // 공격이 끝나면 다시 초기 위치로 되돌아가도록 설정
    this.attackTimeline.add({
      targets: this.player1,
      x: 3156,
      y: 1936,
      ease: 'Linear',
      duration: 2000,
      onStart: () => {
        this.player1.anims.play("move", true);
        this.player1.flipX = false;
      },
      onComplete: () => {
        this.player1.setVelocity(0, 0);
        this.player1.anims.stop("move");
        this.player1.setFrame(0);
        this.player2.visible = false;
      }
    });

    // 타임라인 실행
    this.attackTimeline.play();
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
      button.fillStyle(0xFFB6C1, 1);
      button.fillRoundedRect(-250, -50, 500, 100, 20);
      button.lineStyle(4, 0xFFFFFF, 1);
      button.strokeRoundedRect(-250, -50, 500, 100, 20);
    });

    container.on('pointerout', () => {
      button.clear();
      button.fillStyle(0xADD8E6, 1);
      button.fillRoundedRect(-250, -50, 500, 100, 20);
      button.lineStyle(4, 0xFFFFFF, 1);
      button.strokeRoundedRect(-250, -50, 500, 100, 20);
    });
  }
}

export default TutorialScene;

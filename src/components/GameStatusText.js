import Phaser from "phaser";

class GameStatusText extends Phaser.GameObjects.Text {
  constructor(scene) {
    super(
      scene,
      scene.cameras.main.width / 2,
      scene.cameras.main.height / 2 -
        scene.cameras.main.height / 3 / scene.cameras.main.zoom,
      "",
      {
        fontSize: "100px",
        color: "#ffffff",
        padding: { x: 10, y: 5 },
        align: "center",
        fontFamily: "BMJUA",
      }
    );
    this.scene = scene;
    this.setOrigin(0.5, 0);
    this.setAlpha(0); // Initially hidden
    this.setScrollFactor(0);
    this.setDepth(100);
    this.scene.add.existing(this);

    this.currentTween = null; // Store the current tween
  }

  showText(
    message,
    fontSize = "64px",
    duration = 3000,
    alphaFrom = 1,
    alphaTo = 0,
    callback = null
  ) {
    if (this.currentTween) {
      this.currentTween.stop(); // Stop the current tween
    }

    this.setFontSize(fontSize);
    this.setText(message);
    this.setAlpha(alphaFrom);

    const tweenConfig = {
      targets: this,
      alpha: { from: alphaFrom, to: alphaTo },
      ease: "Cubic.easeOut",
      duration: duration,
      onComplete: () => {
        if (callback) callback();
        this.currentTween = null; // Clear the current tween when done
      },
    };

    this.currentTween = this.scene.tweens.add(tweenConfig);
  }

  showReadyCount(count) {
    this.showText(count, "94px", 1000);
  }

  showStart() {
    this.showText("게임 스타트", "94px", 3000);
  }

  showEnd() {
    this.showText("게임 종료", "94px", 3000, 1, 0, () => {
      this.showWait();
    });
  }

  showProceeding() {
    this.showText(
      "현재 게임이 진행중입니다. 잠시만 기다려주세요",
      "56px",
      0,
      1,
      1
    );
  }

  showWait() {
    this.showText(
      "접속자 수가 11명이상일 때 \n 게임이 시작될 예정입니다. 잠시만 기다려주세요!",
      "56px",
      0,
      1,
      1
    );
  }

  clearText() {
    if (this.currentTween) {
      this.currentTween.stop(); // Stop the current tween
    }
    this.setAlpha(0);
  }
}

export default GameStatusText;

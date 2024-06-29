class GameStatusText {
  constructor(scene) {
    this.scene = scene;
    this.text = this.scene.add
      .text(this.scene.cameras.main.width / 2, 50, "", {
        fontSize: "64px",
        color: "#ffffff",
        padding: { x: 10, y: 5 },
        align: "center",
        fontFamily: "BMJUA",
      })
      .setOrigin(0.5, 0.5);
    this.text.setAlpha(0); // Initially hidden
    this.text.setScrollFactor(0);
    this.text.setDepth(100);

    this.currentTween = null; // Store the current tween
  }

  showText(
    message,
    y = 50,
    fontSize = "64px",
    duration = 3000,
    alphaFrom = 1,
    alphaTo = 0,
    callback = null
  ) {
    if (this.currentTween) {
      this.currentTween.stop(); // Stop the current tween
    }

    this.text.setFontSize(fontSize);
    this.text.setY(y);
    this.text.setText(message);
    this.text.setAlpha(alphaFrom);

    const tweenConfig = {
      targets: this.text,
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
    this.showText(count, 50, "64px", 1000);
  }

  showStart() {
    this.showText("게임 스타트", 50, "64px", 3000);
  }

  showEnd() {
    this.showText("게임 종료", 50, "64px", 3000, 1, 0, () => {
      this.showWait();
    });
  }

  showProceeding() {
    this.showText(
      "현재 게임이 진행중입니다. 잠시만 기다려주세요",
      100,
      "36px",
      0,
      1,
      1
    );
  }

  showWait() {
    this.showText(
      "접속자 수가 11명이상일 때 \n 게임이 시작될 예정입니다. 잠시만 기다려주세요!",
      100,
      "36px",
      0,
      1,
      1
    );
  }

  clearText() {
    if (this.currentTween) {
      this.currentTween.stop(); // Stop the current tween
    }
    this.text.setAlpha(0);
  }
}

export default GameStatusText;
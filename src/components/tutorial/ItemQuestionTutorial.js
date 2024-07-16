export default class ItemQuestionTutorial {
  constructor(scene, player5) {
    this.scene = scene;
    this.player5 = player5;

    this.originalX = 3600;
    this.originalY = 1936;

    this.tutorial3();
  }

  tutorial3() {
    this.gotoItem(() => {
      this.showQuestion(() => {
        this.gotoOriginalPosition(() => {
          if (this.scene && this.player5) {
            this.tutorial3();
          }
        });
      });
    });
  }

  gotoItem(callback) {
    if (this.scene.item && this.player5) {
      this.scene.item.setVisible(true);
      this.player5.setFlipX(false);
      this.scene.tweens.add({
        targets: this.player5,
        x: 2800,
        y: 1936,
        duration: 2000,
        ease: "Linear",
        onComplete: () => {
          if (this.player5 && this.scene.item) {
            this.player5.body.setVelocity(0); // 이동 중지
            this.scene.item.setVisible(false); // 아이템 숨김
            callback();
          }
        },
      });
    }
  }

  showQuestion(callback) {
    if (this.player5) {
      this.question = this.scene.add
        .image(this.player5.x - 50, this.player5.y - 200, "question")
        .setScale(0.3);

      this.scene.time.delayedCall(
        1000,
        () => {
          if (this.question) {
            this.question.setVisible(false);
          }
          callback();
        },
        [],
        this
      );
    }
  }

  gotoOriginalPosition(callback) {
    if (this.player5) {
      this.scene.tweens.add({
        targets: this.player5,
        x: this.originalX,
        y: this.originalY,
        duration: 2000,
        ease: "Linear",
        onComplete: () => {
          if (this.player5) {
            callback();
          }
        },
      });
      this.player5.setFlipX(true);
    }
  }
}

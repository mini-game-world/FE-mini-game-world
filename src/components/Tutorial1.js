export default class Tutorial1 {
  constructor(scene, player1, player2, bombTexture) {
    this.scene = scene;
    this.player1 = player1;
    this.player2 = player2;
    this.bombTexture = bombTexture;

    this.bombWithPlayer1 = true;

    this.bomb = this.scene.add
      .sprite(this.player1.x - 20, this.player1.y - 180, this.bombTexture)
      .setScale(2);
    this.bomb.play("bomb");

    this.tutorial1();
  }

  tutorial1() {
    if (this.bombWithPlayer1) {
      this.gotoPlayer2(() => {
        this.bombWithPlayer1 = false;

        this.gotoPlayer1(() => {
          this.bombWithPlayer1 = true;
          if (this.bomb && this.player1) {
            this.bomb.setPosition(this.player1.x - 20, this.player1.y - 180);
            this.bomb.play("bomb");
          }
          this.tutorial1();
        });
      });
    }
  }

  gotoPlayer2(callback) {
    if (this.player1 && this.player2) {
      this.player1.setFlipX(false);
      this.scene.tweens.add({
        targets: this.player1,
        x: this.player2.x,
        y: this.player2.y,
        duration: 2000,
        ease: "Linear",
        onComplete: () => {
          if (this.player1 && this.player2) {
            callback();
          }
        },
      });

      if (this.bomb) {
        this.scene.tweens.add({
          targets: this.bomb,
          x: this.player2.x - 20,
          y: this.player2.y - 180,
          duration: 2000,
          ease: "Linear",
        });
      }
    }
  }

  gotoPlayer1(callback) {
    if (this.player1) {
      this.scene.tweens.add({
        targets: this.player1,
        x: 1200,
        y: 2456,
        duration: 2000,
        ease: "Linear",
        onComplete: () => {
          if (this.player1) {
            callback();
          }
        },
      });
      this.player1.setFlipX(true);
    }
  }
}

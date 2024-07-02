class PunchingBagText extends Phaser.GameObjects.Text {
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
  
      this.punchingBagText = null;
    }
  
    showPunchingBag(name) {
      if (this.punchingBagText) {
        this.punchingBagText.destroy();
      }
  
      this.winnerSound = this.scene.sound.add("winner_sound", { volume: 0.2 });
      this.winnerSound.play();
  
      this.setText(`동네북!! ${name}`);
      this.setAlpha(1);
  
      this.scene.time.delayedCall(
        5000,
        () => {
          this.setAlpha(0);
          this.punchingBagText = null;
        },
        [],
        this.scene
      );
    }
  
    destroy() {
      this.scene.events.off("update", this.updatePosition, this);
      super.destroy();
    }
  }
  
  export default PunchingBagText;
  
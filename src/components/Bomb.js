import Phaser from "phaser";

class Bomb extends Phaser.GameObjects.Sprite {
    constructor(scene, player) {
        super(scene, player.x, player.y, "bomb");
        this.scene = scene;
        this.player = player;
        this.isSelfInitiated = this.player.isSelfInitiated;

        this.scene.add.existing(this);

        if (this.isSelfInitiated) {
            this.timerSound = this.scene.sound.add("timer_sound");
            this.timerSound.play();
        }

        this.play("bomb");

        this.scale = 1.2;
        this.setOrigin(0.5, 0.8); // Adjust the origin to be above the player's head
        this.setDepth(31); // Ensure the bomb is above the player sprite

        this.updatePosition();
    }

    updatePosition() {
        this.setPosition(this.player.x, this.player.y - 50); // Adjust the Y offset as needed
    }

    destroy() {
        this.stopSound();
        super.destroy();
    }

    stopSound() {
        if (this.timerSound) {
            this.timerSound.stop();
        }
    }
}

export default Bomb;


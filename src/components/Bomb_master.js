import Phaser from "phaser";

class Bomb_master extends Phaser.GameObjects.Image {
    constructor(scene, target) {
        super(
            scene,
            scene.cameras.main.width / 2,
            scene.cameras.main.height / 2 -
                scene.cameras.main.height / 4 / scene.cameras.main.zoom -
                150,
            "bomb_master"
        );
        this.scene = scene;
        this.target = target;

        this.setOrigin(0.5, 1);
        this.setDepth(101);
        this.setScale(0.5);
        this.setScrollFactor(0);

        this.scene.add.existing(this);
    }

    destroy() {
        super.destroy();
    }
}

export default Bomb_master;


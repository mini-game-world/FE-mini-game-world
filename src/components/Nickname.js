import Phaser from "phaser";

class Nickname extends Phaser.GameObjects.Text {
    constructor(scene, player, text) {
        super(scene, player.x, player.y, text, {
            fontSize: "28px",
            fill: "#ffffff",
            align: "center",
            fontFamily: "Bazzi",
            stroke: "#000000",
            strokeThickness: 2,
        });
        this.scene = scene;
        this.player = player;
        this.scene.add.existing(this);

        this.setOrigin(0.5, -0.7);
        this.setDepth(40);

        this.updatePosition(); // 생성 시 위치를 즉시 업데이트합니다.
    }

    updatePosition() {
        this.setPosition(
            this.player.x,
            this.player.y + 50 * (this.player.scale + 0.8)
        );
    }

    destroy() {
        super.destroy();
    }
}

export default Nickname;


import Phaser from "phaser";

export default class Mob extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, animkey, initHp, droprate) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.play(animkey);
        this.setDepth(10);
        this.scale = 2;

        this.m_speed = 50;
        this.m_hp = initHp;
        this.m_droprate = droprate;

        if (texture === "mob1") {
            this.setBodySize(24, 14, false);
            this.setOffset(0, 14);
        } if (texture === "mob2") {
            this.setBodySize(24, 32);
        } if (texture === "mob3") {
            this.setBodySize(24, 32);
        } if (texture === "mob4") {
            this.setBodySize(24, 32);
        } if (texture === "lion") {
            this.setBodySize(40, 64);
        }

        this.m_events = [];
        this.m_events.push(
            this.scene.time.addEvent({
                delay: 100,
                callback: () => {
                    scene.physics.moveToObject(this, scene.m_player, this.m_speed);
                },
                loop: true,
            })
        );

        scene.events.on("update", (time, delta) => {
            this.update(time, delta);
        }); // Scene의 update가 실행될 때마다 mob도 같이 update되도록 구현
    }

    update() {
        if(!this.body) return;

        if (this.x < this.scene.m_player.x) this.flipX = true;
        else this.flipX = false;
    }
}
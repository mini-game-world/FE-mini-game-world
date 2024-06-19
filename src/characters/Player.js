import Phaser from "phaser";
import Config from "../Config";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(
        scene,
        x = Config.width / 2,
        y = Config.height / 2,
       
    ) {
        super(scene, x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scale = 0.4;
        this.setDepth(20);

        this.setBodySize(28, 32);

        this.m_moving = false;
        this.m_attacking = false;
        this.m_canMove = true;
        this.hasBomb = false;

        // 폭탄 스프라이트 추가
        // this.play("bomb_anim");
        this.bombSprite = scene.add.sprite(this.x, this.y - 40, 'bomb').setScale(0.3);
        this.bombSprite.play("bomb_anim"); // 폭탄 애니메이션 재생
        this.bombSprite.setVisible(false); // 초기에는 보이지 않도록 설정
    }

    move(vector) {
        if (this.m_attacking || !this.m_canMove) return;
        let PLAYER_SPEED = 3;

        const previousPosition = { x: this.x, y: this.y };

        this.x += vector[0] * PLAYER_SPEED;
        this.y += vector[1] * PLAYER_SPEED;

        if (vector[0] === -1) this.flipX = false;
        else if (vector[0] === 1) this.flipX = true;

        if (this.x !== previousPosition.x || this.y !== previousPosition.y) {
            this.scene.socket.emit("playerMovement", {
                x: this.x,
                y: this.y,
            });
        }
        // 폭탄 스프라이트 위치 업데이트
        this.bombSprite.setPosition(this.x, this.y - 50);
    }

    attack() {
        if (this.m_attacking) return; // 이미 공격 중이면 아무것도 하지 않음
        this.m_attacking = true;
        this.play("attack", true);
        this.once("animationcomplete", () => {
            this.m_attacking = false;
            if (!this.m_moving) {
                this.play('player_anim');
                this.m_moving = true;
            } else if (this.m_moving) {

                this.play('player_idle');
                this.m_moving = false;
            }
        });
    }

    showBomb() {
        this.bombSprite.setVisible(true); // 폭탄 스프라이트 보이기
        // this.bombSprite.play("bomb_anim"); // 폭탄 애니메이션 재생
    }

    hideBomb() {
        this.bombSprite.setVisible(false); // 폭탄 스프라이트 숨기기
    }
}

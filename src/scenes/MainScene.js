import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    init() {
        this.time.delayedCall(10, this.create, [], this);
    }

    create() {
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background')
            .setDisplaySize(this.scale.width, this.scale.height);

        const title = this.add.text(
            this.scale.width / 2, this.scale.height / 2 - 850,
            "폭탄대소동",
            {
                fontFamily: "BMJUA",
                fontSize: '400px',
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 20,
                align: "center"
            }
        ).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            scale: { from: 1, to: 1.1 },
            yoyo: true,
            repeat: -1,
            duration: 1000,
            ease: 'Sine.easeInOut'
        });

        this.anims.create({
            key: 'move1',
            frames: this.anims.generateFrameNumbers('player_move1', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'move2',
            frames: this.anims.generateFrameNumbers('player_move2', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'bomb',
            frames: this.anims.generateFrameNumbers('bomb', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        this.player1 = this.physics.add.sprite(2090, 1936, "player_move1").setScale(2);
        this.player1.setCollideWorldBounds(false);
        this.player1.play('move1');

        this.player2 = this.physics.add.sprite(1290, 1936, "player_move2").setScale(2);
        this.player2.setCollideWorldBounds(false);
        this.player2.play('move2');

        this.bomb1 = this.add.sprite(this.player1.x - 20, this.player1.y - 180, 'bomb').setScale(2);
        this.bomb1.play('bomb');

        this.createButton(this.scale.width / 2, this.scale.height - 1450, '시작하기', () => {
            this.scene.start('GameScene');
        });

        this.createButton(this.scale.width / 2, this.scale.height - 1150, '튜토리얼', () => {
            this.scene.start('TutorialScene');
        });

        this.player1.setVelocityX(-400);
        this.player2.setVelocityX(-400);
    }

    update() {
        if (this.player1.x < -this.player1.width / 2) {
            this.player1.setX(this.scale.width + this.player1.width / 2);
        }

        if (this.player2.x < -this.player2.width / 2) {
            this.player2.setX(this.scale.width + this.player2.width / 2);
        }

        this.bomb1.setPosition(this.player1.x - 20, this.player1.y - 180);
    }

    createButton(x, y, text, callback) {
        const button = this.add.graphics();
        button.fillStyle(0xADD8E6, 1);
        button.fillRoundedRect(-500, -100, 1000, 200, 40);
        button.lineStyle(8, 0xFFFFFF, 1);
        button.strokeRoundedRect(-500, -100, 1000, 200, 40);

        const buttonText = this.add.text(0, 0, text, {
            fontFamily: 'BMJUA',
            fontSize: '74px',
            fill: '#000000'
        }).setOrigin(0.5);

        const container = this.add.container(x, y, [button, buttonText]);

        container.setSize(1000, 200);
        container.setInteractive({ useHandCursor: true }).on('pointerdown', callback);

        container.on('pointerover', () => {
            button.clear();
            button.fillStyle(0xFFB6C1, 1);
            button.fillRoundedRect(-500, -100, 1000, 200, 40);
            button.lineStyle(8, 0xFFFFFF, 1);
            button.strokeRoundedRect(-500, -100, 1000, 200, 40);
        });

        container.on('pointerout', () => {
            button.clear();
            button.fillStyle(0xADD8E6, 1);
            button.fillRoundedRect(-500, -100, 1000, 200, 40);
            button.lineStyle(8, 0xFFFFFF, 1);
            button.strokeRoundedRect(-500, -100, 1000, 200, 40);
        });
    }
}

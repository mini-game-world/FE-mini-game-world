import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        this.add.text(this.scale.width / 2, 1000, '폭탄대소동', { fontSize: '320px', fill: '#fff' }).setOrigin(0.5);

        this.createButton(this.scale.width / 2, this.scale.height - 550, 'Start Game', () => this.scene.start('GameScene'));
        this.createButton(this.scale.width / 2, this.scale.height - 350, 'View Tutorial', () => this.scene.start('TutorialScene'));
    }

    createButton(x, y, text, callback) {
        const button = this.add.graphics();
        button.fillStyle(0x0000ff, 1); // 파란색 버튼
        button.fillRoundedRect(-250, -50, 500, 100, 20); // 버튼의 크기 및 모서리 반경
        button.lineStyle(4, 0xffffff, 1); // 흰색 테두리
        button.strokeRoundedRect(-250, -50, 500, 100, 20); // 테두리의 크기 및 모서리 반경

        const buttonText = this.add.text(0, 0, text, { fontSize: '48px', fill: '#fff' }).setOrigin(0.5); // 폰트 크기를 48px로 조정

        const container = this.add.container(x, y, [button, buttonText]);

        container.setSize(500, 100);
        container.setInteractive({ useHandCursor: true }).on('pointerdown', callback);

        container.on('pointerover', () => {
            button.clear();
            button.fillStyle(0xff0000, 1); // 마우스 오버 시 빨간색 버튼
            button.fillRoundedRect(-250, -50, 500, 100, 20);
            button.lineStyle(4, 0xffffff, 1);
            button.strokeRoundedRect(-250, -50, 500, 100, 20);
        });

        container.on('pointerout', () => {
            button.clear();
            button.fillStyle(0x0000ff, 1); // 마우스 아웃 시 파란색 버튼
            button.fillRoundedRect(-250, -50, 500, 100, 20);
            button.lineStyle(4, 0xffffff, 1);
            button.strokeRoundedRect(-250, -50, 500, 100, 20);
        });
    }
}

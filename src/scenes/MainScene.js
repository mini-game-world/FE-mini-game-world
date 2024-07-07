import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        // 배경 이미지 설정
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background')
            .setDisplaySize(this.scale.width, this.scale.height);

        this.add.text(
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

        this.player1 = this.physics.add.sprite(3156, 1936, "player1").setScale(2); // 초기 위치 설정
        this.player1.setCollideWorldBounds(true); // 화면 경계에서 플레이어가 튕기지 않도록 설정

        this.player2 = this.physics.add.sprite(916, 1936, "player2").setScale(2); // 초기 위치 설정
        this.player2.setCollideWorldBounds(true); // 화면 경계에서 플레이어가 튕기지 않도록 설정

        this.createButton(this.scale.width / 2, this.scale.height - 1450, '시작하기', () => {
            this.scene.start('GameScene');
        });
        this.createButton(this.scale.width / 2, this.scale.height - 1150, '튜토리얼', () => {
            this.scene.start('TutorialScene');
        });
    }

    createButton(x, y, text, callback) {
        const button = this.add.graphics();
        button.fillStyle(0xADD8E6, 1); // 파스텔 파란색 버튼
        button.fillRoundedRect(-500, -100, 1000, 200, 40); // 버튼의 크기 및 모서리 반경을 키움
        button.lineStyle(8, 0xFFFFFF, 1); // 흰색 테두리
        button.strokeRoundedRect(-500, -100, 1000, 200, 40); // 테두리의 크기 및 모서리 반경을 키움

        const buttonText = this.add.text(0, 0, text, {
            fontFamily: 'BMJUA',
            fontSize: '74px', // 버튼 텍스트 크기 증가
            fill: '#000000' // 검정색 텍스트
        }).setOrigin(0.5);

        const container = this.add.container(x, y, [button, buttonText]);

        container.setSize(1000, 200); // 컨테이너 크기 조정
        container.setInteractive({ useHandCursor: true }).on('pointerdown', callback);

        container.on('pointerover', () => {
            button.clear();
            button.fillStyle(0xFFB6C1, 1); // 마우스 오버 시 파스텔 핑크 버튼
            button.fillRoundedRect(-500, -100, 1000, 200, 40);
            button.lineStyle(8, 0xFFFFFF, 1);
            button.strokeRoundedRect(-500, -100, 1000, 200, 40);
        });

        container.on('pointerout', () => {
            button.clear();
            button.fillStyle(0xADD8E6, 1); // 마우스 아웃 시 파스텔 파란색 버튼
            button.fillRoundedRect(-500, -100, 1000, 200, 40);
            button.lineStyle(8, 0xFFFFFF, 1);
            button.strokeRoundedRect(-500, -100, 1000, 200, 40);
        });
    }
}

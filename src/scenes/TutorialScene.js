import Phaser from "phaser";
import Tutorial1 from "../components/Tutorial1"; // 컴포넌트 임포트

class TutorialScene extends Phaser.Scene {
  constructor() {
    super("TutorialScene");
  }

  create() {
    // 배경 이미지 추가
    this.add.image(this.scale.width / 2, this.scale.height / 2, "background").setDisplaySize(this.scale.width, this.scale.height);

    // 텍스트 추가
    this.add.text(
      this.scale.width / 2, 
      this.scale.height / 2 - 850,
      "튜토리얼",
      {
        fontFamily: "BMJUA",
        fontSize: '300px',
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 20,
        align: "center"
      }
    ).setOrigin(0.5);

    // 텍스트 스타일 정의
    const textStyle = {
      fontFamily: 'BMJUA',
      fontSize: '74px',
      color: '#000000',
      align: 'center',  
      lineSpacing: 20  
    };

    // 튜토리얼 설명 텍스트 추가
    const text1 = this.add.text(this.scale.width * 0.2, this.scale.height * 0.3, "1\n\n폭탄이 터지기 전에\n방향키로 움직이며\n다른 플레이어에게 넘겨요!", textStyle)
                      .setOrigin(0.5, 0);  

    const text2 = this.add.text(this.scale.width * 0.5, this.scale.height * 0.3, "2\n\nZ키를 누르면 공격을\n할 수 있어요.", textStyle)
                      .setOrigin(0.5, 0);  

    const text3 = this.add.text(this.scale.width * 0.8, this.scale.height * 0.3, "3\n\n아이템을 획득해보세요!", textStyle)
                      .setOrigin(0.5, 0);


    // 애니메이션 생성
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

    this.player1 = this.physics.add.sprite(1000, 1936, "player_move1").setScale(2);
    this.player1.setCollideWorldBounds(false); 
    this.player1.play('move1'); 

    this.player2 = this.physics.add.sprite(250, 1936, "player_move2").setScale(2);
    this.player2.setCollideWorldBounds(false); 
    this.player2.play('move2'); 

    this.Tutorial1 = new Tutorial1(this, this.player1, this.player2, 'bomb');
  }
}

export default TutorialScene;

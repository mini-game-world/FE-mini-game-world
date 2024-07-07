import Phaser from "phaser";
import Tutorial1 from "../components/Tutorial1";
import Tutorial3 from "../components/Tutorial3";

class TutorialScene extends Phaser.Scene {
  constructor() {
    super("TutorialScene");
  }

  create() {
    this.add.image(this.scale.width / 2, this.scale.height / 2, "background").setDisplaySize(this.scale.width, this.scale.height);

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

    const textStyle = {
      fontFamily: 'BMJUA',
      fontSize: '74px',
      color: '#000000',
      align: 'center',  
      lineSpacing: 20  
    };

    const text1 = this.add.text(this.scale.width * 0.2, this.scale.height * 0.3, "1\n\n폭탄이 터지기 전에\n방향키로 움직이며\n다른 플레이어에게 넘겨요!", textStyle)
                      .setOrigin(0.5, 0);  

    const text2 = this.add.text(this.scale.width * 0.5, this.scale.height * 0.3, "2\n\nZ키를 누르면 공격을\n할 수 있어요.", textStyle)
                      .setOrigin(0.5, 0);  

    const text3 = this.add.text(this.scale.width * 0.8, this.scale.height * 0.3, "3\n\n아이템을 획득해보세요!", textStyle)
                      .setOrigin(0.5, 0);

    // 튜토리얼 1
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

    // 튜토리얼 2
    this.anims.create({
      key: 'attack1',
      frames: this.anims.generateFrameNumbers('player_attack1', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'stun2',
      frames: this.anims.generateFrameNumbers('player_stun2', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'claw_white3',
      frames: this.anims.generateFrameNumbers('claw_white', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });

    // star 애니메이션 생성
    this.anims.create({
      key: 'star',
      frames: this.anims.generateFrameNumbers('star', { start: 0, end: 3 }),
      frameRate: 3,
      repeat: -1
    });

    this.player3 = this.physics.add.sprite(2100, 1936, "player_attack1").setScale(2);
    this.player3.play('attack1'); 
    
    this.player4 = this.physics.add.sprite(1700, 1936, "player_stun2").setScale(2);
    this.player4.play('stun2'); 
    
    this.claw = this.physics.add.sprite(1900, 1936, 'claw_white3').setScale(8);
    this.claw.setDepth(200);
    this.claw.flipX = true; 
    this.claw.anims.play('claw_white3', true);

    this.star = this.physics.add.sprite(this.player4.x, this.player4.y - this.player4.displayHeight / 2.5, 'star');
    this.star.setScale(2);
    this.star.anims.play('star', true);

    // 튜토리얼 3
    this.anims.create({
        key: 'move1',
        frames: this.anims.generateFrameNumbers('player_move1', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
        });
    
    this.anims.create({
        key: 'question',
        frames: this.anims.generateFrameNumbers('question', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
        });
    
    this.item = this.add.image(2800, 2050, 'item').setScale(2).setScale(0.3);
    this.player5 = this.physics.add.sprite(3600, 1936, "player_move1").setScale(2);
    this.player5.play('move1'); 
    this.tutorial3 = new Tutorial3(this, this.player5);
  }
}

export default TutorialScene;

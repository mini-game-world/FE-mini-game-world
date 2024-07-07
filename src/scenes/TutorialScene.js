import Phaser from "phaser";

class TutorialScene extends Phaser.Scene {
  constructor() {
    super("TutorialScene");
  }

  create() {
    this.add.image(this.scale.width / 2, this.scale.height / 2, "background").setDisplaySize(this.scale.width, this.scale.height);

    this.add.text(
        this.scale.width / 2, this.scale.height / 2 - 850,
        "튜토리얼",
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
  }
}

export default TutorialScene;

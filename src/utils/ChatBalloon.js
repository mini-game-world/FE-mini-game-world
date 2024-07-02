export default class ChatBalloon {
    constructor(player) {
      this.player = player;
  
      this.chatBalloon = player.scene.add.container(player.x, player.y - 50).setDepth(31).setVisible(false);
      this.balloonGraphics = player.scene.add.graphics();
      this.chatText = player.scene.add.text(0, 0, "", {
        fontSize: "24px",
        fill: "#000000",
        padding: { x: 10, y: 5 },
        align: "center",
        wordWrap: { width: 280, useAdvancedWrap: true }
      }).setOrigin(0.5);
  
      this.chatBalloon.add(this.balloonGraphics);
      this.chatBalloon.add(this.chatText);
    }
  
    showChatMessage(message) {
      this.chatText.setText(message);
  
      const padding = 20;
      const balloonWidth = this.chatText.width + padding;
      const balloonHeight = this.chatText.height + padding + 10;
  
      this.balloonGraphics.clear();
      this.balloonGraphics.fillStyle(0xffffff, 1);
      this.balloonGraphics.fillRoundedRect(
        -balloonWidth / 2,
        -balloonHeight / 2,
        balloonWidth,
        balloonHeight - 10,
        15
      );
      this.balloonGraphics.fillTriangle(
        -10,
        balloonHeight / 2 - 10,
        10,
        balloonHeight / 2 - 10,
        0,
        balloonHeight / 2
      );
  
      this.chatBalloon.setVisible(true);
      this.player.scene.time.addEvent({
        delay: 3000,
        callback: () => {
          this.chatBalloon.setVisible(false);
        },
        callbackScope: this
      });
    }
  
    updateChatBalloonPosition() {
      if (this.chatBalloon.visible) {
        this.chatBalloon.setPosition(this.player.x, this.player.y - 50);
      }
    }
  }
  
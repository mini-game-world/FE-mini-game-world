import SocketManager from "./SocketManager";

export default class ChatBox {
  constructor(player) {
    this.player = player;

    this.chatContainer = document.createElement('div');
    this.chatContainer.id = 'chat-container';
    this.chatContainer.style.position = 'fixed';
    this.chatContainer.style.top = '70%';
    this.chatContainer.style.left = '50%';
    this.chatContainer.style.transform = 'translate(-50%, -50%)';
    this.chatContainer.style.height = 'auto';
    this.chatContainer.style.width = '90%';
    this.chatContainer.style.maxWidth = '1000px';
    this.chatContainer.style.backgroundColor = 'white';
    this.chatContainer.style.border = '1px solid black';
    this.chatContainer.style.display = 'none';
    this.chatContainer.style.flexDirection = 'column';
    this.chatContainer.style.borderRadius = '10px';

    document.body.appendChild(this.chatContainer);

    this.chatInputWrapper = document.createElement('div');
    this.chatInputWrapper.id = 'chat-input-wrapper';
    this.chatInputWrapper.style.display = 'flex';
    this.chatInputWrapper.style.flexDirection = 'row';
    this.chatInputWrapper.style.background = 'lightblue';
    this.chatInputWrapper.style.borderRadius = '10px';
    this.chatContainer.appendChild(this.chatInputWrapper);

    this.chatInput = document.createElement('input');
    this.chatInput.id = 'chat-input';
    this.chatInput.type = 'text';
    this.chatInput.placeholder = '대화를 입력해주세요';
    this.chatInput.style.flex = '1';
    this.chatInput.style.padding = '1em';
    this.chatInput.style.fontSize = '1em';
    this.chatInput.style.border = 'none';
    this.chatInput.style.borderRadius = '10px';
    this.chatInputWrapper.appendChild(this.chatInput);

    // 채팅 풍선 생성
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

    this.setupEvents();
  }

  setupEvents() {
    this.chatInput.addEventListener('keydown', (event) => {
      event.stopPropagation();
      if (event.key === 'Enter') {
        this.sendMessage();
      }
    });
  }

  toggleChatBox() {
    if (this.chatContainer.style.display === 'none') {
      this.showChatBox();
    } else {
      this.hideChatBox();
    }
  }

  showChatBox() {
    this.chatContainer.style.display = 'flex';
    this.chatInput.focus();
  }

  hideChatBox() {
    this.chatContainer.style.display = 'none';
    this.chatInput.value = '';
  }

  sendMessage() {
    const message = this.chatInput.value.trim();
    if (message && this.player) {
        console.log(message);
      SocketManager.emitChatMessage(message); 
      this.chatInput.value = '';
    } else {
      this.chatInput.value = ''; 
    }
    this.hideChatBox(); 
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

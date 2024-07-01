import SocketManager from "./SocketManager";

export default class ChatBox {
    constructor(player) {
      this.player = player;
  
      this.chatContainer = document.createElement('div');
      this.chatContainer.id = 'chat-container';
      this.chatContainer.style.position = 'fixed';
      this.chatContainer.style.top = '70%'; // 원하는 y축 위치 설정
      this.chatContainer.style.left = '50%';
      this.chatContainer.style.transform = 'translate(-50%, -50%)';
      this.chatContainer.style.height = 'auto';
      this.chatContainer.style.width = '370px';
      this.chatContainer.style.backgroundColor = 'white';
      this.chatContainer.style.border = '1px solid black';
      this.chatContainer.style.display = 'none';
      this.chatContainer.style.flexDirection = 'column';
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
      this.chatInput.style.padding = '10px';
      this.chatInput.style.border = 'none';
      this.chatInput.style.borderRadius = '10px';
      this.chatInputWrapper.appendChild(this.chatInput);
  
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
      console.log(message);
      console.log(this.player);
      if (message) {
        this.player.showChatMessage(message); // Show message above player
        SocketManager.emitChatMessage(message); // Send message to server
        this.chatInput.value = '';
      }
      this.hideChatBox(); // Ensure the chat box is hidden after sending a message
    }
  }
  
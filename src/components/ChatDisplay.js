import Phaser from "phaser";

export default class ChatDisplay {
  constructor(scene) {
    this.scene = scene;

    this.styles();
  }

  styles() {
    this.chatContainer = document.createElement("div");
    this.chatContainer.id = "chat-display-container";
    this.chatContainer.style.position = "fixed";
    this.chatContainer.style.bottom = "10px"; // Bottom left corner
    this.chatContainer.style.left = "10px"; // Bottom left corner
    this.chatContainer.style.height = "auto";
    this.chatContainer.style.width = "300px"; // Fixed width
    this.chatContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    this.chatContainer.style.color = "white";
    this.chatContainer.style.border = "1px solid black";
    this.chatContainer.style.display = "flex";
    this.chatContainer.style.flexDirection = "column";
    this.chatContainer.style.borderRadius = "10px";
    this.chatContainer.style.padding = "10px";
    this.chatContainer.style.pointerEvents = "none"; // To prevent it from blocking mouse events

    document.body.appendChild(this.chatContainer);

    this.chatContainer.style.fontFamily = "'BMJUA', sans-serif";
  }

  addMessage(playerId, message) {
    const logEntry = document.createElement("div");
    logEntry.textContent = `${playerId}: ${message}`;
    logEntry.style.margin = "5px 0";
    this.chatContainer.appendChild(logEntry);

    // Scroll to the bottom
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;

    // Remove old messages
    while (this.chatContainer.children.length > 5) {
      this.chatContainer.removeChild(this.chatContainer.firstChild);
    }
  }
}

export default class ChatDisplay {
  constructor(scene) {
    this.scene = scene;

    this.styles();
    this.makeDraggable();
    this.makeResizable();
  }

  styles() {
    this.chatContainer = document.createElement("div");
    this.chatContainer.id = "chat-display-container";
    this.chatContainer.style.position = "fixed";
    this.chatContainer.style.bottom = "10px"; // Bottom left corner
    this.chatContainer.style.left = "10px"; // Bottom left corner
    this.chatContainer.style.height = "200px"; // Initial square size
    this.chatContainer.style.width = "200px"; // Initial square size
    this.chatContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    this.chatContainer.style.color = "white";
    this.chatContainer.style.border = "1px solid black";
    this.chatContainer.style.display = "flex";
    this.chatContainer.style.flexDirection = "column";
    this.chatContainer.style.borderRadius = "10px";
    this.chatContainer.style.padding = "10px";
    this.chatContainer.style.pointerEvents = "auto"; // To allow pointer events
    this.chatContainer.style.overflow = "auto"; // Ensures content stays within bounds

    document.body.appendChild(this.chatContainer);

    this.chatContainer.style.fontFamily = "'BMJUA', sans-serif";
  }

  makeDraggable() {
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    this.chatContainer.addEventListener("mousedown", (e) => {
      if (!this.isInResizeArea(e)) {
        isDragging = true;
        dragOffsetX = e.clientX - this.chatContainer.offsetLeft;
        dragOffsetY = e.clientY - this.chatContainer.offsetTop;
        this.chatContainer.style.cursor = "move"; // Change cursor on drag
      }
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        let newX = e.clientX - dragOffsetX;
        let newY = e.clientY - dragOffsetY;

        // Prevent the container from moving outside the viewport
        const containerRect = this.chatContainer.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX + containerRect.width > viewportWidth)
          newX = viewportWidth - containerRect.width;
        if (newY + containerRect.height > viewportHeight)
          newY = viewportHeight - containerRect.height;

        this.chatContainer.style.left = `${newX}px`;
        this.chatContainer.style.top = `${newY}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      this.chatContainer.style.cursor = "default"; // Reset cursor
    });
  }

  makeResizable() {
    let isResizing = false;
    let initialWidth = 0;
    let initialHeight = 0;
    let initialLeft = 0;
    let initialTop = 0;
    let resizeOffsetX = 0;
    let resizeOffsetY = 0;
    let resizeDirection = "";

    this.chatContainer.addEventListener("mousedown", (e) => {
      const rect = this.chatContainer.getBoundingClientRect();
      if (this.isInResizeArea(e)) {
        isResizing = true;
        initialWidth = rect.width;
        initialHeight = rect.height;
        initialLeft = rect.left;
        initialTop = rect.top;
        resizeOffsetX = e.clientX;
        resizeOffsetY = e.clientY;
        resizeDirection = this.getResizeDirection(e, rect);
        this.chatContainer.style.cursor = resizeDirection; // Change cursor on resize
      }
    });

    document.addEventListener("mousemove", (e) => {
      if (isResizing) {
        const dx = e.clientX - resizeOffsetX;
        const dy = e.clientY - resizeOffsetY;

        let newWidth = initialWidth;
        let newHeight = initialHeight;
        let newLeft = initialLeft;
        let newTop = initialTop;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (resizeDirection.includes("e")) {
          newWidth = initialWidth + dx;
          if (newLeft + newWidth > viewportWidth) {
            newWidth = viewportWidth - newLeft;
          }
        }
        if (resizeDirection.includes("s")) {
          newHeight = initialHeight + dy;
          if (newTop + newHeight > viewportHeight) {
            newHeight = viewportHeight - newTop;
          }
        }
        if (resizeDirection.includes("w")) {
          newWidth = initialWidth - dx;
          newLeft = initialLeft + dx;
          if (newLeft < 0) {
            newWidth = initialWidth + initialLeft;
            newLeft = 0;
          }
        }
        if (resizeDirection.includes("n")) {
          newHeight = initialHeight - dy;
          newTop = initialTop + dy;
          if (newTop < 0) {
            newHeight = initialHeight + initialTop;
            newTop = 0;
          }
        }

        this.chatContainer.style.width = `${newWidth}px`;
        this.chatContainer.style.height = `${newHeight}px`;
        this.chatContainer.style.left = `${newLeft}px`;
        this.chatContainer.style.top = `${newTop}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      isResizing = false;
      this.chatContainer.style.cursor = "default"; // Reset cursor
    });

    this.chatContainer.addEventListener("mouseover", (e) => {
      const rect = this.chatContainer.getBoundingClientRect();
      if (this.isInResizeArea(e)) {
        this.chatContainer.style.cursor = this.getResizeDirection(e, rect); // Change cursor on resize area
      } else {
        this.chatContainer.style.cursor = "default"; // Default cursor otherwise
      }
    });
  }

  isInResizeArea(e) {
    const rect = this.chatContainer.getBoundingClientRect();
    const resizeMargin = 10; // Pixels from edge to consider resize area
    return (
      e.clientX >= rect.right - resizeMargin || // Right edge
      e.clientX <= rect.left + resizeMargin || // Left edge
      e.clientY >= rect.bottom - resizeMargin || // Bottom edge
      e.clientY <= rect.top + resizeMargin // Top edge
    );
  }

  getResizeDirection(e, rect) {
    const resizeMargin = 10; // Pixels from edge to consider resize area
    if (
      e.clientX >= rect.right - resizeMargin &&
      e.clientY >= rect.bottom - resizeMargin
    ) {
      return "se-resize"; // Bottom-right corner
    } else if (
      e.clientX >= rect.right - resizeMargin &&
      e.clientY <= rect.top + resizeMargin
    ) {
      return "ne-resize"; // Top-right corner
    } else if (
      e.clientX <= rect.left + resizeMargin &&
      e.clientY >= rect.bottom - resizeMargin
    ) {
      return "sw-resize"; // Bottom-left corner
    } else if (
      e.clientX <= rect.left + resizeMargin &&
      e.clientY <= rect.top + resizeMargin
    ) {
      return "nw-resize"; // Top-left corner
    } else if (e.clientX >= rect.right - resizeMargin) {
      return "e-resize"; // Right edge
    } else if (e.clientX <= rect.left + resizeMargin) {
      return "w-resize"; // Left edge
    } else if (e.clientY >= rect.bottom - resizeMargin) {
      return "s-resize"; // Bottom edge
    } else if (e.clientY <= rect.top + resizeMargin) {
      return "n-resize"; // Top edge
    }
    return "default";
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

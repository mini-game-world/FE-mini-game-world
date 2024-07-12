class CameraManager {
  constructor(scene, bounds = { width: 4160, height: 3200 }, zoom = 1.5) {
    this.scene = scene;
    this.mainCamera = this.scene.cameras.main;
    this.setCameraBounds(bounds.width, bounds.height);
    this.setCameraZoom(zoom);
  }

  setCameraBounds(width, height) {
    this.mainCamera.setBounds(0, 0, width, height);
  }

  setCameraZoom(zoom) {
    this.mainCamera.setZoom(zoom);
  }

  smoothFollow(target, duration = 2000, easing = "Sine.easeInOut") {
    this.mainCamera.stopFollow();
    this.mainCamera.pan(target.x, target.y, duration, easing);

    this.mainCamera.once("camerapancomplete", () => {
      this.mainCamera.startFollow(target);
      if (target.player.isSelfInitiated) {
        target.isWinner = true;
      }
    });
  }

  getCurrentCameraPosition() {
    return { x: this.mainCamera.scrollX, y: this.mainCamera.scrollY };
  }

  getCurrentZoom() {
    return this.mainCamera.zoom;
  }

  moveTo(x, y) {
    this.mainCamera.stopFollow();
    this.mainCamera.setScroll(x, y);
  }

  getCameraBounds(margin = 200) {
    const x = this.mainCamera.worldView.x - margin;
    const y = this.mainCamera.worldView.y - margin;
    const width = this.mainCamera.worldView.width + 2 * margin;
    const height = this.mainCamera.worldView.height + 2 * margin;
    return { x, y, width, height };
  }
}

export default CameraManager;

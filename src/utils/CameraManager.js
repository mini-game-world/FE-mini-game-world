class CameraManager {
  constructor(scene, bounds = { width: 3840, height: 3200 }, zoom = 1.5) {
    this.scene = scene;
    this.mainCamera = this.scene.cameras.main;
    this.setCameraBounds(bounds.width, bounds.height);
    this.setCameraZoom(zoom);
    this.isPanning = false; // 플래그 변수 추가
  }

  setCameraBounds(width, height) {
    this.mainCamera.setBounds(0, 0, width, height);
  }

  setCameraZoom(zoom) {
    this.mainCamera.setZoom(zoom);
  }

  smoothFollow(target, duration = 2000, easing = "Sine.easeInOut") {
    if (!target || this.isPanning) return; // 이미 pan 작업 중이면 리턴

    this.isPanning = true; // 플래그 설정
    this.mainCamera.stopFollow();
    this.mainCamera.pan(target.x, target.y, duration, easing);

    this.mainCamera.once("camerapancomplete", () => {
      this.mainCamera.startFollow(target);
      this.isPanning = false; // 플래그 해제
      if (target && target.player && target.player.isSelfInitiated) {
        target.isWinner = true;
      }
    });
  }

  smoothFollowWinner(target, duration = 2000, easing = "Sine.easeInOut") {
    if (this.isPanning) return; // 이미 pan 작업 중이면 리턴

    this.isPanning = true; // 플래그 설정
    this.mainCamera.stopFollow();
    this.mainCamera.pan(target.x, target.y, duration, easing);

    return new Promise((resolve) => {
      this.mainCamera.once("camerapancomplete", () => {
        this.mainCamera.startFollow(target);
        this.isPanning = false; // 플래그 해제
        resolve();
      });
    });
  }

  switchTarget(target) {
    this.mainCamera.stopFollow();
    this.mainCamera.startFollow(target);
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

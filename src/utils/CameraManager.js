class CameraManager {
  constructor(scene, bounds = { width: 3840, height: 2560 }, zoom = 1.5) {
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
      target.isWinner = true; // 카메라 포커싱 후 이동되게 수정
    });
  }

  // 카메라의 현재 위치를 반환하는 메소드
  getCurrentCameraPosition() {
    return { x: this.mainCamera.scrollX, y: this.mainCamera.scrollY };
  }

  // 카메라의 현재 줌 레벨을 반환하는 메소드
  getCurrentZoom() {
    return this.mainCamera.zoom;
  }

  // 카메라를 특정 위치로 즉시 이동시키는 메소드
  moveTo(x, y) {
    this.mainCamera.stopFollow();
    this.mainCamera.setScroll(x, y);
  }
}

export default CameraManager;

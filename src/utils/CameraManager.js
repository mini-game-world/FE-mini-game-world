class CameraManager {
  constructor(scene) {
    this.scene = scene;
    this.mainCamera = this.scene.cameras.main;
    // this.mainCamera.setBounds(0, 0, 3840, 2560);
    this.mainCamera.setZoom(1.5);
  }

  smoothFollow(target) {
    this.mainCamera.stopFollow();
    this.mainCamera.pan(target.x, target.y, 2000, "Sine.easeInOut");
    this.mainCamera.once("camerapancomplete", () => {
      this.mainCamera.startFollow(target);
      target.isWinner = true; // 카메라 포커싱 후 이동되게 수정...
    });
  }
}

export default CameraManager;

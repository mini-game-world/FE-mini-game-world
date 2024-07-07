class CameraManager {
    constructor(scene) {
        this.scene = scene;
        this.mainCamera = this.scene.cameras.main;
        this.mainCamera.setBounds(0, 0, 3840, 2560);
        this.mainCamera.setZoom(1.5);
        this.isPanning = false; // 추가된 상태 변수
    }

    smoothFollow(target) {
        if (this.isPanning) return; // 이미 팬 중이면 중복 호출 방지

        this.isPanning = true;
        this.mainCamera.stopFollow();
        this.mainCamera.pan(target.x, target.y, 2000, "Sine.easeInOut");

        // 카메라 팬이 완료되었을 때
        this.mainCamera.once("camerapancomplete", () => {
            this.mainCamera.startFollow(target);
            this.isPanning = false; // 팬 상태 해제
            target.isWinner = true;
        });
    }
}

export default CameraManager;


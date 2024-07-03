import Phaser from "phaser";

class Timer {
  constructor(scene, duration) {
    this.scene = scene;
    this.duration = duration;
    this.timerText = scene.add.text(16, 16, `Time: ${duration}`, {
      fontSize: "32px",
      fill: "#fff",
    });

    this.timerEvent = scene.time.addEvent({
      delay: 1000,
      callback: this.tick,
      callbackScope: this,
      loop: true,
    });
  }

  tick() {
    this.duration -= 1;
    this.timerText.setText(`Time: ${this.duration}`);

    if (this.duration <= 0) {
      this.timerEvent.remove(false);
      // 타이머가 끝났을 때의 로직을 추가
    }
  }

  update() {
    // 필요 시 업데이트 로직 추가
  }
}

export default Timer;

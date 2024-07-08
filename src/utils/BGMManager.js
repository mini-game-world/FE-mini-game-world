class BGMManager {
  constructor(scene) {
    this.scene = scene;
    this.playingBGMs = [];
    this.waitingBGMs = [];
    this.mainBGM = null;
    this.currentPlayingBGM = null;
    this.currentWaitingBGM = null;

    this.initBGMs();
  }

  initBGMs() {
    this.playingBGMs = [
      this.scene.sound.add("playingBGM1", { loop: true, volume: 0.2 }),
      this.scene.sound.add("playingBGM2", { loop: true, volume: 0.2 }),
    ];
    this.waitingBGMs = [
      this.scene.sound.add("waitingBGM1", { loop: true, volume: 0.2 }),
      this.scene.sound.add("waitingBGM2", { loop: true, volume: 0.2 }),
    ];

    this.mainBGM = this.scene.sound.add("mainBGM", { loop: true, volume: 0.2 });
  }

  startPlayingBGM() {
    this.stopAllBGMs();

    const randomIndex = Phaser.Math.Between(0, this.playingBGMs.length - 1);
    this.currentPlayingBGM = this.playingBGMs[randomIndex];
    this.currentPlayingBGM.play();
  }

  startWaitingBGM() {
    this.stopAllBGMs();

    const randomIndex = Phaser.Math.Between(0, this.waitingBGMs.length - 1);
    this.currentWaitingBGM = this.waitingBGMs[randomIndex];
    this.currentWaitingBGM.play();
  }

  startMainBGM() {
    this.stopAllBGMs();

    this.mainBGM.play();
  }

  stopAllBGMs() {
    if (this.currentPlayingBGM && this.currentPlayingBGM.isPlaying) {
      this.currentPlayingBGM.stop();
    }
    if (this.currentWaitingBGM && this.currentWaitingBGM.isPlaying) {
      this.currentWaitingBGM.stop();
    }
    if (this.mainBGM && this.mainBGM.isPlaying) {
      this.mainBGM.stop();
    }
  }

  stopMainBGM() {
    if (this.mainBGM && this.mainBGM.isPlaying) {
      this.mainBGM.stop();
    }
  }
}

export default BGMManager;

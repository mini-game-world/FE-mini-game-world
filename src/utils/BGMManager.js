class BGMManager {
  constructor(scene) {
    this.scene = scene;
    this.waitingBgmList = ["waitingBGM1", "waitingBGM2"];
    this.playingBGMList = ["playingBGM1", "playingBGM2"];
    this.mainBGMList = ["mainBGM"];
    this.currentBGM = null;
  }

  playWaitingRandomBGM() {
    const randomIndex = Math.floor(Math.random() * this.waitingBgmList.length);
    const randomBGM = this.waitingBgmList[randomIndex];

    if (this.currentBGM) {
      this.currentBGM.stop();
    }

    this.currentBGM = this.scene.sound.add(randomBGM);
    this.currentBGM.play({ loop: true, volume: 0.2 });
  }

  playPlayingRandomBGM() {
    const randomIndex = Math.floor(Math.random() * this.playingBGMList.length);
    const randomBGM = this.playingBGMList[randomIndex];

    if (this.currentBGM) {
      this.currentBGM.stop();
    }

    this.currentBGM = this.scene.sound.add(randomBGM);
    this.currentBGM.play({ loop: true, volume: 0.2 });
  }

  playMainBGM() {
    const mainBGM = this.mainBGMList[0];

    if (this.currentBGM) {
      this.currentBGM.stop();
    }

    this.currentBGM = this.scene.sound.add(mainBGM);
    this.currentBGM.play({ loop: true, volume: 0.2 });
  }

  stop() {
    if (this.currentBGM) {
      this.currentBGM.stop();
      this.currentBGM = null;
    }
  }
}

export default BGMManager;

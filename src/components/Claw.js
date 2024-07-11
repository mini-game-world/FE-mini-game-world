import Phaser from "phaser";
import SocketManager from "../utils/SocketManager";

export default class Claw extends Phaser.GameObjects.Sprite {
  constructor(scene, hitBox, player) {
    const offsetX = player.flipX ? 150 : -150; // 플레이어 방향에 따른 오프셋 설정
    const clawX = player.x + offsetX;
    const clawY = player.y;
    super(scene, clawX, clawY, "claw_white");

    this.scene = scene;
    this.player = player;
    this.isSelfInitiated = this.player.isSelfInitiated;

    this.scene.add.existing(this);

    const realX = hitBox.x + offsetX;
    const realY = hitBox.y;

    if (this.isSelfInitiated) {
      SocketManager.emitPlayerAttack({ x: realX, y: realY });
      this.scratch_sound = scene.sound.add("scratch_sound", { volume: 0.5 });
      this.scratch_sound.play();
    }

    // DURATION은 각 Claw 공격의 지속 시간(ms)입니다.
    this.DURATION = 500;

    this.scale = 3;
    this.setDepth(30);
    this.anims.play("claw_white", true);

    // 플레이어가 왼쪽을 보고 있을 경우 claw 이미지를 좌우 반전시킵니다.
    if (!player.flipX) {
      this.flipX = true;
    }

    // Claw는 DURATION만큼 지속됩니다.
    scene.time.addEvent({
      delay: this.DURATION,
      callback: () => {
        this.destroy();
      },
      loop: false,
    });
  }
}

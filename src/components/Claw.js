import Phaser from "phaser";

export default class Claw extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene,
    startingPosition,
    isHeadingRight,
    damage,
    scale,
    isSelfInitiated
  ) {
    super(scene, startingPosition[0], startingPosition[1], "claw_white");

    // 화면 및 물리엔진에 추가합니다.
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    // 공격 소리를 추가합니다.
    if (isSelfInitiated) {
      this.scratch_sound = scene.sound.add("scratch_sound", { volume: 0.5 });
      this.scratch_sound.play();
    }

    // Claw 공격은 앞 1회, 뒤 1회가 한 세트입니다.
    // DURATION은 각 Claw 공격의 지속 시간(ms)입니다.
    this.DURATION = 500;

    // 데미지를 설정합니다.
    this.m_damage = damage;
    // 크기, depth를 설정합니다.
    this.scale = scale;
    this.setDepth(30);
    // 애니메이션을 재생합니다.
    this.anims.play("claw_white", true);
    // 플레이어가 왼쪽을 보고 있을 경우 claw 이미지를 좌우 반전시킵니다.
    if (!isHeadingRight) {
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

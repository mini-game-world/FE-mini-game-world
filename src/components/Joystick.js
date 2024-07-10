import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js"; // phaser3-rex-plugins 플러그인 추가

class Joystick {
  constructor(scene, x, y) {
    this.scene = scene;
    this.joystick = new VirtualJoystick(this.scene, {
      x: this.scene.cameras.main.width / 2 - 800,
      y: this.scene.cameras.main.height / 2 + 300,
      radius: 150,
      base: this.scene.add.circle(0, 0, 150, 0x888888),
      thumb: this.scene.add.circle(0, 0, 100, 0xcccccc),
      dir: "8dir",
      forceMin: 16,
      enable: true,
    });
  }

  getForce() {
    return this.joystick.force;
  }

  getAngle() {
    return this.joystick.angle;
  }

  destroy() {
    if (this.joystick) {
      this.joystick.destroy();
      this.joystick = null;
    }
  }
}

export default Joystick;

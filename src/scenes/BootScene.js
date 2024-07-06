import { Scene } from "phaser";
import { EventBus } from "../EventBus";

class BootScene extends Scene {
    constructor() {
        super("BootScene");
    }

    preload() {
        this.load.image("background", "backgroundImg");
        // 나머지 에셋도 이곳에서 로드합니다.
    }

    create() {
        EventBus.emit("current-scene-ready", this);
        this.scene.start("GameScene");
    }
}

export default BootScene;


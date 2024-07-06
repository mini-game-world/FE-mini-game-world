import { Scene } from "phaser";

class GameScene extends Scene {
    constructor() {
        super("GameScene");
    }

    create() {
        this.add.image(400, 300, "background");
        // 나머지 게임 로직을 여기에 추가합니다.
    }

    update() {
        // 업데이트 로직을 여기에 추가합니다.
    }
}

export default GameScene;


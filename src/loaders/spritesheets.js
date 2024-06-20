import playerImgMove from "../assets/spritesheets/playerRun1.png";
import playerImgIdle from "../assets/spritesheets/playerIdle1.png";
import playerImgAttack from "../assets/spritesheets/playerAttack1.png";
import playerImgStun from "../assets/spritesheets/playerStun1.png";
import playerImgDead from "../assets/spritesheets/playerDead.png";
import explosionImg from "../assets/spritesheets/explosion.png";
import clawWhiteImg from "../assets/spritesheets/claw-white.png";
import bombImg from "../assets/spritesheets/bomb.png";

export function loadSpritesheets(scene) {
    scene.load.spritesheet("playerRun1", playerImgMove, {
        frameWidth: 200,
        frameHeight: 220,
    });
    scene.load.spritesheet("playerIdle1", playerImgIdle, {
        frameWidth: 200,
        frameHeight: 220,
    });
    scene.load.spritesheet("playerAttack1", playerImgAttack, {
        frameWidth: 200,
        frameHeight: 220,
    });
    scene.load.spritesheet("playerStun1", playerImgStun, {
        frameWidth: 200,
        frameHeight: 220,
    });
    scene.load.spritesheet("playerDead", playerImgDead, {
        frameWidth: 150,
        frameHeight: 150,
    });
    scene.load.spritesheet("explosion", explosionImg, {
        frameWidth: 32,
        frameHeight: 32,
    });
    scene.load.spritesheet("claw_white", clawWhiteImg, {
        frameWidth: 32,
        frameHeight: 32,
    });
    scene.load.spritesheet("bomb", bombImg, {
        frameWidth: 303,
        frameHeight: 142,
    });
}

import Phaser from "phaser";
import { EventBus } from "../EventBus";

class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    preload() {
        this.load.image("arrow", "assets/arrow.png");
        this.load.image("crown", "assets/crown.png");
        this.load.image("punching_bag", "assets/punching_bag.png");
        this.load.image("bomb_master", "assets/bomb_master.png");
        this.load.image("item", "assets/item.png");
        this.load.image("item0", "assets/item0.png");
        this.load.image("item1", "assets/item1.png");
        this.load.image("item2", "assets/item2.png");

        this.load.tilemapTiledJSON("map", "assets/maps/village3.tmj");
        this.load.image("first_tileset", "assets/tiles/first_tileset.png");
        this.load.image("chest_2", "assets/tiles/chest_2.png");
        this.load.image("house_1", "assets/tiles/house_1.png");
        this.load.image("logs", "assets/tiles/logs.png");
        this.load.image("stump_2", "assets/tiles/stump_2.png");
        this.load.image("Tileset_1", "assets/tiles/Tileset_1.png");
        this.load.image("tree_1", "assets/tiles/tree_1.png");
        this.load.image("tree_2", "assets/tiles/tree_2.png");
        this.load.image("stone_3", "assets/tiles/stone_3.png");
        this.load.image("stone_1", "assets/tiles/stone_1.png");

        // audio
        this.load.audio("scratch_sound", "assets/sounds/scratch.ogg");
        this.load.audio("timer_sound", "assets/sounds/timer.ogg");
        this.load.audio("explosion_sound", "assets/sounds/explosion.ogg");
        this.load.audio("winner_sound", "assets/sounds/winner.ogg");
        this.load.audio("playingBGM1", "assets/bgm/playingBGM1.ogg");
        this.load.audio("playingBGM2", "assets/bgm/playingBGM2.ogg");
        this.load.audio("waitingBGM1", "assets/bgm/waitingBGM1.ogg");
        this.load.audio("waitingBGM2", "assets/bgm/waitingBGM2.ogg");

        this.load.spritesheet("playerDead", "assets/playerDead.png", {
            frameWidth: 150,
            frameHeight: 150,
        });

        this.load.spritesheet("claw_white", "assets/claw_white.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        this.load.spritesheet("bomb", "assets/bomb.png", {
            frameWidth: 303,
            frameHeight: 142,
        });

        this.load.spritesheet("explosion", "assets/explosion.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        this.load.spritesheet("star", "assets/star.png", {
            frameWidth: 150,
            frameHeight: 150,
        });

        for (let i = 0; i <= 30; i++) {
            this.load.spritesheet(
                `player${i}`,
                `assets/players/player${i}.png`,
                {
                    frameWidth: 200,
                    frameHeight: 220,
                }
            );
            this.load.spritesheet(
                `player_move${i}`,
                `assets/players/player_move${i}.png`,
                {
                    frameWidth: 200,
                    frameHeight: 220,
                }
            );
            this.load.spritesheet(
                `player_attack${i}`,
                `assets/players/player_attack${i}.png`,
                {
                    frameWidth: 200,
                    frameHeight: 220,
                }
            );
            this.load.spritesheet(
                `player_stun${i}`,
                `assets/players/player_stun${i}.png`,
                {
                    frameWidth: 200,
                    frameHeight: 220,
                }
            );
        }
    }

    create() {
        for (let i = 0; i <= 30; i++) {
            this.anims.create({
                key: `idle${i}`,
                frames: this.anims.generateFrameNumbers(`player${i}`),
                frameRate: 5,
                repeat: -1,
            });

            this.anims.create({
                key: `move${i}`,
                frames: this.anims.generateFrameNumbers(`player_move${i}`),
                frameRate: 5,
                repeat: -1,
            });

            this.anims.create({
                key: `attack${i}`,
                frames: this.anims.generateFrameNumbers(`player_attack${i}`),
                frameRate: 12,
                repeat: 0,
            });

            this.anims.create({
                key: `stun${i}`,
                frames: this.anims.generateFrameNumbers(`player_stun${i}`),
                frameRate: 15,
                repeat: 0,
            });
        }

        this.anims.create({
            key: "dead",
            frames: this.anims.generateFrameNumbers("playerDead"),
            frameRate: 6,
            repeat: -1,
        });

        this.anims.create({
            key: "stun_star",
            frames: this.anims.generateFrameNumbers("star"),
            frameRate: 20,
            repeat: 2,
        });

        this.anims.create({
            key: "bomb",
            frames: this.anims.generateFrameNumbers("bomb"),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 15,
            repeat: 0,
        });

        this.anims.create({
            key: "claw_white",
            frames: this.anims.generateFrameNumbers("claw_white"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true,
        });

        EventBus.emit("current-scene-ready", this);
        this.scene.start("GameScene");
    }

    create() {
        for (let i = 0; i <= 30; i++) {
            this.anims.create({
                key: `idle${i}`,
                frames: this.anims.generateFrameNumbers(`player${i}`),
                frameRate: 5,
                repeat: -1,
            });

            this.anims.create({
                key: `move${i}`,
                frames: this.anims.generateFrameNumbers(`player_move${i}`),
                frameRate: 5,
                repeat: -1,
            });

            this.anims.create({
                key: `attack${i}`,
                frames: this.anims.generateFrameNumbers(`player_attack${i}`),
                frameRate: 12,
                repeat: 0,
            });

            this.anims.create({
                key: `stun${i}`,
                frames: this.anims.generateFrameNumbers(`player_stun${i}`),
                frameRate: 15,
                repeat: 0,
            });
        }

        this.anims.create({
            key: "dead",
            frames: this.anims.generateFrameNumbers("playerDead"),
            frameRate: 6,
            repeat: -1,
        });

        this.anims.create({
            key: "stun_star",
            frames: this.anims.generateFrameNumbers("star"),
            frameRate: 20,
            repeat: 2,
        });

        this.anims.create({
            key: "bomb",
            frames: this.anims.generateFrameNumbers("bomb"),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 15,
            repeat: 0,
        });

        this.anims.create({
            key: "claw_white",
            frames: this.anims.generateFrameNumbers("claw_white"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true,
        });

        this.scene.start("MainScene");
    }
}

export default BootScene;

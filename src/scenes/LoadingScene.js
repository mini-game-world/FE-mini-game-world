import Phaser from "phaser";
import { loadImages } from "../loaders/images";
import { loadSpritesheets } from "../loaders/spritesheets";
import { loadAudios } from "../loaders/audios";
import { loadFonts } from "../loaders/fonts";
import { createAnimations } from "../loaders/animations";

export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        loadImages(this);
        loadSpritesheets(this);
        loadAudios(this);
        loadFonts(this);
    }

    create() {
        createAnimations(this);
        this.scene.start("playGame");
    }
}

import Phaser from "phaser";
import Config from "./Config";

const StartGame = (parent) => {
    return new Phaser.Game({ ...Config, parent });
};

export default StartGame;


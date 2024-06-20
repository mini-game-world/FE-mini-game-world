import scratchOgg from "../assets/sounds/scratch.ogg";
import explosionOgg from "../assets/sounds/explosion.ogg";

export function loadAudios(scene) {
    scene.load.audio("audio_scratch", scratchOgg);
    scene.load.audio("audio_explosion", explosionOgg);
}

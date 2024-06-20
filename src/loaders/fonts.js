import fontPng from "../assets/font/font.png";
import fontXml from "../assets/font/font.xml";

export function loadFonts(scene) {
    scene.load.bitmapFont("pixelFont", fontPng, fontXml);
}

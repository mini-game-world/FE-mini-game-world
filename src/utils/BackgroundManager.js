import Phaser from "phaser";

class BackgroundManager {
    constructor(scene) {
        this.scene = scene;
        this.map = null;
        this.backGround = null;
        this.house = null;
        this.object = null;
        this.mapShrink = null;
        this.debugGraphics = null;
    }

    loadTilemaps() {
        this.map = this.scene.make.tilemap({ key: "map" });
    }

    addTilesets() {
        this.house_1 = this.map.addTilesetImage("house_1", "house_1");
        this.logs = this.map.addTilesetImage("logs", "logs");
        this.stump_2 = this.map.addTilesetImage("stump_2", "stump_2");
        this.Tileset_1 = this.map.addTilesetImage("Tileset_1", "Tileset_1");
        this.tree_1 = this.map.addTilesetImage("tree_1", "tree_1");
        this.tree_2 = this.map.addTilesetImage("tree_2", "tree_2");
        this.stone_1 = this.map.addTilesetImage("stone_1", "stone_1");
        this.stone_3 = this.map.addTilesetImage("stone_3", "stone_3");
    }

    createLayers() {
        this.backGround = this.map.createLayer(
            "BackGround",
            this.Tileset_1,
            0,
            0
        );
        this.house = this.map.createLayer("House", this.house_1, 0, 0);
        this.object = this.map.createLayer(
            "Object",
            [
                this.Tileset_1,
                this.logs,
                this.stump_2,
                this.tree_1,
                this.tree_2,
                this.stone_1,
                this.stone_3,
            ],
            0,
            0
        );
        this.mapShrink = this.map.createLayer(
            "MapShrink",
            this.Tileset_1,
            0,
            0
        );
    }

    setCollisions() {
        this.backGround.setCollisionByProperty({ collides: true });
        this.house.setCollisionByProperty({ collides: true });
        this.object.setCollisionByProperty({ collides: true });
        this.mapShrink.setCollisionByProperty({ collides: true });
    }

    renderDebugGraphics() {
        this.debugGraphics = this.scene.add.graphics();
        this.backGround.renderDebug(this.debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128),
            faceColor: new Phaser.Display.Color(0, 255, 0, 128),
        });
        this.house.renderDebug(this.debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128),
            faceColor: new Phaser.Display.Color(0, 255, 0, 128),
        });
        this.object.renderDebug(this.debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128),
            faceColor: new Phaser.Display.Color(0, 255, 0, 128),
        });
        this.mapShrink.renderDebug(this.debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128),
            faceColor: new Phaser.Display.Color(0, 255, 0, 128),
        });
    }

    initializeWorldBounds() {
        this.scene.physics.world.setBounds(0, 0, 3840, 2560);
    }

    setBackground() {
        this.loadTilemaps();
        this.addTilesets();
        this.createLayers();
        this.setCollisions();
        this.renderDebugGraphics();
        this.initializeWorldBounds();
    }
}

export default BackgroundManager;


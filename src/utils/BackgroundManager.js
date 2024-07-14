// BackgroundManager.js

class BackgroundManager {
  constructor(scene) {
    this.scene = scene;
    this.setBackground();
  }

  setBackground() {
    const map = this.createMap();
    this.createLayers(map);
    this.setCollisions();
    this.setWorldBounds();
    // this.addDebugging();
  }

  createMap() {
    return this.scene.make.tilemap({ key: "map" });
  }

  createLayers(map) {
    const house_1 = map.addTilesetImage("house_1", "house_1");
    const logs = map.addTilesetImage("logs", "logs");
    const stump_2 = map.addTilesetImage("stump_2", "stump_2");
    const Tileset_1 = map.addTilesetImage("Tileset_1", "Tileset_1");
    const tree_1 = map.addTilesetImage("tree_1", "tree_1");
    const tree_2 = map.addTilesetImage("tree_2", "tree_2");
    const stone_1 = map.addTilesetImage("stone_1", "stone_1");
    const stone_3 = map.addTilesetImage("stone_3", "stone_3");
    const fence_1 = map.addTilesetImage("fence_1", "fence_1");
    const fence_3 = map.addTilesetImage("fence_3", "fence_3");

    this.scene.backGround = map.createLayer("BackGround", Tileset_1, 0, 0);
    this.scene.fence = map.createLayer("Fence", [fence_1, fence_3], 0, 0);
    this.scene.house = map.createLayer("House", house_1, 0, 0);
    this.scene.object = map.createLayer(
      "Object",
      [Tileset_1, logs, stump_2, tree_1, tree_2, stone_1, stone_3, fence_1],
      0,
      0
    );
    this.scene.mapShrink = map.createLayer("MapShrink", Tileset_1, 0, 0);
  }

  setCollisions() {
    this.scene.backGround.setCollisionByProperty({ collides: true });
    this.scene.fence.setCollisionByProperty({ collides: true });
    this.scene.house.setCollisionByProperty({ collides: true });
    this.scene.object.setCollisionByProperty({ collides: true });
    this.scene.mapShrink.setCollisionByProperty({ collides: true });
  }

  setWorldBounds() {
    this.scene.physics.world.setBounds(0, 0, 3840, 3200);
  }

  addDebugging() {
    this.debugGraphics = this.scene.add.graphics();
    this.scene.backGround.renderDebug(this.debugGraphics, {
      tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
      collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
      faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    });
    this.scene.house.renderDebug(this.debugGraphics, {
      tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
      collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
      faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    });
    this.scene.object.renderDebug(this.debugGraphics, {
      tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
      collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
      faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    });
    this.scene.fence.renderDebug(this.debugGraphics, {
      tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
      collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
      faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    });
    this.scene.mapShrink.renderDebug(this.debugGraphics, {
      tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
      collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
      faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    });
  }
}

export default BackgroundManager;

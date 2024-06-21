export function createAnimations(scene) {
    // PLAYERS
    scene.anims.create({
        key: "player_anim",
        frames: scene.anims.generateFrameNumbers("playerRun1"),
        frameRate: 12,
        repeat: -1,
    });
    scene.anims.create({
        key: "player_idle",
        frames: scene.anims.generateFrameNumbers("playerIdle1"),
        frameRate: 12,
        repeat: -1,
    });
    scene.anims.create({
        key: 'player_attack',
        frames: scene.anims.generateFrameNumbers("playerAttack1"),
        frameRate: 12,
        repeat: 0
    });

    scene.anims.create({
        key: "player_stun",
        frames: scene.anims.generateFrameNumbers("playerStun1", { start: 0, end: 3 }),
        frameRate: 12,
        repeat: 0,
    });

    scene.anims.create({
        key: "player_dead",
        frames: scene.anims.generateFrameNumbers("playerDead"),
        frameRate: 12,
        repeat: -1,
    });

    // EFFECT
    scene.anims.create({
        key: "explode",
        frames: scene.anims.generateFrameNumbers("explosion"),
        frameRate: 20,
        repeat: 0,
        hideOnComplete: true,
    });

    // ATTACKS
    scene.anims.create({
      key: "scratch_white",
      frames: scene.anims.generateFrameNumbers("claw_white"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });
    scene.anims.create({
        key: "bomb_anim",
        frames: scene.anims.generateFrameNumbers("bomb"),
        frameRate: 5,
        repeat: -1,
    });
}

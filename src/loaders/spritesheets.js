// import playerImgMove from "../assets/spritesheets/playerRun1.png";
// import playerImgIdle from "../assets/spritesheets/playerIdle1.png";
// import playerImgAttack from "../assets/spritesheets/playerAttack1.png";
// import playerImgStun from "../assets/spritesheets/playerStun1.png";
import playerImgDead from "../assets/spritesheets/playerDead.png";
import explosionImg from "../assets/spritesheets/explosion.png";
import clawWhiteImg from "../assets/spritesheets/claw-white.png";
import bombImg from "../assets/spritesheets/bomb.png";

import playerRun1 from '../assets/spritesheets/players/playerRun1.png'
import playerIdle1 from '../assets/spritesheets/players/playerIdle1.png'
import playerStun1 from '../assets/spritesheets/players/playerStun1.png'
import playerAttack1 from '../assets/spritesheets/players/playerAttack1.png'
import playerRun2 from '../assets/spritesheets/players/playerRun2.png'
import playerIdle2 from '../assets/spritesheets/players/playerIdle2.png'
import playerStun2 from '../assets/spritesheets/players/playerStun2.png'
import playerAttack2 from '../assets/spritesheets/players/playerAttack2.png'
import playerRun3 from '../assets/spritesheets/players/playerRun3.png'
import playerIdle3 from '../assets/spritesheets/players/playerIdle3.png'
import playerStun3 from '../assets/spritesheets/players/playerStun3.png'
import playerAttack3 from '../assets/spritesheets/players/playerAttack3.png'
import playerRun4 from '../assets/spritesheets/players/playerRun4.png'
import playerIdle4 from '../assets/spritesheets/players/playerIdle4.png'
import playerStun4 from '../assets/spritesheets/players/playerStun4.png'
import playerAttack4 from '../assets/spritesheets/players/playerAttack4.png'
import playerRun5 from '../assets/spritesheets/players/playerRun5.png'
import playerIdle5 from '../assets/spritesheets/players/playerIdle5.png'
import playerStun5 from '../assets/spritesheets/players/playerStun5.png'
import playerAttack5 from '../assets/spritesheets/players/playerAttack5.png'

export function loadSpritesheets(scene) {
    // scene.load.spritesheet("playerRun1", playerImgMove, {
    //     frameWidth: 200,
    //     frameHeight: 220,
    // });
    // scene.load.spritesheet("playerIdle1", playerImgIdle, {
    //     frameWidth: 200,
    //     frameHeight: 220,
    // });
    // scene.load.spritesheet("playerAttack1", playerImgAttack, {
    //     frameWidth: 200,
    //     frameHeight: 220,
    // });
    // scene.load.spritesheet("playerStun1", playerImgStun, {
    //     frameWidth: 200,
    //     frameHeight: 220,
    // });

// for (let i = 1; i <= 5; i++) {
    //     scene.load.spritesheet(`playerRun${i}`, `playerRun${i}`, {
    //         frameWidth: 200,
    //         frameHeight: 220,
    //       });
    //     scene.load.spritesheet(`playerIdle1${i}`, `playerIdle1${i}`, {
    //           frameWidth: 200,
    //           frameHeight: 220,
    //         });
    //     scene.load.spritesheet(`playerStun1${i}`, `playerStun1${i}`, {
    //           frameWidth: 200,
    //           frameHeight: 220,
    //         });
    //     scene.load.spritesheet(`playerAttack1${i}`, `playerAttack1${i}`, {
    //           frameWidth: 200,
    //           frameHeight: 220,
    //         });
    // }

    scene.load.spritesheet("playerRun1", playerRun1, {
        frameWidth: 200,
        frameHeight: 220,
      });
      scene.load.spritesheet("playerIdle1", playerIdle1, {
          frameWidth: 200,
          frameHeight: 220,
        });
      scene.load.spritesheet("playerStun1", playerStun1, {
          frameWidth: 200,
          frameHeight: 220,
        });
      scene.load.spritesheet("playerAttack1", playerAttack1, {
          frameWidth: 200,
          frameHeight: 220,
        });
  
      scene.load.spritesheet("playerRun2", playerRun2, {
        frameWidth: 200,
        frameHeight: 220,
      });
      scene.load.spritesheet("playerIdle2", playerIdle2, {
          frameWidth: 200,
          frameHeight: 220,
        });
      scene.load.spritesheet("playerStun2", playerStun2, {
          frameWidth: 200,
          frameHeight: 220,
        });
      scene.load.spritesheet("playerAttack2", playerAttack2, {
          frameWidth: 200,
          frameHeight: 220,
        });
  
      scene.load.spritesheet("playerRun3", playerRun3, {
        frameWidth: 200,
        frameHeight: 220,
      });
      scene.load.spritesheet("playerIdle3", playerIdle3, {
          frameWidth: 200,
          frameHeight: 220,
        });
      scene.load.spritesheet("playerStun3", playerStun3, {
          frameWidth: 200,
          frameHeight: 220,
        });
      scene.load.spritesheet("playerAttack3", playerAttack3, {
          frameWidth: 200,
          frameHeight: 220,
        });
  
      scene.load.spritesheet("playerRun4", playerRun4, {
        frameWidth: 200,
        frameHeight: 220,
      });
      scene.load.spritesheet("playerIdle4", playerIdle4, {
          frameWidth: 200,
          frameHeight: 220,
        });
      scene.load.spritesheet("playerStun4", playerStun4, {
          frameWidth: 200,
          frameHeight: 220,
        });
      scene.load.spritesheet("playerAttack4", playerAttack4, {
          frameWidth: 200,
          frameHeight: 220,
        });
  
      scene.load.spritesheet("playerRun5", playerRun5, {
        frameWidth: 200,
        frameHeight: 220,
      });
      scene.load.spritesheet("playerIdle5", playerIdle5, {
          frameWidth: 200,
          frameHeight: 220,
        });
        scene.load.spritesheet("playerStun5", playerStun5, {
          frameWidth: 200,
          frameHeight: 220,
        });
        scene.load.spritesheet("playerAttack5", playerAttack5, {
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
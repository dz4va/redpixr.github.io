﻿/// <reference path="Phaser/phaser.d.ts"/>

module PlatformerGameStates {
    export class GameRunningState extends Phaser.State {

        // Game
        game: Phaser.Game;

        // Srpite[s]
        sky: Phaser.Sprite;
        ground: Phaser.Sprite;

        // SpriteSheet[s]
        player: Phaser.Sprite;

        // Platforms
        platforms: Phaser.Group;

        // Cursors
        cursors: Phaser.CursorKeys;

        // Stars
        crystals: Phaser.Group;

        // Score
        score: number;
        scoreText: Phaser.Text;
        seconds: Phaser.Text;

        // PickUpSound
        pickupsound: Phaser.Sound;
        bgmusic: Phaser.Sound;
        trapsound: Phaser.Sound;

        // Instructions text
        instr: Phaser.Text;

        // Traps
        traps: Phaser.Group;

        // Hearts
        hearts: number;
        heartsGroup: Phaser.Group;

        // Number of crystals
        numberOfCrystals: number;

        constructor() {
            super();
        }

        preload() {
            var AssetsFolder = "GameFiles/Assets/";
            this.game.load.image("sky", AssetsFolder + "sky.png");
            this.game.load.image("ground", AssetsFolder + "platform.png");
            this.game.load.image("crystal", AssetsFolder + "Crystal.png");
            this.game.load.image("ground", AssetsFolder + "Block_Ground.png");
            this.game.load.spritesheet("player", AssetsFolder + "dude.png", 32, 48);
            this.game.load.image("trap", AssetsFolder + "trap.png");
            this.game.load.image("heart", AssetsFolder + "heart.png");

            var MusicsFolder = "GameFiles/Music/";
            this.game.load.audio("crystalpickup", MusicsFolder + "crystal.ogg");
            this.game.load.audio("bgmusic", MusicsFolder + "bgmusic.ogg");
            this.game.load.audio("trap", MusicsFolder + "trap.ogg");
        }

        create() {
            // Create cursor keys
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.game.world.setBounds(0, 0, 4000, this.game.world.height);

            // Hearts
            this.hearts = 3;

            // Activate arcade physics engine :>
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 1000;

            // Sky
            this.game.stage.backgroundColor = "#eee";

            // Platforms Group that contains ground and 2 ledges
            this.platforms = this.game.add.group();

            // Enable Physics for all the platforms in this group
            this.platforms.enableBody = true;

            // Create ground
            this.addLedge(0, this.game.world.height - 64, "ground", 10, 4);


            // Create ledges
            this.addLedge(400, this.game.world.height - 64 - (this.game.world.height * 0.2), "ground", 1, 1);

            this.addLedge(-150, 300, "ground", 0.9, 1);

            this.addLedge(1000, 350, "ground", 1.1, 1);

            this.addLedge(1200, 250, "ground", 0.5, 1);

            this.addLedge(1600, this.game.world.height - 64 - (this.game.world.height * 0.18), "ground", 0.8, 1);

            this.addLedge(1800, this.game.world.height - 64 - (this.game.world.height * 0.5), "ground", 0.5, 1);

            this.addLedge(2200, this.game.world.height - 64 - (this.game.world.height * 0.4), "ground", 0.8, 1);

            this.addLedge(2600, this.game.world.height - 64 - (this.game.world.height * 0.25), "ground", 0.7, 1);

            this.addLedge(1950, this.game.world.height - 64 - (this.game.world.height * 0.6), "ground", 0.6, 1);

            this.addLedge(3000, this.game.world.height - 64 - (this.game.world.height * 0.25), "ground", 0.7, 1);

            this.addLedge(3200, this.game.world.height - 64 - (this.game.world.height * 0.38), "ground", 0.8, 1);

            this.addLedge(3600, this.game.world.height - 64 - (this.game.world.height * 0.5), "ground", 0.8, 1);

            this.addLedge(3900, this.game.world.height - 64 - (this.game.world.height * 0.6), "ground", 0.8, 1);

            var instr = this.game.add.text(window.innerWidth + 20, 40, "Collect all the Fallen Crystals...", { font: "Garamond", fontSize: "80px", fill: "#999999" });

            // Player
            this.player = this.game.add.sprite(32, this.game.world.height - 150, "player");

            // Enable physics for the player
            this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

            // Add some physics properties
            this.player.body.bounce.y = 0.2;
            this.player.body.gravity.y = 300;
            this.player.body.collideWorldBounds = true;

            // Add animations
            this.player.animations.add("left", [0, 1, 2, 3], 10, true);
            this.player.animations.add("right", [5, 6, 7, 8], 10, true);

            // Add Stars
            this.crystals = this.game.add.group();
            this.crystals.enableBody = true;

            this.traps = this.game.add.group();
            this.traps.enableBody = true;

            this.heartsGroup = this.game.add.group();
            this.heartsGroup.enableBody = true;

            for (var i = 0; i < this.hearts; i++) {
                var h: Phaser.Sprite = this.heartsGroup.create(window.innerWidth - 40 - (40 * i), 20, "heart");
                h.fixedToCamera = true;
                h.body.immovable = true;
                h.body.allowGravity = false;
            }

            this.numberOfCrystals = 0;

            for (var i = 0; i < 58; i++){

                var crystalOrTrap: number = Math.floor(Math.random() * 2);

                if (crystalOrTrap) {
                    var crystal = this.crystals.create(i * 70, 0, "crystal");

                    // Set some gravity
                    crystal.body.gravity.y = 6;
                    crystal.scale.set(1.1);

                    // Collide with world bounds
                    crystal.body.collideWorldBounds = true;

                    // Different bounce values
                    crystal.body.bounce.y = 0.7 * Math.random() * 0.2;

                    this.numberOfCrystals++;
                } else {
                    var trap = this.traps.create(i * 70, 0, "trap");

                    // Set gravity
                    trap.body.gravity.y = 100;
                    trap.scale.set(1);
                    trap.anchor.set(0.5);

                    trap.body.colliweWorldBounds = true;

                    trap.body.bounce.y = 0.6 * Math.random() * 0.2; 
                }
                
            }

            // Set score to zero
            this.score = 0;
            this.scoreText = this.game.add.text(20, 20, 'Star Score: 0',
                { font: "Garamond", fontSize: "32px", fill: "#333355" });
            this.scoreText.smoothed = false;
            this.scoreText.fixedToCamera = true;


            this.game.camera.follow(this.player);

            // Add Music
            this.pickupsound = this.game.add.audio("crystalpickup");
            this.trapsound = this.game.add.audio("trap");
            this.bgmusic = this.game.add.audio("bgmusic");

            this.bgmusic.onDecoded.add(this.startMusic, this);

        }

        addLedge(x, y, key, scaleX, scaleY) {
            var ledge: Phaser.Sprite = this.platforms.create(x, y, key);
            ledge.body.immovable = true;
            ledge.body.allowGravity = false;
            ledge.scale.setTo(scaleX, scaleY);
        }

        startMusic() {
            this.bgmusic.play(undefined, 0, 0.9, true);
        }



        update() {
            this.game.physics.arcade.collide(this.player, this.platforms);
            this.game.physics.arcade.collide(this.crystals, this.platforms);
            this.game.physics.arcade.collide(this.traps, this.platforms);
            this.game.physics.arcade.overlap(this.player, this.crystals, this.collectStar, null, this);
            this.game.physics.arcade.overlap(this.player, this.traps, this.trapped, null, this);

            // Reset Players velocity movement
            this.player.body.velocity.x = 0;

            // Left Right movement
            if (this.cursors.left.isDown) {
                // Move to the left
                this.player.body.velocity.x = -250;
                this.player.animations.play("left");
            } else if (this.cursors.right.isDown) {
                // Move right
                this.player.body.velocity.x = 250;
                this.player.animations.play("right");
            } else {
                this.player.animations.stop();
                this.player.frame = 4;
            }

            // Allow jump if touching ground
            if (this.cursors.up.isDown && this.player.body.touching.down){
                this.player.body.velocity.y = -700;
            }

            if (this.score >= this.numberOfCrystals * 10) {
                this.game.world.bounds.setTo(0, 0, window.innerWidth, window.innerHeight);
                this.game.state.start("GameWonState", true, true);
            }
        }

        trapped(player: Phaser.Sprite, trap: Phaser.Sprite) {
            trap.kill();
            this.trapsound.play(null, 0, 0.7); 
            if (this.hearts > 0){
                this.hearts--;
            }
            if (this.hearts <= 0){
                this.hearts = 0;
                this.game.state.start("GameLostState", true, true, this.score);
            }

            this.game.world.bounds.setTo(0, 0, window.innerWidth, window.innerHeight);
            this.heartsGroup.removeChildAt(this.hearts);
            
        }

        collectStar(player: Phaser.Sprite, star: Phaser.Sprite) {
            star.kill();
            this.score += 10;
            this.scoreText.text = 'Crystal Score: ' + this.score;
            this.pickupsound.play(undefined, 0, 0.7);
        }

    }

    export class GameWonState extends Phaser.State {
        wonText: Phaser.Text;
        restart: Phaser.Button;

        constructor() {
            super();
        }

        preload() {
            this.game.load.image("restartButton", "GameFiles/Assets/diamond.png");
        }

        create() {
            this.game.stage.backgroundColor = "#ffdddd";
            this.wonText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 80, "Click To Restart", {
                fontSize: "50px",
                fill: "#333355"
            });
            this.wonText.anchor.set(0.5);
            this.wonText.smoothed = false;
            this.restart = this.game.add.button(
                this.game.world.centerX,
                this.game.world.centerY,
                "restartButton",
                this.restartGame,
                this);
            this.restart.anchor.set(0.5);
            this.restart.scale.set(1.4);
        }

        restartGame() {
            this.game.time.events.events = [];
            this.game.state.start("GameRunningState", true, true);        
        }
    }

    export class GameStartState extends Phaser.State {
        startText: Phaser.Text;
        start: Phaser.Button;

        constructor() {
            super();
        }

        preload() {
            this.game.load.image("restartButton", "GameFiles/Assets/diamond.png");
        }

        create() {
            //this.game.world.bounds.setTo(0, 0, window.innerWidth, window.innerHeight);
            this.game.stage.backgroundColor = "#ffdddd";
            this.startText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 80, "Click To Start", {
                fontSize: "50px",
                fill: "#333355"
            });
            this.startText.anchor.set(0.5);
            this.startText.smoothed = false;
            this.start = this.game.add.button(
                this.game.world.centerX,
                this.game.world.centerY,
                "restartButton",
                this.startGame,
                this);
            this.start.anchor.set(0.5);
            this.start.scale.set(1.4);
        }

        startGame() {
            this.game.state.start("GameRunningState", true, true);
        }
    }

    export class GameLostState extends Phaser.State {
        endText: Phaser.Text;
        restart: Phaser.Button;
        score: number;

        constructor() {
            super();
        }

        init(score: number) {
            this.score = score;
        }

        preload() {
            this.game.load.image("restartButton", "GameFiles/Assets/diamond.png");
        }

        create() {
            this.game.stage.backgroundColor = "#ffdddd";
            this.endText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 80, "Score: " + this.score, {
                fontSize: "50px",
                fill: "#333355"
            });
            this.endText.anchor.set(0.5);
            //this.endText.smoothed = false;

            this.restart = this.game.add.button(
                this.game.world.centerX,
                this.game.world.centerY,
                "restartButton",
                this.startGame,
                this);
            this.restart.anchor.set(0.5);
            this.restart.scale.set(1.4);
        }

        startGame() {
            this.game.state.start("GameRunningState", true, true);
        }
    }

}
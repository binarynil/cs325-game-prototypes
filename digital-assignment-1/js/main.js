"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 1000, 300, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.audio('mbr', 'assets/VIRDEM.mp3');
        game.load.image('enemy', 'assets/enemy1.png');
        game.load.image('ninja', 'assets/ninja2.png');
        game.load.image('star', 'assets/star.png');
        game.load.image('forest-bg', 'assets/parallax-demon-woods-bg.png');
        game.load.image('forest-back', 'assets/parallax-demon-woods-far-trees.png');
        game.load.image('forest-mid', 'assets/parallax-demon-woods-mid-trees.png');
        game.load.image('forest-front', 'assets/parallax-demon-woods-close-trees.png');
        
    }
    
    var ninja;
    var music;
    var star;
    var starKey;
    var enemyGroup;
    var newEnemy;
    var score = 0;
    var scoreText;
    var forestFront;
    var forestBack;
    var forestMid;
    var forestLight;
    var jump = 0;
    var cursorKeys;
    var style = { font: "25px Verdana", fill: "#ffffff"};
    var canShoot = true;
    
    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        game.physics.startSystem(Phaser.Physics.ARCADE);
        forestBack = game.add.tileSprite(0, game.height - game.cache.getImage('forest-bg').height, game.width, game.cache.getImage('forest-bg').height,'forest-bg');
        forestLight = game.add.tileSprite(0, game.height - game.cache.getImage('forest-back').height, game.width, game.cache.getImage('forest-back').height,'forest-back');
        forestMid = game.add.tileSprite(0, game.height - game.cache.getImage('forest-mid').height, game.width, game.cache.getImage('forest-mid').height,'forest-mid');
        forestFront = game.add.tileSprite(0, game.height - game.cache.getImage('forest-front').height, game.width, game.cache.getImage('forest-front').height,'forest-front');

        ninja = game.add.sprite(10, 10, 'ninja');
        ninja.scale.setTo(0.15,0.15);
        enemyGroup = game.add.group();
        enemyGroup.enableBody = true;
        enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;

        game.physics.enable( ninja, Phaser.Physics.ARCADE );

        star = game.add.weapon(1000, 'star');
        star.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        star.bulletSpeed = 1000;
        star.fireRate = 100;
        
        ninja.scale.setTo(0.15,0.15);

        game.time.desiredFps = 30;
        game.physics.arcade.gravity.y = 250;
        
        ninja.body.bounce.y = 0.2;
        ninja.body.collideWorldBounds = true;
        star.trackSprite(ninja, 15,15, true);
        
        scoreText = game.add.text(0,0, "Score: " + score, style);

        cursorKeys = game.input.keyboard.createCursorKeys();
        starKey = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        music = game.add.audio('mbr');
        music.loop = true;
        music.volume = 0.08;
        music.play();
        
        spawnEnemy(100);
    }
    
    function update() {
        //
        var randomNumber = Math.floor(Math.random() * 280);
        
        if(randomNumber >= 90) {
            spawnEnemy(randomNumber);
        }
       
        forestBack.tilePosition.x -= 0.3;
        forestLight.tilePosition.x -= 0.42;
        forestMid.tilePosition.x -= 0.5;
        forestFront.tilePosition.x -= 0.8;
        ninja.body.velocity.x = 0;
        enemyGroup.forEachAlive(function(newEnemy) {
            newEnemy.body.velocity.x = -100;
        })
        //ninja.body.velocity.y = 0;
        if(cursorKeys.left.isDown) {
            ninja.body.velocity.x = -100;
        }
        if(cursorKeys.right.isDown) {
            ninja.body.velocity.x = 100;
        }
        if(cursorKeys.up.isDown) {
            ninja.body.velocity.y = -100;
            jump = game.time.now + 750;
        }
        if(starKey.isDown && canShoot) {
            star.fire();
        }
        if(newEnemy.x === 0) {
            this.newEnemy.kill();
        }
        scoreText.setText("Score: " + score);
    

        game.physics.arcade.overlap(ninja, enemyGroup, playerDead, null, this);
        game.physics.arcade.overlap(star.bullets, enemyGroup, enemyDead, null, this);
        
    }

    function spawnEnemy(randomNumber) {
        //console.log(randomNumber);
       
        newEnemy = enemyGroup.create(randomNumber*5, randomNumber, 'enemy');
        game.physics.enable(newEnemy,Phaser.Physics.ARCADE);
        newEnemy.body.collideWorldBounds = true;
    
    }

    function playerDead(ninja, newEnemy) {
        ninja.kill();
        canShoot = false;
        var diedText = game.add.text(game.world.centerX-100, game.world.centerY, "You died!", style);
    }

    function enemyDead(star, newEnemy) {
        newEnemy.kill();
        score += 1;
    }
};

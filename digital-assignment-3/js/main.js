"use strict";

function make_main_game_state( game )
{
    function preload() {
        // Load an image and call it 'logo'.
        game.load.audio('meow', 'assets/meowthejewels.mp3');
        game.load.image('lady', 'assets/old-lady.png');
        game.load.image('cat', 'assets/cat1.png');
        game.load.image('laser', 'assets/laser.png');
        game.load.image('portal', 'assets/portal.png');
        game.load.image('grass', 'assets/grass.png');
    }
    
    var lady;
    var music;
    var cat;
    var randX;
    var randY;
    var catGroup;
    var laser;
    var shoot;
    var portal;
    var cursorKeys;
    //var firingTimer;
    var canShoot = true;
    //var gameOver = false;
    var maxCats = 15;
    var laserNum = Math.floor(maxCats/2);
    var nextLaser = 0;
    var laserText;
    var catNumText;
    
    //var bullets = maxCats/2;
    var style = { font: "25px Verdana", fill: "#ffffff", align: "center" };
    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        game.add.tileSprite(0,0, 800,600,'grass');
        lady = game.add.sprite( 10, 30, 'lady' );
        game.physics.enable( lady, Phaser.Physics.ARCADE );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        //bouncy.anchor.setTo( 0.5, 0.5 );
        lady.scale.setTo(0.05, 0.05);
        // Turn on the arcade physics engine for this sprite.
        //game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        lady.body.collideWorldBounds = true;
        lady.body.bounce.set(1);
        catGroup = game.add.group();
        catGroup.enableBody = true;
        catGroup.physicsBodyType = Phaser.Physics.ARCADE;

        laser = game.add.weapon(laserNum, 'laser');
        laser.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        laser.bulletSpeed = 400;
        laser.fireRate = 600;
        laser.trackSprite(lady, 15,8, true);

        //randX = Math.floor(Math.random() * 700);
        //randY = Math.floor(Math.random() * 300);
        portal = game.add.sprite(700, 300, 'portal');
        portal.scale.setTo(0.15,0.15);
        //portal.enableBody = true;
        game.physics.enable( portal, Phaser.Physics.ARCADE );
        
        laserText = game.add.text(0,0, "Laser Beams: " + laserNum, style);

        /*catLaser = game.add.group();
        catLaser.enableBody = true;
        catLaser.physicsBodyType = Phaser.Physics.ARCADE;
        catLaser.createMultiple(1000, 'cat-laser');
        catLaser.setAll('anchor.x', 0.5);
        catLaser.setAll('anchor.y', 1);
        catLaser.setAll('outOfBoundsKill', true);
        catLaser.setAll('checkWorldBounds', true);*/
        shoot = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        cursorKeys = game.input.keyboard.createCursorKeys();
        music = game.add.audio('meow');
        music.loop = true;
        music.volume = 0.08;
        music.play();

        for(var i = 0; i < maxCats; i++) {
            do {
                randX = Math.floor(Math.random() * 700);
            } while(randX <= 50);
            randY = Math.floor(Math.random() * 500);
            
            console.log(randX + " " + randY);
            spawnCats(randX, randY);
        }
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        
    }
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
        lady.body.velocity.x = 0;
        lady.body.velocity.y = 0;
        cat.body.velocity.x = 0;
        cat.body.velocity.y = 0;

        if(laserNum === 0) {
            canShoot = false;
        }

        for(var i = 0; i < maxCats; i++) {
            var currentCat = catGroup.getChildAt(i);
            var randMove = Math.floor(Math.random() * 50);
            if(randMove === 0) {
                currentCat.body.velocity.y = -125; 
                //up
            }
            if(randMove === 1) {
                currentCat.body.velocity.y = 125; 
                //catLaser.fire();
                //down
            }
            if(randMove === 2) {
                currentCat.body.velocity.x = 125;
                //right 
            }
            if(randMove === 3) {
                currentCat.body.velocity.x = -125; 
                //left
            }
        }
        
        if(cursorKeys.left.isDown) {
            lady.body.velocity.x = -100;
        }
        if(cursorKeys.right.isDown) {
            lady.body.velocity.x = 100;
        }
        if(cursorKeys.up.isDown) {
            lady.body.velocity.y = -100;
            //jump = game.time.now + 750;
        }
        if(cursorKeys.down.isDown) {
            lady.body.velocity.y = 100;
        }

        if(shoot.isDown && canShoot === true) {
            laserShoot();
        }
        laserText.setText("Laser Beams: " + laserNum);

        game.physics.arcade.overlap(lady, portal, escape, null, this);
        game.physics.arcade.overlap(lady, catGroup, ladyKill, null, this);
        game.physics.arcade.overlap(laser.bullets, catGroup, catKill, null, this);
    }

    function spawnCats(x, y) {
        cat = catGroup.create(y, x, 'cat');
        game.physics.enable(cat,Phaser.Physics.ARCADE);
        cat.body.collideWorldBounds = true;
        cat.body.bounce.set(1);
    }

    function escape(lady, portal) {
        lady.kill();
        var text = game.add.text( game.world.centerX-300, 50, "You escaped through another dimension!", style );
        //gameOver = true;
        canShoot = false;
    }

    function ladyKill(lady, cat) {
        lady.kill();
        var text = game.add.text( game.world.centerX-100, 30, "Oh no! The Crazy Cat Lady died.", style );
        canShoot = false;
    }

    function catKill(laser, cat) {
        cat.kill();
    }

    function laserShoot() {
        if(game.time.now > nextLaser) {
            nextLaser = game.time.now + laser.fireRate;
            //laser.reset(sprite.x - 8, sprite.y - 8);
            laser.fire();
            laserNum--;
        }
    }
    
    return { "preload": preload, "create": create, "update": update };
}


window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/v2.6.2/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game' );
    
    game.state.add( "main", make_main_game_state( game ) );
    
    game.state.start( "main" );
};

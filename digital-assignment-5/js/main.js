"use strict";

function make_main_game_state(game) {
    function preload() {

        game.load.tilemap('map', 'assets/map.csv', null, Phaser.Tilemap.CSV);
        game.load.image('tiles', 'assets/Pico_RPG_Forest_Tileset.png');
        game.load.image('dude', 'assets/knight iso char_idle_0.png');
        game.load.image('battlebg', 'assets/wut.png');
        game.load.image('battleplayer', 'assets/knight iso char_run left_4.png');
        game.load.image('battleplayerboss', 'assets/knight iso char_run right_4.png');
        game.load.image('enemy', 'assets/enemy1.png');
        game.load.image('boss', 'assets/FlameDemon Evolved.png');
        game.load.image('boss1', 'assets/boss.png');
    }

    var map;
    var layer;
    var cursors;
    var player;
    var playerhp = 100;
    var playercurrenthp;
    var enemyhp = 100;
    var enemycurrenthp;
    var playerLevel = 1;
    var maxXP;
    var xp;
    var boss;
    var bossFight;
    var battle;
    var style = { font: "11px Verdana", fill: "#ffffff" };
    var statusTxt;
    //var testTxt;
    //var input;
    var battlebg;
    var playerTxt;
    var enemyTxt;
    var enemy;
    var playerbattle;
    var input1;
    var input2;
    var input3;
    var input4;
    var battlemenu;
    var playerTurn;
    var playerBaseDMG;
    var enemyBaseDMG;
    var next;
    var bossSprite;
    var bosshp;
    var bossMaxhp = 250;
    //var playerboss;
    var retry;
    var gameOverBool;
    var overTxt;



    function create() {
        xp = 0;
        next = 0;
        playerLevel = 1;
        maxXP = 250 * playerLevel;
        playerBaseDMG = playerLevel + 10;
        enemyBaseDMG = playerLevel + 8;
        playercurrenthp = 100; 
        bosshp = 250;
        enemycurrenthp = 100;
        battle = false;
        playerTurn = true;
        gameOverBool = false;
        bossFight = false;

        map = game.add.tilemap('map', 8, 8);
        map.addTilesetImage('tiles');
        layer = map.createLayer(0);
        layer.setScale(2);
        layer.resizeWorld();
        //game.world.resize(6000,600);
        //layer.debug = true;
        map.setCollisionBetween(0, 6);
        map.setCollisionBetween(11, 14);
        map.setCollisionBetween(16, 21);
        map.setCollisionBetween(27, 30);
        map.setCollisionBetween(32, 37);
        map.setCollisionBetween(43, 46);
        map.setCollisionBetween(48, 52);
        map.setCollisionBetween(58, 62);
        
        player = game.add.sprite(51, 51, 'dude');
        

        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.scale.setTo(0.36, 0.36);
        player.body.collideWorldBounds = true;
        game.camera.follow(player);
        
        cursors = game.input.keyboard.createCursorKeys();
        
        //game.physics.enable(boss, Phaser.Phaser.ARCADE);
        statusTxt = game.add.text(15, 500, "player lvl: " + playerLevel+ "\nxp: " +xp + " / " + maxXP, style);
        statusTxt.fixedToCamera = true;
        statusTxt.cameraOffset.setTo(15,500);
        
        input1 = game.input.keyboard.addKey(Phaser.KeyCode.ONE);
        input2 = game.input.keyboard.addKey(Phaser.KeyCode.TWO);
        input3 = game.input.keyboard.addKey(Phaser.KeyCode.THREE);
        input4 = game.input.keyboard.addKey(Phaser.KeyCode.FOUR);
        retry = game.input.keyboard.addKey(Phaser.KeyCode.R);
        boss = game.add.sprite(1500,750,'boss');
        game.physics.enable(boss, Phaser.Phaser.ARCADE);
        //boss.body.collideWorldBounds = true;
        
    }

    function update() {
        game.physics.arcade.collide(player, layer);
        //game.physics.arcade.collide(player,boss, checkBoss, null,this);
        player.body.velocity.set(0);
        var randBattle;
        var randFlee;
        checkBoss();
       


        if (cursors.left.isDown && !battle) {
            player.body.velocity.x = -100;
            randBattle = Math.floor(Math.random() * 100);
        }
        if (cursors.right.isDown && !battle) {
            player.body.velocity.x = 100;
            randBattle = Math.floor(Math.random() * 100);
        }

        if (cursors.up.isDown && !battle) {
            player.body.velocity.y = -100;
            randBattle = Math.floor(Math.random() * 100);
        }
        if (cursors.down.isDown && !battle) {
            player.body.velocity.y = 100;
            randBattle = Math.floor(Math.random() * 100);
        }
        
        if (randBattle === 99) {
            battle = true;
            //battlebg.visible = true;
            updateDMG();

            //playerbattle = game.add.sprite(player.world.x,player.world.y, 'battleplayer');
            battlebg = game.add.sprite(player.world.x, player.world.y, 'battlebg');
            playerTxt = game.add.text(player.world.x + 20, player.world.y + 135, "player hp \n" + playercurrenthp + " / " + playerhp, style);
            enemyTxt = game.add.text(player.world.x + 20, player.world.y + 175, "enemy hp\n" + enemycurrenthp + " / " + enemyhp, style);
            battlemenu = game.add.text(player.world.x + 230, player.world.y + 135, "1. attack   2. heal\n3. flee", style);
            playerbattle = game.add.sprite(player.world.x + 250, player.world.y + 15, 'battleplayer');
            enemy = game.add.sprite(player.world.x + 20, player.world.y + 15, 'enemy');
            //battlebg.visible = false;
            //playerTxt.visible = true;
        }

        if(bossFight) {
            battle = true;
            updateDMG();
            battlebg = game.add.sprite(player.world.x, player.world.y, 'battlebg');
            playerTxt = game.add.text(player.world.x + 20, player.world.y + 135, "player hp \n" + playercurrenthp + " / " + playerhp, style);
            enemyTxt = game.add.text(player.world.x + 20, player.world.y + 175, "boss hp\n" + bosshp + " / " + bossMaxhp, style);
            battlemenu = game.add.text(player.world.x + 230, player.world.y + 135, "1. attack   2. heal\n3. flee", style);
            playerbattle = game.add.sprite(player.world.x + 20, player.world.y + 15, 'battleplayerboss');
            bossSprite = game.add.sprite(player.world.x + 250, player.world.y + 15, 'boss');
        }
       

        if (input1.isDown && battle && playerTurn) {
            var hitOrMiss = Math.floor(Math.random() * 3);
            var attackDMG;
            if (hitOrMiss > 0 && game.time.now > next) {
                do {
                    attackDMG = Math.floor(Math.random() * playerBaseDMG);
                } while (attackDMG < 7);

                var crit = Math.floor(Math.random() * 2);
                var critDMG = crit * attackDMG;
                var totalDMG = attackDMG + critDMG;
                //if(game.time.now > next) {
                    next = game.time.now + 200;
                    //bosshp = bosshp - totalDMG;
                    if(bossFight) {
                        bosshp = bosshp - totalDMG;
                        enemyTxt.setText("boss hp\n" + bosshp + " / " + bossMaxhp);
                    }
                    else {
                        enemycurrenthp = enemycurrenthp - totalDMG;
                        enemyTxt.setText("enemy hp\n" + enemycurrenthp + " / " + enemyhp);
                    }
                //}
                playerTurn = false;
            }

            if (enemycurrenthp <= 0) {
                levelUp();
                battleExit();
            }
            else if(bosshp <= 0) {
                gameOverBool = true;
                gameOver();
            }

        }

        if(retry.isDown && gameOverBool) {
            game.state.start("main");
        }

        if (input2.isDown && battle && playerTurn) {
            playerTurn = false;
            heal();
        }

        if (input3.isDown && battle && playerTurn) {
            playerTurn = false;
            randFlee = Math.floor(Math.random() * 2);
            if (randFlee === 1) {
                battleExit();
            }
        }

        if (!playerTurn && battle) {
            enemyAttack();
        }
    }

    function checkBoss() {
        if(playerLevel === 5) {
            bossFight = true;
        }
    }

    function gameOver() {
        var overTxt = game.add.text(layer.world.x + 20, player.world.y + 250, "Game Over\n Try again? Press R to start again", style);
    }


    function heal() {
        var healingRange = Math.floor(playerhp / 3);
        var healingHP;

        do {
            healingHP = Math.floor(Math.random() * healingRange) + 1;
            if(healingHP > Math.floor(healingRange / 3)) {
                playercurrenthp = playercurrenthp + healingHP;
                if(playercurrenthp > 100) {
                    playercurrenthp = 100;
                }
            }

        } while(healingHP < Math.floor(healingRange / 3));

        playerTxt.setText("player hp\n" + playercurrenthp + " / " + playerhp);

    }

    function levelUp() {
        var randXP;
        do {
            randXP = Math.floor(Math.random() * maxXP);
        } while(randXP >= Math.floor(maxXP/5));

        xp = xp + randXP;
        if(xp >= 250) {
            playerLevel = 2;
            xp = xp - 250;
        }
        else if(xp >= 500) {
            playerLevel = 3;
            xp = xp - 500;
        }
        else if(xp >= 750) {
            playerLevel = 4;
            xp = xp - 750;
        }
        else if(xp >= 1000) {
            playerLevel = 5;
            xp = xp - 1000;
        }
        maxXP = 250 * playerLevel;
        statusTxt.setText("player lvl: " + playerLevel+"\nxp: " + xp + " / " + maxXP);
    }

    function updateDMG() {
        playerBaseDMG = playerLevel + 10;
        enemyBaseDMG = playerLevel + 8;
    }

    function enemyAttack() {
        var hitOrMiss = Math.floor(Math.random() * 3);
        var attackDMG;
        if (hitOrMiss > 0 && game.time.now > next) {
            do {
                attackDMG = Math.floor(Math.random() * playerBaseDMG);
            } while (attackDMG < 7);

            var crit = Math.floor(Math.random() * 2);
            var critDMG = crit * attackDMG;
            var totalDMG = attackDMG + critDMG;
            //if(game.time.now > next) {
                next = game.time.now + 200;
                playercurrenthp = playercurrenthp - totalDMG;
                playerTxt.setText("player hp\n" + playercurrenthp + " / " + playerhp);
            //}
            playerTurn = true;
        }

        if(playercurrenthp <= 0) {
            gameOverBool = true;
            gameOver();
        }
    }

    function battleExit() {
        battle = false;
        battlebg.visible = false;
        playerTxt.visible = false;
        playerbattle.visible = false;
        enemy.visible = false;
        enemyTxt.visible = false;
        battlemenu.visible = false;
        enemycurrenthp = 100;
        playercurrenthp = 100;
    }
    return { "preload": preload, "create": create, "update": update };
}

window.onload = function () {
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

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');


    game.state.add("main", make_main_game_state(game));
    game.state.start("main");
};

"use strict";

function make_main_game_state(game) {
    function preload() {

        game.load.tilemap('map', 'assets/map.csv', null, Phaser.Tilemap.CSV);
        game.load.image('tiles', 'assets/Pico_RPG_Forest_Tileset.png');
        game.load.spritesheet('dude', 'assets/knight iso char.png', 84,84,26);
        game.load.image('battlebg', 'assets/wut.png');
        game.load.image('battleplayer', 'assets/knight iso char_run left_4.png');
        game.load.image('battleplayerboss', 'assets/knight iso char_run right_4.png');
        game.load.image('enemy', 'assets/enemy1.png');
        game.load.image('enemy2', 'assets/enemy2.png');
        game.load.image('enemy3', 'assets/enemy3.png');
        game.load.image('boss', 'assets/FlameDemon Evolved.png');
        game.load.image('boss1', 'assets/boss.png');
        game.load.image('boss2', 'assets/boss2.png');
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
    var boss2;
    var bossFight;
    var bossFight2;
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
    var bosshp2;
    var bossMaxhp = 1500;
    var bossMaxhp2 = 2000;
    //var playerboss;
    var retry;
    var gameOverBool;
    var overTxt;
    var enemytype = 0;
    var ultracharge;
    var maxUltra = 10;
    var down;
    var idle;
    var up;
    var right;
    var left;



    function create() {
        xp = 0;
        next = 0;
        playerLevel = 15;
        maxXP = 250 * playerLevel;
        playerBaseDMG = playerLevel + 10;
        enemyBaseDMG = playerLevel + 8;
        playerhp = playerLevel * 100;
        playercurrenthp = playerhp;
        bosshp = 1500;
        bosshp2 = 2000;

        enemycurrenthp = 100;
        battle = false;
        playerTurn = true;
        gameOverBool = false;
        bossFight = false;
        bossFight2 = false;
        ultracharge = 0;

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
        
        player = game.add.sprite(40, 100, 'dude');
        

        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.scale.setTo(0.36, 0.36);
        player.body.collideWorldBounds = true;
        game.camera.follow(player);
        down = player.animations.add('down', [4,5,6,7,8], 5, true);
        up = player.animations.add('up', [9,10,11,12,13], 5, true);
        right = player.animations.add('right', [14,15,16,17,18,19], 5,true);
        left = player.animations.add('left',[20,21,22,23,24,25],5,true);
        idle = player.animations.add('idle',[0,1,2,3], 2, false);
        
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
        boss2 = game.add.sprite(1260, 125, 'boss2');
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
            player.play('left');
            randBattle = Math.floor(Math.random() * 100);
        }
        else if (cursors.right.isDown && !battle) {
            player.body.velocity.x = 100;
            player.play('right');
            randBattle = Math.floor(Math.random() * 100);
        }
        else if (cursors.up.isDown && !battle) {
            player.body.velocity.y = -100;
            player.play('up');
            randBattle = Math.floor(Math.random() * 100);
        }
        else if (cursors.down.isDown && !battle) {
            player.body.velocity.y = 100;
            player.play('down');
            randBattle = Math.floor(Math.random() * 100);
        }
        else {
            player.play('idle');
        }
        
        if (randBattle === 99) {
            battle = true;
            //battlebg.visible = true;
            
            enemytype = Math.floor(Math.random() * 3);
            updateDMG();

            //playerbattle = game.add.sprite(player.world.x,player.world.y, 'battleplayer');
            battlebg = game.add.sprite(player.world.x, player.world.y, 'battlebg');
            playerTxt = game.add.text(player.world.x + 20, player.world.y + 135, "player hp        ultra\n" + playercurrenthp + " / " + playerhp + "       " + ultracharge + " / " + maxUltra, style);
            enemyTxt = game.add.text(player.world.x + 20, player.world.y + 175, "enemy hp\n" + enemycurrenthp + " / " + enemyhp, style);
            battlemenu = game.add.text(player.world.x + 230, player.world.y + 135, "1. attack   2. heal\n3. ultra     4. flee", style);
            playerbattle = game.add.sprite(player.world.x + 250, player.world.y + 15, 'battleplayer');
            if(enemytype === 0) {
                enemy = game.add.sprite(player.world.x + 20, player.world.y + 15, 'enemy');
            }
            else if(enemytype === 1) {
                enemy = game.add.sprite(player.world.x + 20, player.world.y + 15, 'enemy2');
            }
            else {
                enemy = game.add.sprite(player.world.x + 20, player.world.y + 15, 'enemy3');
            }
            //enemy = game.add.sprite(player.world.x + 20, player.world.y + 15, 'enemy');
            //battlebg.visible = false;
            //playerTxt.visible = true;
        }

        if(bossFight) {
            battle = true;
            updateDMG();
            
            battlebg = game.add.sprite(player.world.x, player.world.y, 'battlebg');
            playerTxt = game.add.text(player.world.x + 20, player.world.y + 135, "player hp        ultra\n" + playercurrenthp + " / " + playerhp + "       " + ultracharge + " / " + maxUltra, style);
            enemyTxt = game.add.text(player.world.x + 20, player.world.y + 175, "boss hp\n" + bosshp + " / " + bossMaxhp, style);
            battlemenu = game.add.text(player.world.x + 230, player.world.y + 135, "1. attack   2. heal\n3. ultra     4. flee", style);
            playerbattle = game.add.sprite(player.world.x + 20, player.world.y + 15, 'battleplayerboss');
            bossSprite = game.add.sprite(player.world.x + 250, player.world.y + 15, 'boss');
        }
        else if(bossFight2) {
            battle = true;
            updateDMG();
            
            battlebg = game.add.sprite(player.world.x, player.world.y, 'battlebg');
            playerTxt = game.add.text(player.world.x + 20, player.world.y + 135, "player hp        ultra\n" + playercurrenthp + " / " + playerhp + "       " + ultracharge + " / " + maxUltra, style);
            enemyTxt = game.add.text(player.world.x + 20, player.world.y + 175, "boss hp\n" + bosshp2 + " / " + bossMaxhp2, style);
            battlemenu = game.add.text(player.world.x + 230, player.world.y + 135, "1. attack   2. heal\n3. ultra     4. flee", style);
            playerbattle = game.add.sprite(player.world.x + 20, player.world.y + 15, 'battleplayerboss');
            bossSprite = game.add.sprite(player.world.x + 250, player.world.y + 15, 'boss2');
        }
       

        if (input1.isDown && battle && playerTurn) {
            playerAttack();
        }

        if(retry.isDown && gameOverBool) {
            game.state.start("main");
        }

        if (input2.isDown && battle && playerTurn) {
            playerTurn = false;
            heal();
        }

        if(input3.isDown && battle && playerTurn && ultracharge === maxUltra) {
            ultra();
        }

        if (input4.isDown && battle && playerTurn) {
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

    function playerAttack() {
        var hitOrMiss = Math.floor(Math.random() * 3);
        var attackDMG;
        if (hitOrMiss > 0 && game.time.now > next) {
            do {
                attackDMG = Math.floor(Math.random() * playerBaseDMG);
            } while (attackDMG < (4*playerLevel));
            ultracharge++;
            if(ultracharge > maxUltra) {
                ultracharge = 10;
            }

            var crit = Math.floor(Math.random() * 2);
            var critDMG = crit * attackDMG;
            var totalDMG = attackDMG + critDMG;
                //if(game.time.now > next) {
                next = game.time.now + 200;
                    //bosshp = bosshp - totalDMG;
                if(bossFight) {
                    bosshp = bosshp - totalDMG;
                    updateHP();
                    enemyTxt.setText("boss hp\n" + bosshp + " / " + bossMaxhp);
                }
                else if(bossFight2) {
                    bosshp2 = bosshp2 - totalDMG;
                    updateHP();
                    enemyTxt.setText("boss hp\n" + bosshp2 + " / " + bossMaxhp2);

                }
                else {
                    enemycurrenthp = enemycurrenthp - totalDMG;
                    updateHP();
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
            bossFight = false;
        }
        else if(bosshp2 <= 0) {
            gameOverBool = true;
            gameWon();
        }
    }

    function ultra() {
        var attackDMG;
        if (game.time.now > next) {
            do {
                attackDMG = Math.floor(Math.random() * playerBaseDMG);
            } while (attackDMG < 4*playerLevel);

            var crit = Math.floor(Math.random() * 2);
            var critDMG = crit * attackDMG;
            var totalDMG = (attackDMG + critDMG) * 2;
                //if(game.time.now > next) {
                next = game.time.now + 200;
                    //bosshp = bosshp - totalDMG;
                if(bossFight) {
                    bosshp = bosshp - totalDMG;
                    updateHP();
                    enemyTxt.setText("boss hp\n" + bosshp + " / " + bossMaxhp);
                }
                else if(bossFight2) {
                    bosshp2 = bosshp2 - totalDMG;
                    updateHP();
                    enemyTxt.setText("boss hp\n" + bosshp2 + " / " + bossMaxhp2);
                }
                else {
                    enemycurrenthp = enemycurrenthp - totalDMG;
                    updateHP();
                    enemyTxt.setText("enemy hp\n" + enemycurrenthp + " / " + enemyhp);
                }
                //}
            playerTurn = false;
            ultracharge = 0;
        }

        if (enemycurrenthp <= 0) {
            levelUp();
            battleExit();
        }
        else if(bosshp <= 0) {
            bossFight = false;
        }
        else if(bosshp2 <= 0) {
            gameOverBool = true;
            gameWon();
        }

    }

    function checkBoss() {
        /*if(playerLevel === 5) {
            bossFight = true;
        }
        else */
        if(playerLevel === 15) {
            bossFight2 = true;
        }
    }

    function gameOver() {
        var overTxt = game.add.text(layer.world.x + 20, player.world.y + 250, "Game Over\n Try again? Press R to start again", style);
    }
    function gameWon() {
        var winTxt = game.add.text(layer.world.x + 20, player.world.y + 250, "You rid the world of evil!\n Play again? Press R to start again", style);
    }


    function heal() {
        var healingRange = Math.floor(playerhp / 3);
        var healingHP;

        do {
            healingHP = Math.floor(Math.random() * healingRange) + 1;
            if(healingHP > Math.floor(healingRange / 3)) {
                playercurrenthp = playercurrenthp + (healingHP);
                if(playercurrenthp > playerhp) {
                    playercurrenthp = playerhp;
                }
            }

        } while(healingHP < Math.floor(healingRange / 3));

        playerTxt.setText("player hp        ultra\n" + playercurrenthp + " / " + playerhp + "         " + ultracharge + " / " + maxUltra);

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
        else if(xp >= 1250) {
            playerLevel = 6;
            xp = xp - 1250;
        }
        else if(xp >= 1500) {
            playerLevel = 7;
            xp = xp - 1500;
        }
        else if(xp >= 1750) {
            playerLevel = 8;
            xp = xp - 1750;
        }
        else if(xp >= 2000) {
            playerLevel = 9;
            xp = xp - 2000;
        }
        else if(xp >= 2250) {
            playerLevel = 10;
            xp = xp - 2250;
        }
        else if(xp >= 2500) {
            playerLevel = 11;
            xp = xp - 2500;
        }
        else if(xp >= 2750) {
            playerLevel = 12;
            xp = xp - 2750;
        }
        else if(xp >= 3000) {
            playerLevel = 13;
            xp = xp - 2250;
        }
        else if(xp >= 3250) {
            playerLevel = 14;
            xp = xp - 3250;
        }
        else if(xp >= 3500) {
            playerLevel = 15;
            xp = xp - 3500;
        }
        maxXP = 250 * playerLevel;
        playerhp = playerLevel * 100;
        statusTxt.setText("player lvl: " + playerLevel+"\nxp: " + xp + " / " + maxXP);
    }

    function updateDMG() {
        playerBaseDMG = playerLevel * 10;
        if(enemytype === 0) {
            enemyBaseDMG = playerLevel * 8;
            enemyhp = playerhp;
            enemycurrenthp = enemyhp;
        }
        else if(enemytype === 1){
            enemyBaseDMG = playerLevel * 5;
            enemyhp = playerhp/2;
            enemycurrenthp = enemyhp;
        }
        else {
            enemyBaseDMG = playerLevel * 11;
            enemyhp = playerhp;
            enemycurrenthp = enemyhp;
        }
        if(bossFight) {
            enemyBaseDMG = playerLevel * 15;
        }
        if(bossFight2) {
            enemyBaseDMG = playerLevel * 20;
        }
        //enemyBaseDMG = playerLevel + 8;
    }

    function enemyAttack() {
        var hitOrMiss = Math.floor(Math.random() * 3);
        var attackDMG;
        if (hitOrMiss > 0 && game.time.now > next) {
            do {
                attackDMG = Math.floor(Math.random() * playerBaseDMG);
            } while (attackDMG < 5*playerLevel);

            var crit = Math.floor(Math.random() * 2);
            var critDMG = crit * attackDMG;
            var totalDMG = attackDMG + critDMG;
            //if(game.time.now > next) {
                next = game.time.now + 200;
                playercurrenthp = playercurrenthp - totalDMG;
                updateHP();
                playerTxt.setText("player hp        ultra\n" + playercurrenthp + " / " + playerhp + "         " + ultracharge + " / " + maxUltra);
            //}
            playerTurn = true;
        }

        if(playercurrenthp <= 0) {
            gameOverBool = true;
            gameOver();
        }
    }
    function updateHP() {
        if(bosshp < 0) {
            bosshp = 0;
        }
        if(bosshp2 < 0) {
            bosshp2 = 0;
        }
        if(enemycurrenthp < 0) {
            enemycurrenthp = 0;
        }
        if(playercurrenthp < 0) {
            playercurrenthp = 0;
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
        playercurrenthp = playerhp;
        ultracharge = 0;
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

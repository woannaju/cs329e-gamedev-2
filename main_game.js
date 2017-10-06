main_game = function(game) {

};


var player1;
var player2;    
var cursors;
var hitboxes1;
var timer;
var timerEvent;
var text;

main_game.prototype = {

    preload: function() {
    	game.load.image('dojo_bg', '/assets/dojo_background.jpg');
        game.load.image('dark_bg', '/assets/dark_background.jpg');
        game.load.image('test', '../assets/hadouken.png');
        //game.load.spritesheet('ryuStand', 'assets/ryuStand80x111.png', 80, 111);
        game.load.spritesheet('ryu', '/assets/RyuSpriteMap125x135.png', 125, 135);
        game.load.spritesheet('enemy', '/assets/enemy.png', 76, 108);
        game.load.spritesheet('ken', '/assets/ken-sprite-sheet.png', 103, 135);
    },



    create: function() {
    	game.physics.startSystem(Phaser.Physics.ARCADE);
    	game.add.sprite(0,0,'dojo_bg');
        
        timer = game.time.create();
        timerEvent = timer.add(Phaser.Timer.SECOND * 59, endTimer, this);
        
        timer.start();

        player1 = game.add.sprite(500, 400, 'ryu');
        player2 = game.add.sprite(850, 400, 'ken');
        player1.scale.setTo(2,2);
        player2.scale.setTo(1.78,1.78);

        game.physics.arcade.enable(player1);
        game.physics.arcade.enable(player2);
        game.physics.arcade.collide(player1, player2);

        player1.body.bounce.y = 0.2;
        player1.body.gravity.y = 800;
        player1.body.collideWorldBounds = true;
        player2.body.bounce.y = 0.2;
        player2.body.gravity.y = 800;
        player2.body.collideWorldBounds = true;

        player1.body.setSize(85,120,25,25);

        hitboxes1 = game.add.group();
        hitboxes1.enableBody = true;
        player1.addChild(hitboxes1);

        game.physics.arcade.enable(hitboxes1); // this line must be before the body propety of a hitbox is modified



        var hitbox1 = game.make.sprite(37, 50, null); // x pos, y pos, sprite name, all relative to player position 
        var hitbox2 = game.make.sprite(45, 35, null);
        var hitbox3 = game.make.sprite(30, 75, null);
        var hitbox4 = game.make.sprite(60, 75, null);

        hitboxes1.add(hitbox1);
        hitboxes1.add(hitbox2);
        hitboxes1.add(hitbox3);
        hitboxes1.add(hitbox4);

        hitbox1.name = 'torso';
        hitbox2.name = 'head';
        hitbox3.name = 'left_leg';
        hitbox4.name = 'right_leg';

        hitbox1.body.setSize(85,50,0,0); // size of sprite: width, height, offset width, offset height
        hitbox2.body.setSize(50,30,0,0);
        hitbox3.body.setSize(50,110,0,0);
        hitbox4.body.setSize(50,110,0,0);

        hitboxes1.forEachExists(function(hitbox) {   // hitboxes follow player properly by setting sprite.body.moves = false (not same as immovable)
            hitbox.body.moves = false;     
        });


        player1.animations.add('idle', [0, 1, 2, 3, 4, 5], 5, true);
        player1.animations.add('backwards', [6, 7, 8, 9, 10, 11], 5, true);
        player1.animations.add('forwards', [12, 13, 14, 15, 16, 17], 5, true);
        player1.animations.add('jump', [18, 19, 20, 21, 22, 23], 5, true);
        player1.animations.add('shoruken', [24, 25, 26, 27, 28, 29], 7, true);
        player1.animations.add('crouch', [42], 5, true);
        
        player2.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8], 5, true);
        player2.animations.add('backwards', [10, 11, 12, 13, 14], 5, true);
        player2.animations.add('forwards', [15, 16, 17, 18, 19], 5, true);
        player2.animations.add('jump', [25, 27, 28, 29, 30,31,32,33,34], 7, true);
        player2.animations.add('crouch', [23], 5, true);
        
        
        cursors = game.input.keyboard.createCursorKeys();

    },    

    update: function() {
        player1.body.velocity.x = 0;
        player2.body.velocity.x = 0;
        
        upButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
        downButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
        leftButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
        rightButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
        tButton = game.input.keyboard.addKey(Phaser.Keyboard.T); // for hitbox control
        yButton = game.input.keyboard.addKey(Phaser.Keyboard.Y); // for hitbox control

        game.physics.arcade.overlap(hitboxes1, player2, overlap, null, this);

        //player1 controls
        if (cursors.left.isDown && cursors.right.isDown) {
                player1.animations.play('shoruken');
            }

        else if (cursors.left.isDown) {
                //  Move to the left
                player1.body.velocity.x = -200;
                if (player1.body.onFloor()) {
                    player1.animations.play('backwards');
                }
            }
        else if (cursors.right.isDown) {
                //  Move to the left
                player1.body.velocity.x = 200;
                if (player1.body.onFloor()) {
                    player1.animations.play('forwards');
                }
            } 
        else if (cursors.down.isDown) {
                // crouch
                player1.body.velocity.x = 0;
                player1.animations.play('crouch');
            }
        else {
            //  Stand still
            if (player1.body.onFloor()) {
                player1.animations.play('idle');
            }
            //player.frame = 2;
        }
        if (cursors.up.isDown && player1.body.onFloor()){
                //  Jump
                player1.body.velocity.y = -500;
                player1.animations.play('jump');
            }

        
        
        //player2 controls
        if (leftButton.isDown) {
            player2.body.velocity.x = -150;
            if (player2.body.onFloor()) {
                player2.animations.play('forwards');
            }
        } 
        else if (rightButton.isDown) {
            player2.body.velocity.x = 150;
            if (player2.body.onFloor()) {
                player2.animations.play('backwards');
            }

        } 
        else if (downButton.isDown) {
                // crouch
            player2.body.velocity.x = 0;
            player2.animations.play('crouch');
        }
        else {
            if (player2.body.onFloor()) {
                player2.animations.play('idle');
            }
        }
        if (upButton.isDown && player2.body.onFloor()){
                //  Jump
                player2.body.velocity.y = -500;
                player2.animations.play('jump');
            }


        // Hitboxes1 controls

        if (tButton.isDown) {

            enableHitbox('head'); // if T is pressed down, the head hitbox is reenabled
        }
        else if (yButton.isDown) {

            disableAllHitboxes(); // if Y is pressed down, all hitboxes in hitboxes1 are removed
            game.state.start("title_screen");
        }


    },
        
    render: function() {
        
        if(timer.running) {
            game.debug.text(formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), 483, 60, "#ffb64d", '60px ScriptoramaMarkdownJF');
        }
        else {
            game.debug.text("End of Round", 200, 250, "#ffb64d", '100px ScriptoramaMarkdownJF');
        }
        
        function formatTime(s) {
            var minutes = "0" + Math.floor(s / 60);
            var seconds = "0" + (s - minutes * 60);
            return seconds.substr(-2);  
        }
        
        // game.debug.body(player1);
        game.debug.body(player2);

        hitboxes1.forEachExists(function(hitbox) {          
            game.debug.body(hitbox);     
        });

    }
};

function enableHitbox(hitboxName) {
    for(var i = 0; i < hitboxes1.children.length; i++){

        if(hitboxes1.children[i].name === hitboxName){
            hitboxes1.children[i].reset(50,30);   // this is the specific location of the head hitbox            

        }
    }
    console.log('reenabled ' + hitboxName + ' hitbox');
}

function disableAllHitboxes() {     
    hitboxes1.forEachExists(function(hitbox) {          
        hitbox.kill();     
    });
    console.log('killed all hitboxes in hitboxes1')
}

function endTimer() {
    timer.stop();
}


function overlap(player1, player2) {

    player1.kill();
    console.log('killed player 2');
}

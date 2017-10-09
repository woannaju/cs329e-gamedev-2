var playState = function(game){
    var player1;
    var player2;    
    var cursors;
    var hitboxes1;
    var timer;
    var timerEvent;
    var text;
}




playState.prototype = {

    create: function() {
        console.log('play')
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);
    	this.game.add.sprite(0,0,'dojo_bg');
        
        timer = this.game.time.create();
        timerEvent = timer.add(Phaser.Timer.SECOND * 59, endTimer, this);
        
        timer.start();

        player1 = this.game.add.sprite(500, 400, 'ryu');
        player2 = this.game.add.sprite(850, 400, 'ken');
        player1.scale.setTo(.8,.8);
        player2.scale.setTo(.8, .8);

        this.game.physics.arcade.enable(player1);
        this.game.physics.arcade.enable(player2);
        this.game.physics.arcade.collide(player1, player2);

        player1.body.bounce.y = 0.2;
        player1.body.gravity.y = 800;
        player1.body.collideWorldBounds = true;
        player2.body.bounce.y = 0.2;
        player2.body.gravity.y = 800;
        player2.body.collideWorldBounds = true;

        player1.body.setSize(130,290,10,15);
        player2.body.setSize(130,290,10,15)

        hitboxes1 = this.game.add.group();
        hitboxes1.enableBody = true;
        player1.addChild(hitboxes1);

        this.game.physics.arcade.enable(hitboxes1); // this line must be before the body propety of a hitbox is modified



        var hitbox1 = this.game.make.sprite(37, 50, null); // x pos, y pos, sprite name, all relative to player position 
        var hitbox2 = this.game.make.sprite(45, 35, null);
        var hitbox3 = this.game.make.sprite(30, 75, null);
        var hitbox4 = this.game.make.sprite(60, 75, null);

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


        player1.animations.add('idle', [0, 1, 2, 3, 4, 5, 6], 5, true);
        player1.animations.add('backwards', [7, 8, 9, 10, 11, 12], 5, true);
        player1.animations.add('forwards', [13, 14, 15, 16, 17, 18], 5, true);
        player1.animations.add('jump', [19, 20, 21, 22, 23, 24], 5, true);
        player1.animations.add('shoruken', [25, 26, 27, 28, 29, 30], 7, true);
        player1.animations.add('crouch', [31], 5, true);
        
        player2.animations.add('idle', [0, 1, 2, 3, 4, 5, 6], 5, true);
        player2.animations.add('backwards', [7, 8, 9, 10, 11, 12], 5, true);
        player2.animations.add('forwards', [13, 14, 15, 16, 17, 18], 5, true);
        player2.animations.add('jump', [19, 20, 21, 22, 23, 24], 5, true);
        player2.animations.add('shoruken', [25, 26, 27, 28, 29, 30], 7, true);
        player2.animations.add('crouch', [31], 5, true);
//        player2.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8], 5, true);
//        player2.animations.add('backwards', [10, 11, 12, 13, 14], 5, true);
//        player2.animations.add('forwards', [15, 16, 17, 18, 19], 5, true);
//        player2.animations.add('jump', [25, 27, 28, 29, 30,31,32,33,34], 7, true);
//        player2.animations.add('crouch', [23], 5, true);
        
        
        cursors = this.game.input.keyboard.createCursorKeys();

        //health bar
        player1.health = 75;
        player1.maxHealth = 100;
        this.healthMeterBar = this.game.add.plugin(Phaser.Plugin.HealthMeter);
        this.healthMeterBar.bar(player1, {
                y: 20, x: 106,
                width: 300, height: 40,
                foreground: '#ff0000',
                background: '#aa0000',
                alpha: 0.6
            });

        player2.health = 50;
        player2.maxHealth = 100;
        this.healthMeterBar = this.game.add.plugin(Phaser.Plugin.HealthMeter);
        this.healthMeterBar.bar(player2, {
                y: 20, x: 618,
                width: 300, height: 40,
                foreground: '#ff0000',
                background: '#aa0000',
                alpha: 0.6
            });

    },    

    update: function() {
        player1.body.velocity.x = 0;
        player2.body.velocity.x = 0;
        
        upButton = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        downButton = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        leftButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        rightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        tButton = this.game.input.keyboard.addKey(Phaser.Keyboard.T); // for hitbox control
        yButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Y); // for hitbox control

        this.game.physics.arcade.overlap(hitboxes1, player2, overlap, null, this);

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
            this.game.state.start("title_screen"); // temporarily lets you go to the title screen
        }


    },
        
    render: function() {
        
        if(timer.running) {
            this.game.debug.text(formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), 483, 60, "#ffb64d", '60px ScriptoramaMarkdownJF');
        }
        else {
            this.game.debug.text("End of Round", 200, 250, "#ffb64d", '100px ScriptoramaMarkdownJF');
            //send to endState Winner/loser/sudden death
        }
        
        function formatTime(s) {
            var minutes = "0" + Math.floor(s / 60);
            var seconds = "0" + (s - minutes * 60);
            return seconds.substr(-2);  
        }

        this.game.debug.body(player1);
        this.game.debug.body(player2);
    
        for(var i = 0; i < hitboxes1.children.length; i++){
            
            this.game.debug.body(hitboxes1.children[i]);
        }
       
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

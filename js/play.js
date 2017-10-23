var playState = function(game){
    var player1;
    var player2;    
    var cursors;
    var p1_hitboxes;
    var p1_attack_hitboxes;
    var p2_attack_hitboxes;
    var p1_attack_hitbox_locations;
    var p2_attack_hitbox_locations;
    var p2_hitboxes;
    var timer;
    var timerEvent;
    var text;
    var cpu_ai;
    var music;
}

//javascript global vars
var p1_attack_anim_list = [];   // list of attack animations for p1
var p2_attack_anim_list = [];   // list of attack animations for p2


playState.prototype = {

    init: function() {

        upButton = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        downButton = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        leftButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        rightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        // tButton = this.game.input.keyboard.addKey(Phaser.Keyboard.T); // for hitbox control
        // yButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Y); // for hitbox control
        eButton = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
        qMark = this.game.input.keyboard.addKey(Phaser.Keyboard.QUESTION_MARK);
        peButton = this.game.input.keyboard.addKey(Phaser.Keyboard.PERIOD);
        qButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        quotButton = this.game.input.keyboard.addKey(Phaser.Keyboard.QUOTES);
    },

    create: function() {
        console.log('play')
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);
    	bg = this.game.add.sprite(70,0,'boxingring');
        
        timer = this.game.time.create();
        timerEvent = timer.add(Phaser.Timer.SECOND * 59, endTimer, this);
        
        timer.start();

        player2 = this.game.add.sprite(500, 400, 'ryu');
        player1 = this.game.add.sprite(850, 400, 'ken');
        player1.scale.setTo(.8,.8);
        player2.scale.setTo(.8, .8);
        bg.scale.setTo(0.2,0.2);

        this.game.loading_music.stop();

        music = this.game.add.audio('boden');
        music.play();

        

        this.game.physics.arcade.enable(player1);
        this.game.physics.arcade.enable(player2);
        this.game.physics.arcade.collide(player1, player2);

        player1.body.bounce.y = 0.2;
        player1.body.gravity.y = 1000;
        player1.body.collideWorldBounds = true;
        player2.body.bounce.y = 0.2;
        player2.body.gravity.y = 1000;
        player2.body.collideWorldBounds = true;

        player1.body.setSize(130,290,10,15);
        player2.body.setSize(130,290,10,15)

        
        //player 1 hitboxes
        p1_hitboxes = this.game.add.group();
        p1_attack_hitboxes = this.game.add.group(); // contains all hitboxes for all attacks for p1
        p1_hitboxes.enableBody = true;
        p1_attack_hitboxes.enableBody = true;
        player1.addChild(p1_hitboxes);
        player1.addChild(p1_attack_hitboxes);
        this.game.physics.arcade.enable(p1_hitboxes); // this line must be before the body propety of a hitbox is modified
        this.game.physics.arcade.enable(p1_attack_hitboxes);

        p1_attack_hitbox_locations = {  punch_x: 7,
                                        punch_y: 93,
                                        kickright_x: 135,
                                        kickright_y: 150,
                                        kickleft_x: 0,
                                        kickleft_y: 150,
                                     };
        
        var hitbox1 = this.game.make.sprite(67, 15, null); // x pos, y pos, sprite name, all relative to player position 
        var hitbox2 = this.game.make.sprite(57, 89, null);
        var hitbox3 = this.game.make.sprite(47, 190, null);
        var hitbox4 = this.game.make.sprite(110, 190, null);

        var punch_hitbox = this.game.make.sprite(p1_attack_hitbox_locations.punch_x, p1_attack_hitbox_locations.punch_y, null);
        var kickright_hitbox = this.game.make.sprite(p1_attack_hitbox_locations.kickright_x, p1_attack_hitbox_locations.kickright_y, null);
        var kickleft_hitbox = this.game.make.sprite(p1_attack_hitbox_locations.kickleft_x, p1_attack_hitbox_locations.kickleft_y, null);


        p1_hitboxes.add(hitbox1);
        p1_hitboxes.add(hitbox2);
        p1_hitboxes.add(hitbox3);
        p1_hitboxes.add(hitbox4);

        p1_attack_hitboxes.add(punch_hitbox);
        p1_attack_hitboxes.add(kickright_hitbox);
        p1_attack_hitboxes.add(kickleft_hitbox);

        hitbox1.name = 'head';
        hitbox2.name = 'torso';
        hitbox3.name = 'left_leg';
        hitbox4.name = 'right_leg';

        punch_hitbox.name = 'punch';
        kickright_hitbox.name = 'kickright';
        kickleft_hitbox.name = 'kickleft';

        hitbox1.body.setSize(50,50,0,0); // size of sprite: width, height, offset width, offset height
        hitbox2.body.setSize(70,87,0,0);
        hitbox3.body.setSize(35,90,0,0);
        hitbox4.body.setSize(35,90,0,0);

        punch_hitbox.body.setSize(35,17,0,0);
        kickright_hitbox.body.setSize(50,20,0,0);
        kickleft_hitbox.body.setSize(50,20,0,0);

        p1_hitboxes.forEachExists(function(hitbox) {   // hitboxes follow player properly by setting sprite.body.moves = false (not same as immovable)
            hitbox.body.moves = false;     
        });

        p1_attack_hitboxes.forEachExists(function(hitbox) {  // for punch hitboxes
            
            hitbox.body.moves = false;
            hitbox.kill(); // kill each attack hitbox since none should be active     
        });
        
        //player 2 hitboxes
        p2_hitboxes = this.game.add.group();
        p2_attack_hitboxes = this.game.add.group(); // contains all hitboxes for all attacks for p2
        p2_hitboxes.enableBody = true;
        p2_attack_hitboxes.enableBody = true;
        player2.addChild(p2_hitboxes);
        player2.addChild(p2_attack_hitboxes);
        this.game.physics.arcade.enable(p2_hitboxes); // this line must be before the body propety of a hitbox is modified
        this.game.physics.arcade.enable(p2_attack_hitboxes);
        
        p2_attack_hitbox_locations = {  punch_x: 122,
                                        punch_y: 93,
                                        kickright_x: 135,
                                        kickright_y: 150,
                                     };

        var hitbox1_2 = this.game.make.sprite(67, 15, null); // x pos, y pos, sprite name, all relative to player position 
        var hitbox2_2 = this.game.make.sprite(57, 89, null);
        var hitbox3_2 = this.game.make.sprite(47, 190, null);
        var hitbox4_2 = this.game.make.sprite(110, 190, null);

        var punch_hitbox_2 = this.game.make.sprite(p2_attack_hitbox_locations.punch_x, p2_attack_hitbox_locations.punch_y, null);
        var kickright_hitbox_2 = this.game.make.sprite(p2_attack_hitbox_locations.kickright_x, p2_attack_hitbox_locations.kickright_y, null);


        p2_hitboxes.add(hitbox1_2);
        p2_hitboxes.add(hitbox2_2);
        p2_hitboxes.add(hitbox3_2);
        p2_hitboxes.add(hitbox4_2);

        p2_attack_hitboxes.add(punch_hitbox_2);
        p2_attack_hitboxes.add(kickright_hitbox_2);

        hitbox1_2.name = 'head';
        hitbox2_2.name = 'torso';
        hitbox3_2.name = 'left_leg';
        hitbox4_2.name = 'right_leg';

        punch_hitbox_2.name = 'punch';
        kickright_hitbox_2.name = 'kickright'

        hitbox1_2.body.setSize(50,50,0,0); // size of sprite: width, height, offset width, offset height
        hitbox2_2.body.setSize(70,87,0,0);
        hitbox3_2.body.setSize(35,90,0,0);
        hitbox4_2.body.setSize(35,90,0,0);

        punch_hitbox_2.body.setSize(35,17,0,0);
        kickright_hitbox_2.body.setSize(50,20,0,0);


        p2_hitboxes.forEachExists(function(hitbox) {   // hitboxes follow player properly by setting sprite.body.moves = false (not same as immovable)
            hitbox.body.moves = false;     
        });
        
        p2_attack_hitboxes.forEachExists(function(hitbox) {  // for punch hitboxes
            
            hitbox.body.moves = false;
            hitbox.kill(); // kill each attack hitbox since none should be active     
        });

        this.invincibleTimer = 0;
        this.cpuTimer = 0;

        player1.animations.add('idle', [0, 1, 2, 3, 4, 5, 6], 5, true);
        player1.animations.add('backwards', [7, 8, 9, 10, 11, 12], 5, true);
        player1.animations.add('forwards', [13, 14, 15, 16, 17, 18], 5, true);
        player1.animations.add('jumpleft', [19, 20, 21, 22, 23, 24], 5, true);
        player1.animations.add('jumpright', [38, 39, 40, 41, 42, 43], 5, true);
        player1.animations.add('shoruken', [25, 26, 27, 28, 29, 30], 7, false);
        player1.animations.add('crouch', [31], 5, true);
        var p1_anim_punch = player1.animations.add('punch', [32, 33, 34, 36, 0], 10, false);
        var p1_anim_kickleft = player1.animations.add('kickleft', [44, 45, 46, 47], 10, false);
        var p1_anim_kickright = player1.animations.add('kickright', [54, 55, 56, 57], 10, false);

        p1_attack_anim_list.push(p1_anim_punch); // add the rest of p1's attacks here
        p1_attack_anim_list.push(p1_anim_kickleft);
        p1_attack_anim_list.push(p1_anim_kickright);


        player2.animations.add('idle', [0, 1, 2, 3, 4, 5, 6], 5, true);
        player2.animations.add('backwards', [7, 8, 9, 10, 11, 12], 5, true);
        player2.animations.add('forwards', [13, 14, 15, 16, 17, 18], 5, true);
        player2.animations.add('jumpright', [19, 20, 21, 22, 23, 24], 5, true);
        player2.animations.add('jumpleft', [38, 39, 40, 41, 42, 43], 5, true);
        player2.animations.add('shoruken', [25, 26, 27, 28, 29, 30], 7, false);
        player2.animations.add('crouch', [31], 5, true);
        var p2_anim_punch = player2.animations.add('punch', [32, 33, 34, 36, 0], 10, false);
        var p2_anim_kickright = player2.animations.add('kickright', [44, 45, 46, 47], 10, false);
        
        p2_attack_anim_list.push(p2_anim_punch); // add the rest of p2's attacks here
        p2_attack_anim_list.push(p2_anim_kickright);

//        player2.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8], 5, true);
//        player2.animations.add('backwards', [10, 11, 12, 13, 14], 5, true);
//        player2.animations.add('forwards', [15, 16, 17, 18, 19], 5, true);
//        player2.animations.add('jump', [25, 27, 28, 29, 30,31,32,33,34], 7, true);
//        player2.animations.add('crouch', [23], 5, true);
        
        // animation callback functions
        // p1_anim_punch.onStart.add(attackAnimStarted, this);
        // p1_anim_punch.onLoop.add(attackAnimEnded, this);
        
        cursors = this.game.input.keyboard.createCursorKeys();

        //health bar
        player1.health = 10;
        player1.maxHealth = 100;
        
        this.healthMeterBar = this.game.add.plugin(Phaser.Plugin.HealthMeter);
        this.healthMeterBar.bar(player1, {
                y: 20, x: 618,
                width: 300, height: 40,
                foreground: '#ff0000',
                background: '#aa0000',
                alpha: 0.6
            });

        player2.health = 10;
        player2.maxHealth = 100;
        this.healthMeterBar = this.game.add.plugin(Phaser.Plugin.HealthMeter);
        this.healthMeterBar.bar(player2, {
                y: 20, x: 106,
                width: 300, height: 40,
                foreground: '#ff0000',
                background: '#aa0000',
                alpha: 0.6
            });

        cpu_ai = false; // boolean that determines if cpu ai takes over player 2 or not
        move_backwards = false;
    },    

    update: function() {
        player1.body.velocity.x = 0;
        player2.body.velocity.x = 0;
        

        // this.game.physics.arcade.overlap(p1_hitboxes, player2, overlap, null, this);
        this.game.physics.arcade.overlap(p1_attack_hitboxes, player2, overlap, null, this);
        this.game.physics.arcade.overlap(p2_attack_hitboxes, player1, overlap, null, this);

        //player1 controls
        if (cursors.left.isDown && cursors.right.isDown) {
                player1.animations.play('shoruken');
            }

        else if (cursors.left.isDown) {
                //  Move to the left
                player1.body.velocity.x = -400;
                if (player1.body.onFloor()) {
                    player1.animations.play('backwards');
                }
            }
        else if (cursors.right.isDown) {
                //  Move to the left
                player1.body.velocity.x = 400;
                if (player1.body.onFloor()) {
                    player1.animations.play('forwards');
                }
            } 
        else if (cursors.down.isDown) {
                // crouch
                player1.body.velocity.x = 0;
                player1.animations.play('crouch');
            }
        else if (qMark.isDown) {
            player1.animations.play('punch');

            for(var i = 0; i < p1_attack_anim_list.length; i++) { // need to do this loop to make p1_attack_anim_list stay as a javascript array instead of object
                if (p1_attack_anim_list[i].name == 'punch') {
                    attackAnimStarted(player1, p1_attack_anim_list[i])
                }
            }
        }
        else if (peButton.isDown) {
            player1.animations.play('kickleft');
            for(var i = 0; i < p1_attack_anim_list.length; i++) {
                if (p1_attack_anim_list[i].name == 'kickleft') {
                    attackAnimStarted(player1, p1_attack_anim_list[i])
                }
            }
        }
        else if (quotButton.isDown) {
            player1.animations.play('kickright');
            for(var i = 0; i < p1_attack_anim_list.length; i++) {
                if (p1_attack_anim_list[i].name == 'kickright') {
                    attackAnimStarted(player1, p1_attack_anim_list[i])
                }
            }

        }
        else {
            //  Stand still

            var p1_attack_isPlaying = isAttackAnimPlaying(p1_attack_anim_list); // checks if any attack animations are playing for p1

            if (player1.body.onFloor() && !p1_attack_isPlaying) {
                player1.animations.play('idle');
            }
        }

        if (cursors.up.isDown && player1.body.onFloor()){
                //  Jump
            if(cursors.right.isDown) {
                player1.body.velocity.y = -550;
                player1.animations.play('jumpright');
            }
            else {
                player1.body.velocity.y = -550;
                player1.animations.play('jumpleft');
            }
        }
        
        // p1 attack animation callbacks
        for(var i = 0; i < p1_attack_anim_list.length; i++) { // if animations are not playing, then hitboxes are inactive

            if (!p1_attack_anim_list[i].isPlaying) {

                attackAnimEnded(player1, p1_attack_anim_list[i]);
            }
        }

        
        // enemy cpu ai   
        if (cpu_ai == true) {

            if (this.game.time.now < this.cpuTimer) { // back away if not enough time has passed between attacks
                back_away = true;
            }
            else {
                back_away = false;
                move_backwards = Math.random() < 0.50 ? true : false; // 50% chance commit to moving backward or forward after hitting player
            }

            if (Math.round(player1.y == Math.round(player2.y))) { // on same vertical (y) plane

                var delta_x = player2.x - player1.x;

                if (back_away) { // back away from player 
                  
                    if (move_backwards) { // commit to moving backwards when backing away

                        player2.body.velocity.x = 300;
                        if (player2.body.onFloor()) {
                            player2.animations.play('backwards');
                        }
                    } 
                    else {

                        player2.body.velocity.x = -300;
                        if (player2.body.onFloor()) {
                            player2.animations.play('forwards');
                        }
                    }
                }
                // ready to attack again
                else if (delta_x >= -50 && delta_x <= 0) { // in range for punch attack
                    
                    if (!back_away) { // enough time has passed between attacks

                        if (Math.random() < 0.25) // 25% chance that cpu will do punch attack
                        {
                            player2.body.velocity.x = 0;
                            player2.animations.play('punch');
                            for(var i = 0; i < p2_attack_anim_list.length; i++) {
                                if (p2_attack_anim_list[i].name == 'punch') {
                                    attackAnimStarted(player2, p2_attack_anim_list[i])
                                }
                            }
                            this.cpuTimer = this.game.time.now + 500; // cpu will back away

                        }
                        else {                      // fail to punch
                            console.log('failure to punch')
                        }


                    }
                    else { // not enough time has passed to attack again, so back away
                        // console.log('backing away')
                    }   
                }
                else if (delta_x < 0) {

                    player2.body.velocity.x = 300;
                    if (player2.body.onFloor()) {
                        player2.animations.play('backwards');
                    }
                }
                else {

                    player2.body.velocity.x = -300;
                    if (player2.body.onFloor()) {
                        player2.animations.play('forwards');
                    }
                }
                
            }
        }  
        else {
        //player2 controls
            if (leftButton.isDown && rightButton.isDown) {
                    player2.animations.play('shoruken');
                }
            else if (leftButton.isDown) {
                player2.body.velocity.x = -400;
                if (player2.body.onFloor()) {
                    player2.animations.play('forwards');
                }
            } 
            else if (rightButton.isDown) {
                player2.body.velocity.x = 400;
                if (player2.body.onFloor()) {
                    player2.animations.play('backwards');
                }

            } 
            else if (downButton.isDown) {
                    // crouch
                player2.body.velocity.x = 0;
                player2.animations.play('crouch');
            }
            else if (eButton.isDown) {
                player2.animations.play('punch');
                for(var i = 0; i < p2_attack_anim_list.length; i++) {
                    if (p2_attack_anim_list[i].name == 'punch') {
                        attackAnimStarted(player2, p2_attack_anim_list[i])
                    }
                }
            }
            else if (qButton.isDown) {
                player2.animations.play('kickright');
                for(var i = 0; i < p2_attack_anim_list.length; i++) {
                    if (p2_attack_anim_list[i].name == 'kickright') {
                        attackAnimStarted(player2, p2_attack_anim_list[i])
                    }
                }
            }
            else {

                var p2_attack_isPlaying = isAttackAnimPlaying(p2_attack_anim_list); // checks if any attack animations are playing for p2

                if (player2.body.onFloor() && !p2_attack_isPlaying) {
                    player2.animations.play('idle');
                }
            }

            if (upButton.isDown && player2.body.onFloor()){
                    //  Jump
                if (leftButton.isDown){
                    player2.body.velocity.y = -550;
                    player2.animations.play('jumpleft');
                }
                else {
                    player2.body.velocity.y = -550;
                    player2.animations.play('jumpright');
                }
            }
        }

        // p2 attack animation callbacks
        for(var i = 0; i < p2_attack_anim_list.length; i++) { // if attack animation not playing, hitboxes inactive

            if (!p2_attack_anim_list[i].isPlaying) {

                attackAnimEnded(player2, p2_attack_anim_list[i]);
            }
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

       // this.game.debug.body(player1);
       // this.game.debug.body(player2);
   

        // player 1 body hitboxes   
        for(var i = 0; i < p1_hitboxes.children.length; i++){
           
            this.game.debug.body(p1_hitboxes.children[i]);
        }
        // player 2 body hitboxes
        for(var i = 0; i < p2_hitboxes.children.length; i++){
           
            this.game.debug.body(p2_hitboxes.children[i]);
        }

        // player 1 attack hitboxes
        for(var i = 0; i < p1_attack_hitboxes.children.length; i++){
           
           this.game.debug.body(p1_attack_hitboxes.children[i]);
        }
        // player2 attack hitboxes
        for(var i = 0; i < p2_attack_hitboxes.children.length; i++){
           
           this.game.debug.body(p2_attack_hitboxes.children[i]);
        }
       
    },

    shutdown: function() {
        console.log('shutdown called');
        
        /**
         NEED TO FIND A WAY TO CALL 'PLAY' STATE WITH ACTIVE HITBOXES AFTER GAME OVER SCREEN
        */

        
        // p1_attack_hitboxes.forEachExists(function(hitbox) {  // for punch hitboxes
            
        //     hitbox.kill(); // kill each attack hitbox since none should be active     
        // });
        // p2_attack_hitboxes.forEachExists(function(hitbox) {

        //     hitbox.kill();
        // });
        // this.game.world.removeAll();
        // for (var i = 0; i < p1_attack_anim_list; i++) {
        //     disableAllHitboxes(p1_attack_anim_list[i].name, p1_attack_hitboxes);
        // }
        // for (var i = 0; i < p2_attack_anim_list; i+_) {
        //     disableAllHitboxes(p2_attack_anim_list[i].name, p2_attack_hitboxes);
        // }

    }
};

function enableAllHitboxes(hitboxName, hitboxGroup, hitboxGroupLocations) {
    for(var i = 0; i < hitboxGroup.children.length; i++) {

        if (hitboxGroup.children[i].name == hitboxName) {

            var x_pos = hitboxGroupLocations[hitboxGroup.children[i].name + "_x"]
            var y_pos = hitboxGroupLocations[hitboxGroup.children[i].name + "_y"]

            hitboxGroup.children[i].reset(x_pos, y_pos);
            console.log('enabled hitbox for ' + hitboxName);
        }
    }
    // console.log('enabled hitboxes for ' + hitboxName);
}

function disableAllHitboxes(hitboxName, hitboxGroup) {     
    for(var i = 0; i < hitboxGroup.children.length; i++) {
        // console.log(hitboxGroup.children[i].name);
        if (hitboxGroup.children[i].name == hitboxName) {

            hitboxGroup.children[i].reset(0,0); // reset location of sprite to be off screen
            hitboxGroup.children[i].kill();
            // console.log('killed some child');
        }
    }
    // console.log('killed all hitboxes for ' + hitboxName);
}

function endTimer() {
    timer.stop();
}


function overlap(player1, player2) {
    if (this.game.time.now > this.invincibleTimer) {
            player1.health = player1.health -10;
            this.invincibleTimer = this.game.time.now + 500;
        }
    if (player1.health == 0 || player2.health == 0) {
        music.stop();
        this.game.state.start('end')
    }
    //player1.health = player1.health -10;
    console.log('hit player 2');
}

function attackAnimStarted(sprite, animation) {

    if (sprite == player1) {
        var hitboxGroup = p1_attack_hitboxes;
        var hitboxGroupLocations = p1_attack_hitbox_locations;
    }
    else {
        var hitboxGroup = p2_attack_hitboxes;
        var hitboxGroupLocations = p2_attack_hitbox_locations;
    }
    // if (animation.name == 'punch') {
    //     var hitboxName = 'punch';
    // }
    // else {
    //     // for future attacks

    // }

    var hitboxName = animation.name;
    // console.log(hitboxName);
    // console.log('punch anim started');
    enableAllHitboxes(hitboxName,hitboxGroup,hitboxGroupLocations);
}

function attackAnimEnded(sprite, animation) {

    if (sprite == player1) {

        var hitboxGroup = p1_attack_hitboxes;
    }
    else {
        var hitboxGroup = p2_attack_hitboxes;
    }

    if (animation.name == 'punch') {
        var hitboxName = 'punch';
    }
    else {
        // for future attacks
    }
    var hitboxName = animation.name;
    // console.log('punch anim ended');

    disableAllHitboxes(hitboxName,hitboxGroup)
}

// determine if attack animation is playing for a player
function isAttackAnimPlaying(attack_anim_list) {
    for(var i = 0; i < attack_anim_list.length; i++) {

        if (attack_anim_list[i].isPlaying) {

            return true;
        }
    }
    return false;
}

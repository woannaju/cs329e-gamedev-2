var playState = function(game){
    var player1;
    var player2;   
    var cursors;
    var p1_lasers;
    var p1_hitboxes;
    var p2_hitboxes;
    var p1_hitbox_locations;
    var p2_hitbox_locations;
    var p1_attack_hitboxes;
    var p2_attack_hitboxes;
    var p1_attack_hitbox_locations;
    var p2_attack_hitbox_locations;
    var p1_lasers_hitbox_locations;
    var p2_lasers_hitbox_locations;
    var p1_lasers_hitbox;
    var p2_lasers_hitbox;
    var p1_is_blocking;
    var p2_is_blocking;
    var p1_multiplier = .25;
    var p2_multiplier = .25;
    var timer;
    var timerEvent;
    var text;
    var cpu_ai;
    var music;
}

//javascript global vars -- must be arrays, even with single element
var p1_attack_anim_list = [];   // list of attack animations for p1
var p2_attack_anim_list = [];   // list of attack animations for p2
var p1_defense_anim_list = [];  // list of defensive animations for p2
var p2_defense_anim_list = [];  // list of defensive animations for p2


playState.prototype = {

//initialize the keyboard inputs
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
        zButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        commaButton = this.game.input.keyboard.addKey(Phaser.Keyboard.COMMA);
        space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

//Initializing sprites and sized
    create: function() {
        console.log('play');
        console.log('create called');
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);
    	bg = this.game.add.sprite(70,0,'boxingring');
        
//initialize timer
        timer = this.game.time.create();
        timerEvent = timer.add(Phaser.Timer.SECOND * 59, endTimer, this);
        
        //timer.start();

//initialize character sprites
        player2 = this.game.add.sprite(50, 400, 'ryu');
        player1 = this.game.add.sprite(850, 400, 'ken');
        player2.name = 'ryu';
        player1.name = 'ken';

//initializing defense
        player1.isHeadDisabled = false;
        player2.isHeadDisabled = false;

//initialize laser  
        laser1 = this.game.add.sprite(0, 0, 'laser'); // laser for p1
        laser1.alive = false;
        laser1.visible = false;
        laser2 = this.game.add.sprite(0, 0, 'laser2'); // laser for p2
        laser2.alive = false;
        laser2.visible = false;

//scaling
        player1.scale.setTo(.8, .8);
        player2.scale.setTo(.8, .8);
        bg.scale.setTo(0.2,0.2);
        laser1.scale.setTo(0.8, 0.8);
        laser2.scale.setTo(0.8, 0.8);

//stop title music and start play music 
        this.game.loading_music.stop();
        music = this.game.add.audio('boden');
        music.play();

//sound effects
        punching_sound = this.game.add.audio("punch_sound")
        kicking_sound = this.game.add.audio("kick_sound")
        blocking_sound = this.game.add.audio("block_sound")
        laser_sound = this.game.add.audio("laser_sound")

        
//enable physics and collisions
        this.game.physics.arcade.enable(player1);
        this.game.physics.arcade.enable(player2);
        this.game.physics.arcade.enable(laser1);
        this.game.physics.arcade.enable(laser2);
        this.game.physics.arcade.collide(player1, player2);
        this.game.physics.arcade.collide(laser1, player2);
        this.game.physics.arcade.collide(laser2, player1);

//physics parameters
        player1.body.bounce.y = 0.2;
        player1.body.gravity.y = 1000;
        player1.body.collideWorldBounds = true;
        player2.body.bounce.y = 0.2;
        player2.body.gravity.y = 1000;
        player2.body.collideWorldBounds = true;
        player1.body.setSize(130,290,10,15);
        player2.body.setSize(130,290,10,15);
//laser physics
        laser1.body.gravity.y = 0;
        laser1.body.collideWorldBounds = true;
        laser2.body.gravity.y = 0;
        laser2.body.collideWorldBounds = true;

        p1_lasers_hitbox_locations = {  laser_x: 0,
                                        laser_y: 0,
                                     };
        p1_lasers_hitbox = this.game.make.sprite(p1_lasers_hitbox_locations.laser_x, p1_lasers_hitbox_locations.laser_y, null);


        //player 1 hitboxes
        p1_hitboxes = this.game.add.group();
        p1_attack_hitboxes = this.game.add.group(); // contains all hitboxes for all attacks for p1
        p1_lasers = this.game.add.group();
        p1_hitboxes.enableBody = true;
        p1_attack_hitboxes.enableBody = true;
        p1_lasers.enableBody = true;
        p1_lasers_hitbox.enableBody = true;
        player1.addChild(p1_hitboxes);
        player1.addChild(p1_attack_hitboxes);
        this.game.physics.arcade.enable(p1_hitboxes); // this line must be before the body propety of a hitbox is modified
        this.game.physics.arcade.enable(p1_attack_hitboxes);
        this.game.physics.arcade.enable(p1_lasers);
        this.game.physics.arcade.enable(p1_lasers_hitbox);


        p1_lasers.createMultiple(1,'laser');
        p1_lasers.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetLaser);
        p1_lasers.setAll('checkWorldBounds', true);

        p1_attack_hitbox_locations = {  punch_x: 7,
                                        punch_y: 93,
                                        kickright_x: 135,
                                        kickright_y: 150,
                                        kickleft_x: 0,
                                        kickleft_y: 150,
                                     };

        p1_hitbox_locations = { head_x: 55,
                                head_y: 12,
                                torso_x: 57,
                                torso_y: 89,
                                left_leg_x: 47,
                                left_leg_y: 190,
                                right_leg_x: 110,
                                right_leg_y: 190,
                              }
        
        
        var hitbox1 = this.game.make.sprite(p1_hitbox_locations.head_x, p1_hitbox_locations.head_y, null); // x pos, y pos, sprite name, all relative to player position 
        var hitbox2 = this.game.make.sprite(p1_hitbox_locations.torso_x, p1_hitbox_locations.torso_y, null);
        var hitbox3 = this.game.make.sprite(p1_hitbox_locations.left_leg_x, p1_hitbox_locations.left_leg_y, null);
        var hitbox4 = this.game.make.sprite(p1_hitbox_locations.right_leg_x, p1_hitbox_locations.right_leg_y, null);

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
        p1_lasers_hitbox.name = 'laser';

        punch_hitbox.damage = 20;
        kickright_hitbox.damage = 10;
        kickleft_hitbox.damage = 10;
        p1_lasers_hitbox.damage = 15;

        hitbox1.body.setSize(50,50,0,0); // size of sprite: width, height, offset width, offset height
        hitbox2.body.setSize(70,87,0,0);
        hitbox3.body.setSize(35,90,0,0);
        hitbox4.body.setSize(35,90,0,0);

        punch_hitbox.body.setSize(35,17,0,0);
        kickright_hitbox.body.setSize(50,20,0,0);
        kickleft_hitbox.body.setSize(50,20,0,0);

        p1_lasers_hitbox.body.setSize(65,16,0,0);

        p1_hitboxes.forEachExists(function(hitbox) {   // hitboxes follow player properly by setting sprite.body.moves = false (not same as immovable)
            hitbox.body.moves = false;
            // hitbox.kill();     
        });

        p1_attack_hitboxes.forEachExists(function(hitbox) {  // for punch hitboxes
            
            hitbox.body.moves = false;
            hitbox.kill(); // kill each attack hitbox since none should be active     
        });

        p1_lasers_hitbox.body.moves = false;
        

        //player 2 hitboxes
        p2_lasers_hitbox_locations = {  laser_x: 0,
                                        laser_y: 0,
                                     };
        p2_lasers_hitbox = this.game.make.sprite(p2_lasers_hitbox_locations.laser_x, p2_lasers_hitbox_locations.laser_y, null);
        
        p2_hitboxes = this.game.add.group();
        p2_attack_hitboxes = this.game.add.group(); // contains all hitboxes for all attacks for p2
        p2_lasers = this.game.add.group();
        p2_hitboxes.enableBody = true;
        p2_attack_hitboxes.enableBody = true;
        p2_lasers.enableBody = true;
        p2_lasers_hitbox.enableBody = true;
        player2.addChild(p2_hitboxes);
        player2.addChild(p2_attack_hitboxes);
        this.game.physics.arcade.enable(p2_hitboxes); // this line must be before the body propety of a hitbox is modified
        this.game.physics.arcade.enable(p2_attack_hitboxes);
        this.game.physics.arcade.enable(p2_lasers);
        this.game.physics.arcade.enable(p2_lasers_hitbox);
        
        p2_lasers.createMultiple(1,'laser2');
        p2_lasers.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetLaser);
        p2_lasers.setAll('checkWorldBounds', true);

        p2_attack_hitbox_locations = {  punch_x: 122,
                                        punch_y: 93,
                                        kickright_x: 135,
                                        kickright_y: 150,
                                     };

        p2_hitbox_locations = { head_x: 55,
                                head_y: 12,
                                torso_x: 57,
                                torso_y: 89,
                                left_leg_x: 47,
                                left_leg_y: 190,
                                right_leg_x: 110,
                                right_leg_y: 190,
                              };

        var hitbox1_2 = this.game.make.sprite(p2_hitbox_locations.head_x, p2_hitbox_locations.head_y, null); // x pos, y pos, sprite name, all relative to player position 
        var hitbox2_2 = this.game.make.sprite(p2_hitbox_locations.torso_x, p2_hitbox_locations.torso_y, null);
        var hitbox3_2 = this.game.make.sprite(p2_hitbox_locations.left_leg_x, p2_hitbox_locations.left_leg_y, null);
        var hitbox4_2 = this.game.make.sprite(p2_hitbox_locations.right_leg_x, p2_hitbox_locations.right_leg_y, null);

        var punch_hitbox_2 = this.game.make.sprite(p2_attack_hitbox_locations.punch_x, p2_attack_hitbox_locations.punch_y, null);
        var kickright_hitbox_2 = this.game.make.sprite(p2_attack_hitbox_locations.kickright_x, p2_attack_hitbox_locations.kickright_y, null);

        p2_lasers_hitbox.name = 'laser';

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
        kickright_hitbox_2.name = 'kickright';

        punch_hitbox_2.damage = 20;
        kickright_hitbox_2.damage = 10;
        p2_lasers_hitbox.damage = 15;

        hitbox1_2.body.setSize(50,50,0,0); // size of sprite: width, height, offset width, offset height
        hitbox2_2.body.setSize(70,87,0,0);
        hitbox3_2.body.setSize(35,90,0,0);
        hitbox4_2.body.setSize(35,90,0,0);

        p2_lasers_hitbox.body.setSize(65,16,0,0);

        punch_hitbox_2.body.setSize(35,17,0,0);
        kickright_hitbox_2.body.setSize(50,20,0,0);


        p2_hitboxes.forEachExists(function(hitbox) {   // hitboxes follow player properly by setting sprite.body.moves = false (not same as immovable)
            hitbox.body.moves = false;     
        });
        
        p2_attack_hitboxes.forEachExists(function(hitbox) {  // for punch hitboxes
            
            hitbox.body.moves = false;
            hitbox.kill(); // kill each attack hitbox since none should be active     
        });

        p2_lasers_hitbox.body.moves = false;

        this.invincibleTimer = 0;
        this.cpuTimer = 0;

        player1.animations.add('idle', [0, 1, 2, 3, 4, 5, 6], 5, true);
        player1.animations.add('backwards', [7, 8, 9, 10, 11, 12], 5, true);
        player1.animations.add('forwards', [13, 14, 15, 16, 17, 18], 5, true);
        player1.animations.add('jumpleft', [19, 20, 21, 22, 23, 24], 5, true);
        player1.animations.add('jumpright', [38, 39, 40, 41, 42, 43], 5, true);
        player1.animations.add('shoruken', [25, 26, 27, 28, 29, 30], 7, false);
        var p1_anim_crouch = player1.animations.add('crouch', [31], 5, true);
        var p1_hit = player1.animations.add('hit', [58], 5, false);
        var p1_anim_punch = player1.animations.add('punch', [32, 33, 34, 36, 0], 10, false);
        var p1_anim_kickleft = player1.animations.add('kickleft', [44, 45, 46, 47], 10, false);
        var p1_anim_kickright = player1.animations.add('kickright', [54, 55, 56, 57], 10, false);

        p1_attack_anim_list.push(p1_anim_punch); // add the rest of p1's attacks here
        p1_attack_anim_list.push(p1_anim_kickleft);
        p1_attack_anim_list.push(p1_anim_kickright);
        p1_attack_anim_list.push(p1_hit);
        p1_defense_anim_list.push(p1_anim_crouch);

        player2.animations.add('idle', [0, 1, 2, 3, 4, 5, 6], 5, true);
        player2.animations.add('backwards', [7, 8, 9, 10, 11, 12], 5, true);
        player2.animations.add('forwards', [13, 14, 15, 16, 17, 18], 5, true);
        player2.animations.add('jumpright', [19, 20, 21, 22, 23, 24], 5, true);
        player2.animations.add('jumpleft', [38, 39, 40, 41, 42, 43], 5, true);
        player2.animations.add('shoruken', [25, 26, 27, 28, 29, 30], 7, false);
        var p2_anim_crouch = player2.animations.add('crouch', [31], 5, true);
        var p2_hit = player2.animations.add('hit', [58], 5, false);
        var p2_anim_punch = player2.animations.add('punch', [32, 33, 34, 36, 0], 10, false);
        var p2_anim_kickright = player2.animations.add('kickright', [44, 45, 46, 47], 10, false);
        
        
        p2_attack_anim_list.push(p2_anim_punch); // add the rest of p2's attacks here
        p2_attack_anim_list.push(p2_anim_kickright);
        p2_attack_anim_list.push(p2_hit);
        p2_defense_anim_list.push(p2_anim_crouch);

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
        player1.health = 100;
        player1.maxHealth = 100;
        
        this.healthMeterBar = this.game.add.plugin(Phaser.Plugin.HealthMeter);
        this.healthMeterBar.bar(player1, {
                y: 20, x: 618,
                width: 300, height: 40,
                foreground: '#ff0000',
                background: '#aa0000',
                alpha: 0.6
            });

        player2.health = 115; // *** change back to 100 later
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
        p1_is_blocking = false;
        p2_is_blocking = false;
        
        
        htp = this.game.add.sprite(0,0,'howtoplay');
        console.log('create finished')
    },    

    update: function() {
        player1.body.velocity.x = 0;
        player2.body.velocity.x = 0;
        
        if (space.isDown){
            htp.exists = false;
            timer.start();
        }

        for (var i = 0; i < p1_attack_hitboxes.children.length; i++) { // player 2 is attacked
            for (var j = 0; j < p2_hitboxes.children.length; j++) {
                this.game.physics.arcade.overlap(p2_hitboxes.children[j], p1_attack_hitboxes.children[i], overlap, null, this);
            }
            
        }
        for (var i = 0; i < p2_attack_hitboxes.children.length; i++) { // player 1 is attacked
            for (var j = 0; j < p1_hitboxes.children.length; j++) {
                this.game.physics.arcade.overlap(p1_hitboxes.children[j], p2_attack_hitboxes.children[i], overlap, null, this);
            }           
        }



        for (var i = 0; i < p2_hitboxes.children.length; i++) {
            this.game.physics.arcade.overlap(p2_hitboxes.children[i], p1_lasers_hitbox, overlap, null, this);
        }
        for (var i = 0; i < p1_hitboxes.children.length; i++) {
            this.game.physics.arcade.overlap(p1_hitboxes.children[i], p2_lasers_hitbox, overlap, null, this);
        }


        // this.game.physics.arcade.overlap(player2, p1_lasers_hitbox, overlap, null, this);
        // this.game.physics.arcade.overlap(player1, p2_lasers_hitbox, overlap, null, this);
        // this.game.physics.arcade.overlap(p1_attack_hitboxes, player2, overlap, null, this);
        // this.game.physics.arcade.overlap(p2_attack_hitboxes, player1, overlap, null, this);

        //player1 controls
        if(isAttackAnimPlaying(p2_attack_anim_list) == true && this.game.physics.arcade.overlap(player1, p2_attack_hitboxes.children) == true ){
            console.log('hit');
            player1.animations.play('hit');
//                player1.animations.play('hit');
            }
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
                p1_is_blocking = true;
                player1.body.velocity.x = 0;
                player1.animations.play('crouch');
                if (player1.isHeadDisabled == false){
                    disableAllHitboxes('head', p1_hitboxes);
                    player1.isHeadDisabled = true;
                    console.log('disabled head hitbox for p1');
                    //console.log('2');
                }
                
            }
        else if (qMark.isDown) {
            player1.animations.play('punch');
            punching_sound.play();
            for(var i = 0; i < p1_attack_anim_list.length; i++) { // need to do this loop to make p1_attack_anim_list stay as a javascript array instead of object
                if (p1_attack_anim_list[i].name == 'punch') {
                    attackAnimStarted(player1, p1_attack_anim_list[i])
                }
            }
        }
        else if (peButton.isDown) {
            player1.animations.play('kickleft');
            kicking_sound.play();
            for(var i = 0; i < p1_attack_anim_list.length; i++) {
                if (p1_attack_anim_list[i].name == 'kickleft') {
                    attackAnimStarted(player1, p1_attack_anim_list[i])
                }
            }
        }
        else if (quotButton.isDown) {
            player1.animations.play('kickright');
            kicking_sound.play();
            for(var i = 0; i < p1_attack_anim_list.length; i++) {
                if (p1_attack_anim_list[i].name == 'kickright') {
                    attackAnimStarted(player1, p1_attack_anim_list[i])
                }
            }

        }
        else if (commaButton.isDown) { // laser fired
            fireLaser(player1);
            


        }
        else {
            //  Stand still

            var p1_attack_isPlaying = isAttackAnimPlaying(p1_attack_anim_list); // checks if any attack animations are playing for p1
            p1_is_blocking = false;
            if (player1.body.onFloor() && !p1_attack_isPlaying) {
                player1.animations.play('idle');
            }
        }

        if (!isAttackAnimPlaying(p1_defense_anim_list)) {
            if (player1.isHeadDisabled == true){
                enableAllHitboxes('head', p1_hitboxes, p1_hitbox_locations);
                player1.isHeadDisabled = false;
                console.log('enable head hitbox for p1');
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
            if(isAttackAnimPlaying(p1_attack_anim_list) == true && this.game.physics.arcade.overlap(player2, p1_attack_hitboxes.children) == true ){
                console.log('hit');
                player2.animations.play('hit');
            }
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
                p2_is_blocking = true;
                player2.body.velocity.x = 0;
                player2.animations.play('crouch');
                 if (player2.isHeadDisabled != true){
                    disableAllHitboxes('head', p2_hitboxes);
                    player2.isHeadDisabled = true;
                    console.log('disabled head hitbox for p2');
                }
                
            }
            else if (eButton.isDown) {
                player2.animations.play('punch');
                punching_sound.play();
                for(var i = 0; i < p2_attack_anim_list.length; i++) {
                    if (p2_attack_anim_list[i].name == 'punch') {
                        attackAnimStarted(player2, p2_attack_anim_list[i])
                    }
                }
            }
            else if (qButton.isDown) {
                player2.animations.play('kickright');
                kicking_sound.play();
                for(var i = 0; i < p2_attack_anim_list.length; i++) {
                    if (p2_attack_anim_list[i].name == 'kickright') {
                        attackAnimStarted(player2, p2_attack_anim_list[i])
                    }
                }
            }
            else if (zButton.isDown) {
                fireLaser(player2);
            }
            else {

                var p2_attack_isPlaying = isAttackAnimPlaying(p2_attack_anim_list); // checks if any attack animations are playing for p2
                p2_is_blocking = false;
                if (player2.body.onFloor() && !p2_attack_isPlaying) {
                    player2.animations.play('idle');
                }
            }

            if (!isAttackAnimPlaying(p2_defense_anim_list)) {
                if (player2.isHeadDisabled == true){
                    enableAllHitboxes('head', p2_hitboxes, p2_hitbox_locations);
                    player2.isHeadDisabled = false;
                    console.log('enable head hitbox for p2');
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
            if(htp.exists == false){
                music.stop();
                this.game.state.start('end');
            }
        }
//        else {
//            this.game.debug.text("End of Round", 200, 250, "#ffb64d", '100px ScriptoramaMarkdownJF');
//            //send to endState Winner/loser/sudden death
//        }
        
        function formatTime(s) {
            var minutes = "0" + Math.floor(s / 60);
            var seconds = "0" + (s - minutes * 60);
            return seconds.substr(-2);  
        }

       // this.game.debug.body(player1);
       // this.game.debug.body(player2);
   

//          //player 1 body hitboxes   
//         for(var i = 0; i < p1_hitboxes.children.length; i++){
          
//             this.game.debug.body(p1_hitboxes.children[i]);
//         }
//         // player 2 body hitboxes
//         for(var i = 0; i < p2_hitboxes.children.length; i++){
          
//             this.game.debug.body(p2_hitboxes.children[i]);
//         }
// //
//         // player 1 attack hitboxes
//         for(var i = 0; i < p1_attack_hitboxes.children.length; i++){
          
//            this.game.debug.body(p1_attack_hitboxes.children[i]);
//         }
//         // player2 attack hitboxes
//         for(var i = 0; i < p2_attack_hitboxes.children.length; i++){
          
//            this.game.debug.body(p2_attack_hitboxes.children[i]);
//         }
//
//        
       // this.game.debug.body(p1_lasers_hitbox);
       // this.game.debug.body(p2_lasers_hitbox);
       
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
            // console.log(hitboxGroup.parent);
            if (hitboxName == 'head') {
                x_pos += hitboxGroup.parent.x;
                y_pos += hitboxGroup.parent.y;
            }
            hitboxGroup.children[i].reset(x_pos, y_pos);
            // console.log('enabled hitbox for ' + hitboxName);
        }
    }
    // console.log('enabled hitboxes for ' + hitboxName);
}

function disableAllHitboxes(hitboxName, hitboxGroup) {     
    for(var i = 0; i < hitboxGroup.children.length; i++) {
        // console.log(hitboxGroup.children[i].name);
        if (hitboxGroup.children[i].name == hitboxName) {

            hitboxGroup.children[i].reset(0,0); // reset location of sprite to be off screen
            // hitboxGroup.children[i].alive = false;
            hitboxGroup.children[i].kill();
            // console.log('killed some child');
        }
    }
    // console.log('killed all hitboxes for ' + hitboxName);
}

function endTimer() {
    timer.stop();
}


function overlap(player_hitbox, attack_hitbox) {
    var blocking_multiplier = .25;
    if (this.game.time.now > this.invincibleTimer && (htp.exists == false)) {
            // console.log(attack_hitbox.parent.name);
            // console.log(attack_hitbox.parent.parent.name);
            // console.log(attack_hitbox.parent.parent.parent.name);
            var player_attacked = player_hitbox.parent.parent; 

            if (attack_hitbox.name == 'laser') {
                var laser = attack_hitbox.parent; // get the parent of the laser's attack hitbox, which needs to be killed
                if (laser != null) {
                    resetLaser(laser);
                    console.log('laser hit hitbox');
                }

            }
            if (player_attacked == player1 && p1_is_blocking){
                console.log('p1 blocking');
                player_attacked.health = player_attacked.health - (attack_hitbox.damage * blocking_multiplier); //chip damage for blocking
            }
            else if (player_attacked == player2 && p2_is_blocking) {
                console.log('p2 blocking');
                player_attacked.health = player_attacked.health - (attack_hitbox.damage * blocking_multiplier); //chip damage for blocking   
            }
            else{
    
                player_attacked.health = player_attacked.health - attack_hitbox.damage;
            }
            this.invincibleTimer = this.game.time.now + 500;
        //player1.animations.play('hit');
        }
    

    if (player1.health <= 0 || player2.health <= 0) {
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

function fireLaser(player) {

    if (player == player1) {
        var laser = p1_lasers.getFirstExists(false);
    }
    else {
        var laser = p2_lasers.getFirstExists(false);
    }
   
    if (laser) { 
        if (player == player1) {
            laser.reset(player.x, player.y);
            laser.addChild(p1_lasers_hitbox);
            laser.body.velocity.x = -500;
        }
        else {
            laser.reset(player.x + 100, player.y);
            laser.addChild(p2_lasers_hitbox);
            laser.body.velocity.x = 500;
        }   
//    if(laser2) {
//        laser2.reset(player.x, player.y);
//        laser2.addChild(p2_lasers_hitbox);
//        laser2.body.velocity.x = 500;
//    }
        console.log('fired laser');
        laser_sound.play();
    }
}

function resetLaser(laser) {
    laser.children[0].reset(0,0); // get the first laser's hitbox and set it to 0,0
    laser.kill();
    console.log('killed laser');
}

/*
function chipDamage(player1, player2){
    if (p1_is_blocking == true){
        p2_multiplier = .25;
    }
    else{
        p2_multiplier = 1;
    }
    if (p2_is_blocking == true){
        p1_multiplier = .25;
    }
    else{
        p1_multiplier = 1;
    }
}
*/
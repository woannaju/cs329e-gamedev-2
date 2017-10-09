title_screen= function(game){};


var screenText1;
var screenText2;
// var max_score;
title_screen.prototype = {

	init: function() {
		// max_score = score
	},

    preload: function() {
        game.load.image('dark_bg', '/assets/Dark_background.jpg');

    },

    create: function() {
        game.add.sprite(0,0,'dark_bg');

    	var style1 = { font: "48px Arial", fill: "#ffffff", align: "center" };
        var style2 = { font: "24px Arial", fill: "#ffffff", align: "center" };


    	screenText1 = game.add.text(game.world.centerX - 40, game.world.centerY, '2D Fighting Game', style1);
    	screenText1.anchor.set(0.5);
    	// screenText1.addColor('#ffff00', 16);

    	screenText2 = game.add.text(game.world.centerX - 40, game.world.centerY + 50, 'Press the LEFT and RIGHT arrow key to play!', style2);
    	screenText2.anchor.set(0.5);
    	// screenText2.addColor('#ffff00', 16);
        cursors = game.input.keyboard.createCursorKeys();


    },

    update: function() {
    	if (cursors.left.isDown && cursors.right.isDown)
        {
            // reset the game
            game.state.start("main_game")
        }
     
    }
};

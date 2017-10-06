title_screen= function(game){};


var screenText1;
var screenText2;
// var max_score;
title_screen.prototype = {

	init: function() {
		// max_score = score
	},

    create: function() {
    	var style = { font: "12px Arial", fill: "#ffffff", align: "center" };

    	screenText1 = game.add.text(game.world.centerX - 40, game.world.centerY, 'You collected all the stars! Your score is 8!', style);
    	screenText1.anchor.set(0.5);
    	// screenText1.addColor('#ffff00', 16);

    	screenText2 = game.add.text(game.world.centerX - 40, game.world.centerY + 50, 'Press the LEFT and RIGHT arrow key to play again!', style);
    	screenText2.anchor.set(0.5);
    	// screenText2.addColor('#ffff00', 16);


    },

    update: function() {
    	if (cursors.left.isDown && cursors.right.isDown)
        {
            // reset the game
            game.state.start("main_game")
        }
     
    }
};

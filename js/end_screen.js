var end_screen = function(game){
    
}

var loser;
var winner;

end_screen.prototype = {

    init: function(losing_player, winning_player) {
        loser = losing_player;
        winner = winning_player;
    },

    preload: function() {
        this.game.load.image('dark_bg', 'assets/Dark_background.jpg');

    },

    create: function() {
        this.game.add.sprite(0,0,'solid_bg');

        var style1 = { font: "48px Arial", fill: "#ffffff", align: "center" };
        var style2 = { font: "24px Arial", fill: "#ffffff", align: "center" };

        var victor_text = winner.name + ' wins!'
        var screenText1 = this.game.add.text(this.game.world.centerX, this.game.world.centerY, victor_text, style1);
        screenText1.anchor.set(0.5);
        // screenText1.addColor('#ffff00', 16);

        var screenText2 = this.game.add.text(this.game.world.centerX , this.game.world.centerY + 50, 'Press "Space" to play again!', style2);
        screenText2.anchor.set(0.5);
        // screenText2.addColor('#ffff00', 16);

        this.game.loading_music.play();
        
        var startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        startKey.onDown.addOnce(this.start, this);
    },

    start: function() {
        this.game.state.start('play', true, false);
    }
}
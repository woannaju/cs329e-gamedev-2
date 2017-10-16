var end_screen = {
    preload: function() {
        this.game.load.image('dark_bg', 'assets/Dark_background.jpg');

    },

    create: function() {
        this.game.add.sprite(0,0,'solid_bg');

        var style1 = { font: "48px Arial", fill: "#ffffff", align: "center" };
        var style2 = { font: "24px Arial", fill: "#ffffff", align: "center" };


        var screenText1 = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', style1);
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
        this.game.state.start('play');
    }
}
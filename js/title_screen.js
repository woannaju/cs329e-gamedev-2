var title_screen = {


    preload: function() {
        this.game.load.image('dark_bg', 'assets/Dark_background.jpg');

    },

    create: function() {
        this.game.add.sprite(0,0,'dark_bg');

        var style1 = { font: "48px Arial", fill: "#ffffff", align: "center" };
        var style2 = { font: "24px Arial", fill: "#ffffff", align: "center" };


        var screenText1 = this.game.add.text(this.game.world.centerX, this.game.world.centerY, '2D Fighting Game', style1);
        screenText1.anchor.set(0.5);
        // screenText1.addColor('#ffff00', 16);

        var screenText2 = this.game.add.text(this.game.world.centerX , this.game.world.centerY + 50, 'Press "S" to play!', style2);
        screenText2.anchor.set(0.5);
        // screenText2.addColor('#ffff00', 16);
        var startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

        startKey.onDown.addOnce(this.start, this);
    },

    start: function() {
        this.game.state.start('play');
    }
}


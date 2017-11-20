var htpState = {

    create: function() {
        this.game.add.sprite(0,0,"howtoplay");
        
        this.game.loading_music = this.game.add.audio('menu_music')
        this.game.loading_music.play();

        var startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        startKey.onDown.addOnce(this.start, this);

    },
    
    start: function() {
        this.game.state.start('play');
    }
}
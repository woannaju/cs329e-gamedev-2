var loadState = {

    preload: function() {
    	this.game.load.image('dojo_bg', 'assets/dojo_background.jpg');
        this.game.load.image('solid_bg', 'assets/solid_bg.jpg');
        this.game.load.image('dark_bg', 'assets/dark_background.jpg');
        this.game.load.image('boxingring', 'assets/boxingring_bg.jpeg');
        //this.game.load.spritesheet('ryu', 'assets/RyuSpriteMap125x135.png', 125, 135);
        this.game.load.spritesheet('ryu', 'assets/robot_156x316.png', 156, 316);
        //this.game.load.spritesheet('ken', 'assets/ken-sprite-sheet.png', 103, 135);
        this.game.load.spritesheet('ken', 'assets/robot_enemy_156x316.png', 156, 316);
        this.game.load.audio('boden', ['assets/audio/bodenstaendig_2000_in_rock_4bit.mp3', 'assets/audio/bodenstaendig_2000_in_rock_4bit.ogg']);
    },

    create: function()
    {
        console.log('load')
    	this.game.state.start('title_screen')
    },
};
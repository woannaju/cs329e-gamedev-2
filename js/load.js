var loadState = {

    preload: function() {
    	this.game.load.image('dojo_bg', 'assets/dojo_background.jpg');
        this.game.load.image('dark_bg', 'assets/dark_background.jpg');
        this.game.load.spritesheet('ryu', 'assets/RyuSpriteMap125x135.png', 125, 135);
        this.game.load.spritesheet('ken', 'assets/ken-sprite-sheet.png', 103, 135);
    },

    create: function()
    {
        console.log('load')
    	this.game.state.start('title_screen')
    },
};
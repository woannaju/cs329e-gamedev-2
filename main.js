var game = new Phaser.Game(1024, 525, Phaser.AUTO);

game.state.add('main_game', main_game);
game.state.add('title_screen', title_screen);
game.state.start('main_game');
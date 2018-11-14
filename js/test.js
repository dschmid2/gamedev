const bootScene = {
    key: 'boot',
    active: true,
    init: (config) => {
        console.log('[BOOT] init', config);
    },
    preload: () => {
        console.log('[BOOT] preload');
    },
    create: (config) => {
        console.log('[BOOT] create', config)
        this.game
    },
    update: () => {
        console.log('[BOOT] update');
    }
};

const gameScene = {
    key: 'game',
    active: false,
    renderToTexture: true,
    x: 64,
    y: 64,
    width: 320,
    height: 200,
    init: (config) => {
        console.log('[GAME] init', config);
    },
    preload: () => {
        console.log('[GAME] preload');
    },
    create: (config) => {
        console.log('[GAME] create', config);
    },
    update: () => {
        console.log('[GAME] update');
    }
};

const gameConfig = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ bootScene, gameScene ]
};

const game = new Phaser.Game(gameConfig);
game.scene.start('boot', { someData: '...arbitrary data' });

class SceneGame extends Phaser.Scene {
    
    //var player;
    //var platforms;
    //var cursors;
    
    constructor ()
    {
        super({key: 'SceneGame', active: true});
    }

    preload ()
    {
        this.load.image('sky', 'assets/himmel.jpg');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('uno_bkg', 'assets/uno_full.png');
        this.load.image('logo_kpt_new', 'assets/KPT_neu.png');
    
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('uno', 'assets/uno_assets_2.png');
    }

    create ()
    {
        //  A simple background for our game
        this.add.image(400, 300, 'sky').setScrollFactor(0).setScale(0.6);
    
        // configure levels for building
        var level = [ [[1, 2, 2, 2, 2, 2, 2, 2, 2, 2]] ,
                      [[2, 2, 1, 2, 2, 2, 2, 2, 2, 2]] ,
                      [[2, 2, 2, 2, 2, 1, 2, 1, 2, 2]] ,
                      [[2, 2, 2, 2, 2, 2, 2, 2, 2, 2]] ,
                      [[3, 3, 0, 1, 3 ,3, 0 ,1, 2, 2]]
            ];
            
        // construct building facade
        for (var i=0; i<5; i++) 
        {
            var map = this.make.tilemap({ data: level[i], tileWidth: 128, tileHeight: 80});
            var tiles = map.addTilesetImage('uno');
            var layer = map.createStaticLayer(0, tiles, 120, 600 - ((5-i)*90));
        }
    
        // place the logos on the roof
        this.add.image(220, 120, "logo_kpt_new").setScale(0.07);
        this.add.image(1400, 120, "logo_kpt_new").setScale(0.07);
        
        //  The platforms group contains the ground and the 2 ledges we can jump on
        let platforms = this.physics.add.staticGroup();
        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        var floor = platforms.create(400, 600, 'ground');
        floor.scaleX = 8;
        floor.refreshBody();
    
        // The player and its settings
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
    
        this.physics.world.setBounds(0, 0, 1600, 600);
        this.cameras.main.setBounds(0, 0, 1600, 600);
        
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    
        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    
        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
    
        //  Collide the player and the stars with the platforms
        this.physics.add.collider(this.player, platforms);
        
    }
    
    update ()
    {
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);
    
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);
    
            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);
    
            this.player.anims.play('turn');
        }
    
        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);
        }
    }
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [ SceneGame ]
};

var game = new Phaser.Game(config);
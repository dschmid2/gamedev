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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
var platforms;
var cursors;

function preload ()
{
    this.load.image('sky', 'assets/himmel.jpg');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('uno_bkg', 'assets/uno_full.png');
    this.load.image('logo_kpt_new', 'assets/KPT_neu.png');

    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    //  A simple background for our game
    this.add.image(400, 300, 'sky').setScrollFactor(0).setScale(0.6);

    // add the main building
    this.add.image(800, 362, "uno_bkg").setScale(0.8);
    this.add.image(220, 120, "logo_kpt_new").setScale(0.07);
    this.add.image(1400, 120, "logo_kpt_new").setScale(0.07);
    
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();
    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    var floor = platforms.create(400, 600, 'ground');
    floor.scaleX = 8;
    floor.refreshBody();

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.physics.world.setBounds(0, 0, 1600, 600);
    this.cameras.main.setBounds(0, 0, 1600, 600);
    
    this.cameras.main.startFollow(player, true, 0.09, 0.09);

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
    cursors = this.input.keyboard.createCursorKeys();

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    
}

function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

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
        this.load.image('logo_kpt_new', 'assets/KPT_neu.png');
    
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('uno', 'assets/uno_assets_2b.png');
        this.load.image('floor', 'assets/uno_floor_1.png');
    }

    create ()
    {
        //  A simple background for our game
        this.add.image(400, 300, 'sky').setScrollFactor(0).setScale(0.6);
    
        var tileX = 128;
        var tileY1 = 80;
        var tileY2 = 10;
        
        // configure levels for building
        var level = [ [[1, 2, 2, 2, 2, 2, 2, 2, 2, 2]] ,
                      [[2, 2, 1, 2, 2, 2, 2, 2, 2, 2]] ,
                      [[2, 2, 2, 2, 2, 1, 2, 1, 2, 2]] ,
                      [[2, 2, 2, 2, 2, 2, 2, 2, 2, 2]] ,
                      [[3, 3, 0, 1, 3 ,3, 0 ,1, 2, 2]]
            ];
            
        var floors = [ [1,1,1,1,1,1,1,1,1,1],
                       [1,1,0,1,1,1,0,1,1,1],
                       [1,1,0,1,1,1,0,1,1,1],
                       [1,1,0,1,1,1,0,1,1,1],
                       [1,1,0,1,1,1,0,1,1,1]
                     ];
        
        // construct building facade
        for (var i=0; i<5; i++) 
        {
            var map = this.make.tilemap({ data: level[i], tileWidth: tileX, tileHeight: tileY1});
            var tiles = map.addTilesetImage('uno');
            var layer = map.createStaticLayer(0, tiles, 120, 600 - (((tileY2/2)-i)*(tileY1+tileY2)));
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
    
        // add the levelfloors
        var floorgroup = this.physics.add.staticGroup();
        for (var y=0; y<floors.length;y++)
        {
            for (var x=0; x<floors[y].length;x++)
            {
                var posx = 120+(tileX/2)+(x*tileX);
                var posy = 600-(tileY2/2)-(((tileY2/2)-y)*(tileY1+tileY2));
                if (floors[y][x] == 1)
                {
                    floorgroup.create(posx, posy, 'floor');
                }
                else
                {
                    var darkfloor = this.add.image(posx, posy, 'floor');
                    darkfloor.setTint(0x444444);
                }
            }
        }
    
        // add the lifts
        //var lifts = this.physics.add.staticGroup();
        var lift1 = this.physics.add.sprite(120+(2*tileX)+64, 600-20, 'floor');
        lift1.setTint(0xaa0000);
        //lift1.body.velocity.y = -100;
        lift1.body.immovable = true;
        lift1.body.allowGravity = false;

        var lift2 = this.physics.add.sprite(120+(6*tileX)+64, 600-20, 'floor');
        lift2.setTint(0xaa0000);
        lift2.body.immovable = true;
        lift2.body.allowGravity = false;
        
        this.tweens.add({
            targets: [ lift1, lift2 ],
            props: {
                y: { value: 600-5-(4*90), duration: 4000 },
            },
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
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
        this.physics.add.collider(this.player, floorgroup);
        this.physics.add.collider(this.player, lift1);
        this.physics.add.collider(this.player, lift2);
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
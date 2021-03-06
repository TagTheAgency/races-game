game.PlayScreen = me.ScreenObject.extend({
    init: function() {
        //me.audio.play("theme", true);
        // lower audio volume on firefox browser
        var vol = me.device.ua.indexOf("Firefox") !== -1 ? 0.3 : 0.5;
        me.audio.setVolume(vol);
        this._super(me.ScreenObject, 'init');
    },

    onResetEvent: function() {
        me.game.reset();
        //me.audio.stop("theme");
        //if (!game.data.muted){
        //    me.audio.play("theme", true);
        //}

        me.input.bindKey(me.input.KEY.SPACE, "fly", true);
        game.data.score = 0;
        game.data.steps = 0;
        game.data.start = false;
        game.data.newHiscore = false;
        game.data.pressed = [];
        game.data.initialSeed = game.data.seed;


        this.sky = me.pool.pull('sky', 0, 0);
        me.game.world.addChild(this.sky, 0);
        this.sky1 = me.pool.pull('sky', me.game.viewport.width, 0);
        me.game.world.addChild(this.sky1, 0);

        this.bg = new BackgroundLayer('bg', 1);
        me.game.world.addChild(this.bg);


        this.bottomFence1 = me.pool.pull('fence', 0, me.game.viewport.height - 100, 4);
        this.bottomFence2 = me.pool.pull('fence', me.game.viewport.width, me.game.viewport.height - 100, 4);
        me.game.world.addChild(this.bottomFence1, 11);
        me.game.world.addChild(this.bottomFence2, 11);

        this.topFence1 = me.pool.pull('fence', 0, me.game.viewport.height / 3 - 60, 1);
        this.topFence2 = me.pool.pull('fence', me.game.viewport.width, me.game.viewport.height / 3 - 60, 1);
        me.game.world.addChild(this.topFence1, 3);
        me.game.world.addChild(this.topFence2, 3);

        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD, 11);

        this.bird = me.pool.pull("player", 60, me.game.viewport.height/2 );
        me.game.world.addChild(this.bird, 10);

        //inputs
        me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.SPACE);

        this.getReady = new me.Sprite(
            me.game.viewport.width/2,
            me.game.viewport.height/2,
            {image: 'getready'}
        );
        me.game.world.addChild(this.getReady, 11);

        var that = this;
        var fadeOut = new me.Tween(this.getReady).to({alpha: 0}, 2000)
            .easing(me.Tween.Easing.Linear.None)
            .onComplete(function() {
                game.data.start = true;
                me.game.world.addChild(new game.PipeGenerator(), 0);
                me.game.world.removeChild(that.getReady);
            }).start();
    },

    onDestroyEvent: function() {
        //me.audio.stopTrack('theme');
        // free the stored instance

        me.game.world.removeChild(this.HUD);
        me.game.world.removeChild(this.bird);
        me.game.world.removeChild(this.bg);
        this.HUD = null;
        this.bird = null;
        this.bottomFence1 = null;
        this.bottomFence2 = null;
        this.sky = null;
        this.sky1 = null;
        this.bg = null;
        me.input.unbindKey(me.input.KEY.SPACE);
        me.input.unbindPointer(me.input.pointer.LEFT);
    }
});

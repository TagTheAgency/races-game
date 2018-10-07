
/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0,
        initialSeed: 1,
        seed: 1
    },

    "random" : function() {
      var x = Math.sin(game.data.seed++) * 10000;
      return x - Math.floor(x);
    },

    // Run on page load.
    "onload" : function () {


      // Initialize the video.
      if (!me.video.init(600, 900, {wrapper : "screen", scale: "1", zoomX: 600, zoomY: 900})) {
        alert("Your browser does not support HTML5 canvas.");
        return;
      }

      // add "#debug" to the URL to enable the debug Panel
      if (me.game.HASH.debug === true) {
        window.onReady(function () {
            me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
        });
      }

      // Initialize the audio.
      me.audio.init("mp3,ogg");

      // Set a callback to run when loading is complete.
      me.loader.onload = this.loaded.bind(this);

      // Load the resources.
      me.loader.preload(game.resources);

      // Initialize melonJS and display a loading screen.
      me.state.change(me.state.LOADING);

      this.data.initialSeed = Math.random() * 1000 + 1;
      this.data.seed = Math.floor(this.data.initialSeed);



    },

    // Run on game resources loaded.
    "loaded" : function () {
        me.pool.register("player", game.Player);

        //me.state.set(me.state.MENU, new game.TitleScreen());
//        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.GAME_OVER, new game.GameOverScreen());


        // add our player entity in the entity pool
        //me.pool.register("mainPlayer", game.PlayerEntity);

        me.pool.register("clumsy", game.BirdEntity);
        me.pool.register("cabinet", game.CabinetEntity, true);
        me.pool.register("desk", game.DeskEntity, true);
        me.pool.register("horse", game.RivalEntity, true);
        //me.pool.register("hit", game.HitEntity, true);
        me.pool.register("ground", game.Ground, true);
        me.pool.register("restart_button", game.RestartButton, true);

        me.input.bindKey(me.input.KEY.SPACE, "fly", true);
        //me.input.bindKey(me.input.KEY.M, "mute", true);
        me.input.bindPointer(me.input.KEY.SPACE);

        me.save.add({"version": 0});
        if (me.save.version < 1) {
          me.save.remove('topSteps');
          me.save.remove('topPressed');
          me.save.version = 1;
        }

        // Start the game.
        me.state.change(me.state.PLAY);



    }
};

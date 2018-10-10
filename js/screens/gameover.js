game.GameOverScreen = me.ScreenObject.extend({
    init: function() {
        this.savedData = null;
        this.handler = null;
    },

    onResetEvent: function() {
        //save section

        //me.input.unbindKey(me.input.KEY.SPACE);

        this.savedData = {
            score: game.data.score,
            steps: game.data.steps
        };

        me.save.add(this.savedData);

        if (!me.save.topSteps) me.save.add({topSteps: game.data.steps});
        if (!me.save.topPressed) me.save.add({topPressed: game.data.pressed});
        if (!me.save.topSeed) me.save.add({topPressed: game.data.initialSeed});
        if (game.data.steps > me.save.topSteps) {
            me.save.topSteps = game.data.steps;
            me.save.topPressed = game.data.pressed;
            me.save.topSeed = game.data.initialSeed;
            game.data.newHiScore = true;
        }
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        me.input.bindKey(me.input.KEY.SPACE, "enter", false)
        me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER);

        this.handler = me.event.subscribe(me.event.KEYDOWN,
            function (action, keyCode, edge) {
                if (action === "enter") {
                    me.state.change(me.state.MENU);
                }
            });

/*        me.game.world.addChild(new me.Sprite(
            me.game.viewport.width/2,
            me.game.viewport.height/2 - 100,
            {image: 'gameover'}
        ), 12);*/

        var gameOverBG = new me.Sprite(
            me.game.viewport.width/2,
            me.game.viewport.height/2,
            {image: 'gameoverbg'}
        );

        me.game.world.addChild(gameOverBG, 10);

        me.game.world.addChild(new BackgroundLayer('bgstatic', 1));

        // fence
        this.fence1 = me.pool.pull('fence', 0, me.game.viewport.height - 100, 4);
        this.fence2 = me.pool.pull('fence', me.game.viewport.width,
            me.video.renderer.getHeight() - 100, 4);
        me.game.world.addChild(this.fence1, 11);
        me.game.world.addChild(this.fence2, 11);

        var self = this;

        this.dialog = new (me.Renderable.extend({
            // constructor
            init: function() {
                this._super(me.Renderable, 'init',
                    [0, 0, me.game.viewport.width/2, me.game.viewport.height/2]
                );
                this.yourScoreFont = new me.Font('gamefont', 20, 'white', 'center');
                this.scoreFont = new me.Font('gamefont', 40, 'white', 'center');
                this.highScoreFont = new me.Font('gamefont', 20, 'white', 'center');
                //this.yourScore = 'Y O U R  S C O R E';
            },

            getScaledMeasurement: function(measurement) {
              var scaledWidth = me.video.renderer.gameWidthZoom;
              return measurement / 600 * scaledWidth;
            },

            draw: function (renderer) {
              var scaledWidth = me.video.renderer.gameWidthZoom;

      	      var stepsText = this.scoreFont.measureText(renderer, game.data.steps.toFixed(2));

              var ratio = me.device.getPixelRatio();

              var x = me.game.viewport.width/2 + stepsText.width/2;
              x = this.getScaledMeasurement(x);
              x = x / ratio;

              this.scoreFont.draw(
                  renderer,
                  game.data.steps.toFixed(2),
                  420,
                  550
              );

              this.highScoreFont.draw(
                  renderer,
                  "High score: " +me.save.topSteps.toFixed(2),
                  400,
                  580
/*                  me.game.viewport.width/2 + stepsText.width,
                  me.game.viewport.height/2 + 50*/
              )


            }
        }));
        me.game.world.addChild(this.dialog, 12);

        this.restart = new me.pool.pull("restart_button",300, 650);
        me.game.world.addChild(this.restart, 14);



        var EnterCompNative = me.Renderable.extend({
            init : function (x, y, type, length) {

              var ratio = me.device.getPixelRatio();
              var scaledWidth = me.video.renderer.gameWidthZoom;

              console.log("Ratio", ratio);
              ratio = ratio * 600 / scaledWidth;
              console.log("Stretch Ratio", ratio);

              if (ratio != 1) {
                console.log("X: ", x);
                x = (x / ratio);
                console.log("X: ", x);
                y = (y / ratio);
              }

              /*this.$name = $('<input id="enterCompName" type="text" name="name"/>').css({
                "left" : x,
                "top" : y - 100
              });*/

                this.$input = $('<input type="image" id="enterCompNative" src="data/img/enter_comp_button.png">').css({
                    "left" : x,
                    "top" : y
                });



                if (ratio != 1) {
                  this.$input.css({"width": 250 / ratio, "height": 40 / ratio});
                  //$('.fb-login-button.fb_iframe_widget').css({"left": 529 / ratio, "top": 360 / ratio});
                }
                this.$input.click(self.submitResults.bind(self));

                //$('.fb-login-button.fb_iframe_widget').css({display:"block"});

                switch (type) {
                case "text":
                    this.$input
                        .attr("maxlength", length)
                        .attr("pattern", "[a-zA-Z0-9_\-]+");
                    break;
                case "number":
                    this.$input.attr("max", length);
                    break;
                }

                $(me.video.getWrapper()).append(this.$input);
                //$(me.video.getWrapper()).append(this.$name);

            },

            destroy : function () {
                this.$input.remove();
                //this.$name.remove();
                //$('.fb-login-button.fb_iframe_widget').css({display:'none'});

            }
        });


        this.enterCompNative = new EnterCompNative(180,544);
        me.game.world.addChild(this.enterCompNative, 14);

    },

    submitResults: function() {
      var self = this;

      me.input.unbindKey(me.input.KEY.ENTER);
      me.input.unbindKey(me.input.KEY.SPACE)
      me.input.unbindPointer(me.input.pointer.LEFT);
      $('#entryScreen').css({'display':'block'});

      $.getJSON('scores.json',  function( data ) {
        $('#highScoresContainer').empty();
        var items = [];
        $.each( data.scores, function( idx, datum) {
          console.log(datum);
          items.push( '<li><span class="name">' + datum.name + '</span><span class="score">' + datum.score + "</span></li>" );
        });
        $( "<ul/>", {
          "class": "scores-list",
          html: items.join( "" )
        }).appendTo( "#highScoresContainer" );
      });

      $('#closeEntry').click(self.closeEntry.bind(self));
      return false;
    },

    closeEntry: function() {
      $('#entryScreen').css({'display':'none'});
      me.input.bindKey(me.input.KEY.ENTER, "enter", true);
      me.input.bindKey(me.input.KEY.SPACE, "enter", false)
      me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER);
    },

    statusChangeCallback: function(response) {
      var self = this;
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
        self.doSubmitScores();
      } else {
        // The person is not logged into the app or we are unable to tell.
        FB.login(function(response){
          if (response.status === 'connected') {
              self.doSubmitScores();
            } else {
              alert("You need to be logged in to facebook to submit your score!");
            }
          }, {scope: 'email'});
      }
    },

    doSubmitScores: function() {
      FB.api('/me?fields=id,name,email', function(response) {
        $.ajax({
          type: "POST",
          url: wpAjaxUrl,
          data: {action: 'submit_game_score', name:response.name, email:response.email, personid: response.id, seed: me.save.topSeed, data:JSON.stringify(me.save.topPressed), score: me.save.topSteps},
          success: function(r) {
            alert('Your high score has been submitted, good luck!');
          },
          error: function() {
            alert('Sorry, there was an error submitting your score!');
          }
        });


      });
    },

    onDestroyEvent: function() {
        // unregister the event
        me.event.unsubscribe(this.handler);
        //me.input.unbindKey(me.input.KEY.ENTER);
        me.input.unbindKey(me.input.KEY.SPACE);
        //me.input.unbindPointer(me.input.pointer.LEFT);
        this.fence1 = null;
        this.fence2 = null;
        this.font = null;
        this.tweet = null;
        this.restart = null;
        this.gameOverBG = null;

        //me.audio.stop("theme");
    }
});

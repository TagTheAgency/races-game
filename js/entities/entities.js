game.BirdEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = 'clumsy';
        settings.width = 170;
        settings.height = 117;


        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.gravity = 0.2;
        this.maxAngleRotation = Number.prototype.degToRad(-30);
        this.maxAngleRotationDown = Number.prototype.degToRad(35);
        this.renderable.addAnimation("flying", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        this.renderable.addAnimation("idle", [0]);
        this.renderable.setCurrentAnimation("flying");
        //this.renderable.anchorPoint = new me.Vector2d(0.1, 0.5);
        this.body.removeShapeAt(0);
        //this.body.addShape(new me.Ellipse(5, 5, 71, 51));

        //extend a vector!
        this.body.addShape(new me.Polygon(0,0,[new me.Vector2d(-50,25),new me.Vector2d(-50,-25),new me.Vector2d(50,0)]));


        // a tween object for the flying physic effect
        this.flyTween = new me.Tween(this.pos);
        this.flyTween.easing(me.Tween.Easing.Exponential.InOut);

        this.currentAngle = 0;
        this.angleTween = new me.Tween(this);
        this.angleTween.easing(me.Tween.Easing.Exponential.InOut);

        // end animation tween
        this.endTween = null;

        // collision shape
        this.collided = false;

        this.gravityForce = 0.2;

    },

    update: function(dt) {
        //this._super(me.Entity, "update", []);
        var that = this;
        this.pos.x = 100;
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }

        this._super(me.Entity, 'update', [dt]);

        //this.renderable.currentTransform.identity();
        if (me.input.keyStatus('fly')) {
          game.data.pressed = game.data.pressed || [];
          game.data.pressed.push(Math.round(game.data.steps*100));
          this.gravityForce -= 0.5;
          //this.renderable.scale(0.99);
        } else {
          this.gravityForce += 0.2;
          //this.renderable.scale(1.001);
        }
        if (this.gravityForce < -2) {
          this.gravityForce = -2;
        }
        if (this.gravityForce > 2) {
          this.gravityForce = 2;
        }
        this.pos.y += me.timer.tick * this.gravityForce;

        var scale = 900 - this.pos.y;
        scale = scale / 500;
        //this.renderable.scale(1.1);
        me.collision.check(this);
        game.data.steps += .01;

        var hitSky = 300; // bird height + 20px
        if (this.pos.y <= hitSky || this.collided) {
            game.data.start = false;
            //me.audio.play("lose");
            this.endAnimation();
            return false;
        }


        return true;
    },

    onCollision: function(response) {
        var obj = response.b;
        if (obj.type === 'cabinet' || obj.type === 'desk' || obj.type === 'light' || obj.type === 'ground') {
            me.device.vibrate(500);
            this.collided = true;
        }
    },

    endAnimation: function() {
        me.game.viewport.fadeOut("#fff", 100);
        var currentPos = this.pos.y;
        this.endTween = new me.Tween(this.pos);
        this.endTween.easing(me.Tween.Easing.Exponential.InOut);

        this.flyTween.stop();
        this.renderable.currentTransform.identity();
        this.renderable.currentTransform.rotate(Number.prototype.degToRad(90));
        var finalPos = me.game.viewport.height - this.renderable.width/2 - 82;
        this.endTween
            .to({y: currentPos}, 1000)
            .to({y: finalPos}, 1000)
            .onComplete(function() {
                me.state.change(me.state.GAME_OVER);
            });
        this.endTween.start();
    }

});

game.DeskEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        var small = true;
        if (game.random() > 0.5) {
          small = false;
          settings.image = this.image = me.loader.getImage('desk_lrg');
          settings.width = 375;
          settings.height= 400;
          settings.framewidth = 375;
          settings.frameheight = 400;
          x = x - 80;
        } else {
          settings.image = this.image = me.loader.getImage('desk_sml');
          settings.width = 222;
          settings.height= 354;
          settings.framewidth = 222;
          settings.frameheight = 354;
          x = x - 20;
        }

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.gravity = 0;

        this.body.removeShapeAt(0);
        if (small) {
          this.body.addShapesFromJSON(me.loader.getJSON("shapesdef"), "desk-sml");
        } else {
          this.body.addShapesFromJSON(me.loader.getJSON("shapesdef"), "desk-lrg");
        }

        var minVel = -5;
        var maxVel = -15;

        var actualVel = game.data.steps / -10;
        actualVel += minVel;

        //this.body.removeShapeAt(0);
        //this.body.addShapesFromJSON(me.loader.getJSON("shapesdef"), "office_assets_kiwi_cabinet");

        this.body.vel.set(actualVel, 0);
        this.type = 'desk';
    },

    update: function(dt) {
        // mechanics
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (this.pos.x < -this.image.width) {
            me.game.world.removeChild(this);
        }
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },

});

game.CabinetEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = this.image = me.loader.getImage('cabinet');
        settings.width = 172;
        settings.height= 453;
        settings.framewidth = 172;
        settings.frameheight = 453;

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.gravity = 0;

        var minVel = -5;
        var maxVel = -15;

        var actualVel = game.data.steps / -10;
        actualVel += minVel;

        this.body.removeShapeAt(0);
        this.body.addShapesFromJSON(me.loader.getJSON("shapesdef"), "office_assets_kiwi_cabinet");

        this.body.vel.set(actualVel, 0);
        this.type = 'cabinet';
    },

    update: function(dt) {
        // mechanics
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (this.pos.x < -this.image.width) {
            me.game.world.removeChild(this);
        }
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },

});

game.RivalEntityRed = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = this.image = me.loader.getImage('rival2');
        settings.width = 170;
        settings.height= 117;

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.gravity = 0;

        var minVel = -5;
        var maxVel = -15;

        var actualVel = game.data.steps / -10;
        actualVel += minVel;

        this.body.vel.set(actualVel, 0);
        this.type = 'horse';
        //this.renderable.scale(.3);
    },

    update: function(dt) {
        // mechanics
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (this.pos.x < -100/*this.image.width*/) {
            me.game.world.removeChild(this);
        }
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },

});

game.RivalEntityPurple = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = this.image = me.loader.getImage('rival3');
        settings.width = 170;
        settings.height= 117;

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.gravity = 0;

        var minVel = -5;
        var maxVel = -15;

        var actualVel = game.data.steps / -10;
        actualVel += minVel;

        this.body.vel.set(actualVel, 0);
        this.type = 'horse';
        //this.renderable.scale(.3);
    },

    update: function(dt) {
        // mechanics
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (this.pos.x < -100/*this.image.width*/) {
            me.game.world.removeChild(this);
        }
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },

});

game.RivalEntityPink = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = this.image = me.loader.getImage('rival1');
        settings.width = 170;
        settings.height= 117;

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.gravity = 0;

        var minVel = -5;
        var maxVel = -15;

        var actualVel = game.data.steps / -10;
        actualVel += minVel;

        this.body.vel.set(actualVel, 0);
        this.type = 'horse';
        //this.renderable.scale(.3);
    },

    update: function(dt) {
        // mechanics
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (this.pos.x < -100/*this.image.width*/) {
            me.game.world.removeChild(this);
        }
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },

});

game.PipeGenerator = me.Renderable.extend({
    init: function() {
        this._super(me.Renderable, 'init', [0, me.game.viewport.width, me.game.viewport.height, 92]);
        this.alwaysUpdate = true;
        this.generate = 0;
        this.pipeFrequency = 92;
        this.pipeHoleSize = 1340;
        this.posX = me.game.viewport.width;
    },

    update: function(dt) {
        if (this.generate++ % this.pipeFrequency == 0) {
            var posY = (game.random() * 500) + 350;//Number.prototype.random(200, 400);
//                    me.video.renderer.getHeight() - 100,
//                    800
//            );
            console.log(posY);


            var rand = game.random();//Math.random();

            if (rand < 0.333) {
              var obstacle = new me.pool.pull('rival_horse_1', this.posX, posY);
            } else if (rand < 0.667){
              var obstacle = new me.pool.pull('rival_horse_2', this.posX, posY);
            } else {
              var obstacle = new me.pool.pull('rival_horse_3', this.posX, posY);
            }

//            var obstacle2 = new me.pool.pull('light', this.posX, hole);

            me.game.world.addChild(obstacle, 10);
//            me.game.world.addChild(obstacle2, 11);


        }
        this._super(me.Entity, "update", [dt]);
    },

});

game.TextInput = me.Renderable.extend({
    init : function (x, y, type, length, placeholder) {
        this.$input = $('<input type="' + type + '" required placeholder="' + placeholder + '">').css({
            "left" : x,
            "top" : y
        });

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
    },

    destroy : function () {
        this.$input.remove();
    }
});
/*
game.HitEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = this.image = me.loader.getImage('hit');
        settings.width = 148;
        settings.height= 60;
        settings.framewidth = 148;
        settings.frameheight = 60;

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.gravity = 0;
        this.updateTime = false;
        this.renderable.alpha = 0;
        this.body.accel.set(-5, 0);
        this.body.removeShapeAt(0);
        this.body.addShape(new me.Rect(0, 0, settings.width - 30, settings.height - 30));
        this.type = 'hit';
    },

    update: function(dt) {
        // mechanics
        this.pos.add(this.body.accel);
        if (this.pos.x < -this.image.width) {
            me.game.world.removeChild(this);
        }
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, "update", [dt]);
        return true;
    },

}); */

game.Ground = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = me.loader.getImage('ground');
        settings.width = 707;
        settings.height= 126;
        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.gravity = 0;
        this.body.vel.set(-4, 0);
        this.type = 'ground';
    },

    update: function(dt) {
        // mechanics
        this.pos.add(this.body.vel);
        if (this.pos.x < -this.renderable.width) {
            this.pos.x = me.video.renderer.getWidth() - 100;
        }
        me.Rect.prototype.updateBounds.apply(this);
        return this._super(me.Entity, 'update', [dt]);
    },

});

game.RestartButton = me.GUI_Object.extend({
  init: function(x, y) {
    var settings = {};
    settings.image = "try_again";
    settings.spritewidth = 62;
    settings.spriteheight = 84;
    this.floating = true;
    this._super(me.GUI_Object, "init", [x, y, settings]);
  },

  onClick: function(event) {
    console.log("Tweetybird restrt");
    me.state.change(me.state.MENU);
    return false;
  },

  onOver: function(event) {
    document.body.style.cursor = 'pointer';
  },

  onOut: function(event) {
    document.body.style.cursor = 'auto';
  }

});

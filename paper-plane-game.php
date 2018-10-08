<?php
/*
Plugin Name:  Velocity Recruitment 10th Anniversary
Plugin URI:   https://tagtheagency.com/
Description:  10th Anniversary Game
Version:      20180913
Author:       tagtheagency.com
Author URI:   https://tagtheagency.com/
License:      Commercial
*/

add_shortcode( 'velocity_game', 'insert_velocity_game' );

function insert_velocity_game() {
  /*wp_enqueue_script( 'melonjs', plugins_url( 'lib/melonjs.js', __FILE__ ), array(), '1.0.0', 'all' );
  wp_enqueue_script( 'game', plugins_url( 'js/game.js', __FILE__ ), array(), '1.0.0', 'all' );
  wp_enqueue_script( 'gameEntities', plugins_url( 'js/entities/entities.js', __FILE__ ), array(), '1.0.0', 'all' );
  wp_enqueue_script( 'gameHUD', plugins_url( 'js/entities/HUD.js', __FILE__ ), array(), '1.0.0', 'all' );
  wp_enqueue_script( 'gameTitle', plugins_url( 'js/screens/title.js', __FILE__ ), array(), '1.0.0', 'all' );
  wp_enqueue_script( 'gamePlay', plugins_url( 'js/screens/play.js', __FILE__ ), array(), '1.0.0', 'all' );
  wp_enqueue_script( 'gameGameover', plugins_url( 'js/screens/gameover.js', __FILE__ ), array(), '1.0.0', 'all' );
  wp_enqueue_script( 'gameResources', plugins_url( 'js/resources.js', __FILE__ ), array(), '1.0.0', 'all' );
  wp_enqueue_script( 'gamePlayer', plugins_url( 'js/player.js', __FILE__ ), array(), '1.0.0', 'all' );*/

  //actually need to localise the scripts, but no time, just insert them synchronously :-(

  $baseUrl = plugins_url( '', __FILE__ );
  $ajaxUrl = admin_url( 'admin-ajax.php' );
  $insert = <<<EOD

        <script type="text/javascript" src="$baseUrl/lib/melonjs.js"></script>

        <!-- Plugin(s) -->
        <script type="text/javascript" src="$baseUrl/lib/plugins/debug/debugPanel.js"></script>

        <!-- Game Scripts -->
        <script type="text/javascript" src="$baseUrl/js/game.js"></script>

        <script type="text/javascript" src="$baseUrl/js/entities/entities.js"></script>
        <script type="text/javascript" src="$baseUrl/js/entities/HUD.js"></script>

        <script type="text/javascript" src="$baseUrl/js/screens/title.js"></script>
        <script type="text/javascript" src="$baseUrl/js/screens/play.js"></script>
        <script type="text/javascript" src="$baseUrl/js/screens/gameover.js"></script>

        <script type="text/javascript" src="$baseUrl/js/player.js"></script>

        <script>
      	var ua = window.navigator.userAgent;
      	console.log(ua);
      	if (ua.indexOf('mobi') >= 0 || ua.indexOf('Mobi') >= 0) {
      		document.location.href='https://clientapps.relay.tagtheagency.com/velocity';
      	} 
      	</script>

        <script
  src="https://code.jquery.com/jquery-3.3.1.min.js"
  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  crossorigin="anonymous"></script>

    <div id="screen">
    <div class="fb-login-button" data-max-rows="1" data-size="medium" data-button-type="continue_with" data-show-faces="false" data-auto-logout-link="true" data-use-continue-as="false">
    </div>
    </div>
    <script>
    var wpAjaxUrl = '$ajaxUrl';
    window.fbAsyncInit = function() {
    FB.init({
      appId      : '237584923737179',
      cookie     : true,
      xfbml      : true,
      status     : true,
      version    : 'v3.0'
    });

    FB.AppEvents.logPageView();

  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

      velocityGameBaseUrl = '$baseUrl';
      //me.loader.setBaseURL("*", "$baseUrl/");
      me.device.onReady(function onReady() {
	  game.resources = [
    {name: "bg", type:"image", src: "$baseUrl/data/img/office_bg_2.png"},
    {name: "player", type: "image", src: "$baseUrl/data/img/plane_static.png" },
    {name: "player", type:"image", src: "$baseUrl/data/img/plane_static.png"},
    {name: "pipe", type:"image", src: "$baseUrl/data/img/pipe.png"},
    {name: "ground", type:"image", src: "$baseUrl/data/img/ground.png"},
    {name: "gameover", type:"image", src: "$baseUrl/data/img/gameover.png"},
    {name: "gameoverbg", type:"image", src: "$baseUrl/data/img/score_container_2.png"},
    {name: "hit", type:"image", src: "$baseUrl/data/img/hit.png"},
    {name: "getready", type:"image", src: "$baseUrl/data/img/getready.png"},
    {name: "grumpybird", type:"image", src: "$baseUrl/data/img/grumpybird.png"},
    {name: "light", type:"image", src: "$baseUrl/data/img/office_assets_light.png"},
    {name: "cabinet", type:"image", src: "$baseUrl/data/img/office_assets_kiwi_cabinet.png"},
    {name: "desk_sml", type:"image", src: "$baseUrl/data/img/desk-sml-2.png"},
    {name: "desk_lrg", type:"image", src: "$baseUrl/data/img/desk-lrg-2.png"},
    {name: "try_again", type: "image", src: "$baseUrl/data/img/try_again_button.png"},
    {name: "enter_comp_button", type: "image", src: "$baseUrl/data/img/enter_comp_button.png"},
    {name: "best_score_background", type: "image", src: "$baseUrl/data/img/best_score_button_container.png"},
    {name: "shapesdef", type:"json", src: "$baseUrl/data/json/kiwi_trace.json"}
];

	  game.onload();});
    </script>
    <style>
	#screen {
position:relative;
}
#enterCompNative {
  position: absolute;
}
.fb-login-button {
  position: absolute;
  left: 529px;
  top: 360px;
}
.fb-login-button.fb_iframe_widget {
  display:none;
  position: absolute;
  z-index: 300;
}
</style>
EOD;

  return $insert;
}

add_action('wp_ajax_submit_game_score', 'submit_game_score');
add_action('wp_ajax_nopriv_submit_game_score', 'submit_game_score');

function submit_game_score() {
  if(empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
    http_response_code(405);
    exit;
  }


  $url = 'https://clientapps.relay.tagtheagency.com/app/ZWaMvOqy/enter';

  if (!isset($_POST['email']) || empty($_POST['email'])) {
    $_POST['email'] = 'not_visible';
  }

  $options = array(
      'http' => array(
          'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
          'method'  => 'POST',
          'content' => http_build_query($_POST)
      )
  );
  $context  = stream_context_create($options);
  $result = file_get_contents($url, false, $context);
  if ($result === FALSE) { /* Handle error */
    http_response_code(500);
  } else {
    header('Content-Type: application/json');
    echo '{"content":"submitted"}';
  }
  die();
}

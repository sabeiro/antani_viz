<?php
function WrHeader(){
    echo '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">' . "\n";
    echo '<meta name="keywords" content="interessi" />' ."\n";
    echo '<meta name="description" content="Localizza i tuoi interessi" />' ."\n";
    echo '<meta name="author" content="Sabeiro"  />' ."\n";
    echo '<meta name="copyright" content="CC"  />' ."\n";
    echo '<meta name="language" content="IT, Italian" />' ."\n";
    echo '<meta name="classification" content=""  />' ."\n";
    echo '<meta name="refresh" content=""  />' ."\n";
    echo '<meta name="robots" content="index, follow"  />' ."\n";
    echo '<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=no; target-densityDpi=medium-dpi"/>' . "\n";
    echo '<title>Gardalì</title>' . "\n";
    echo ' <link rel="shortcut icon" href="f/favicon.ico">' . "\n";
    echo '<link rel="stylesheet" href="css/Stile.css" type="text/css">' . "\n";
    echo '<link rel="stylesheet" href="css/Menu.css" type="text/css">' . "\n";
    echo '<link rel="stylesheet" href="css/Box.css" type="text/css">' . "\n";
    echo '<link rel="stylesheet" href="css/Intestazioni.css" type="text/css">' . "\n";
    include_once("../../../lib/analyticstracking.php");
}
function Priv(){ 
    session_start(); if (!isset($_SESSION['login'])){
	header("Location: LogIn.php");
    }
}
function ColR(){
    echo '<div id="columnR"><!--  news:<br> --></div> <!-- columnR -->';
}
function ColL(){
    echo '<div id="columnL"></div> <!-- columnL -->';
}
function Intestazione(){ ?>
    <div id="cover"><div id="coverBox" class="testo1"> <p id="coverText"> caricamento... </p>
	<button type='button' onclick='hideCover();' value='chiudi'>chiudi</button>
    </div> 
    </div>
    <div class="header">
	<div id="drop-menu">
	    <ul id="menu" class="testoMenu">
		<!-- <li class="testoMenu"><a href="index.php"> -->
		<!-- 	<img src="f/Logo.png" alt="Logo"  border="0" name="Bott0" height="80" style="z-index:200;"> -->
		<!--   </a></li> -->
		<li class="testoMenu"><a href="index.php">Gardalì</a></li>
		<li class="testoMenu"><a href="#">idea</a>
		    <ul>
			<li class="testoSubHeader">
			    Viviamo nello stesso territorio e abbiamo diversi interessi che si intrecciano,<br>
			    resta solo da conoscersi e connettersi.
			</li>
		    </ul>
		</li>
		<li class="testoMenu"> <a href="Evento.php"> inserisci</a>
		    <ul>
			<li class="testoSottoMenu"><a href="Evento.php"> evento </a></li>
			<li class="testoSottoMenu"><a href="Evento.php"> attività </a></li>
			<li class="testoSottoMenu"><a href="Profilo.php"> profilo </a></li>
			<li class="testoSottoMenu"><a href="Discussione.php"> discussione </a></li>
		    </ul>
		</li>
		<li class="testoMenu"><a href="Contact.php">contatti</a></li>
		<li class="testoMenu"><a href="Blog.php">blog</a></li>
		<li class="testoMenu"><a href="Mappa.php">mappa</a></li>
		<li class="testoMenu">
		    <?php
		      session_start();
 		      if (!isset($_SESSION['login'])){
			  echo '<a href="#"> log in </a>' . "\n";
			  echo '<ul><li class="testoSubHeader"><form action="LogIn.php" method="POST" class="testoHeader">' . "\n";
			  echo 'utente:<input name="username" type="text" class="comment"><br>' . "\n";
			  echo 'password:<input  class="comment" name="password" type="password" size="20">' . "\n";
			  echo '<input  name="submit" type="submit" value="Login"></form></li></ul>' . "\n";
		      }
		      else{
			  echo '<a href="LogOut.php">' . $_SESSION['username'] . ' </a> ' .  "\n";
		      }
		      ?>
		</li>
	    </ul>
	</div> <!-- header -->
	<div id="headerSide" class="testoHeader">
	    Scegli i tuoi interessi, noi ti diciamo dove e quando.
	</div> <!-- headerSide -->
    </div> <!-- drop-menu -->
    <?php }
function Chiusura(){ ?>
    <div class="footer">
	<table class="testoFooter" align="center" width="100%"><tbody>
	    <tr><td align="left">Gardalì 05/2014</td>
		<td>
		    <iframe src="http://www.facebook.com/plugins/like.php?locale=it_IT&href=http%3A%2F%2Finventati.org%2Fkotoba%2Fgardali&layout=standard&show_faces=false&width=100&action=like&colorscheme=light" scrolling="no" frameborder="0" allowTransparency="true" style="border:none; overflow:hidden; width:100px; height:25px"></iframe>
		</td><td>
		    <g:plusone size="tall" annotation="inline" href="http://www.inventati.org/kotoba/gardali/" width="300"></g:plusone>
		</td><td>
		    <a href="http://twitter.com/share" class="twitter-share-button" data-url="http://www.inventati.org/kotoba/gardali/" data-count="horizontal" data-lang="it">Tweeter</a>
		    <script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>
		</td>
		<td align="right">
		    <a rel="license"  href="http://creativecommons.org/licenses/by-nc-sa/2.5/">
			<img src="f/CommonCreatives.png" alt="Creative Commons License" style="border-width:0"  border="0" name="Bott9">
			<!--	  src="http://i.creativecommons.org/l/by-nc-sa/2.5/88x31.png" -->
		    </a></td>
	</tbody></table>
    </div>
<?php }?>

<?php function ChiusuraNav() {?>
    <div data-role="footer" data-theme="a" data-position="fixed" data-tap-toggle="false">
        <div data-role="navbar">
            <ul>
		<li>
		    <a href="map.html" class="ui-state-persist" data-role="button" data-inline="true" data-icon="home" data-transition="flip" data-direction="reverse" >Mappa</a>
		</li>
		<li>
		    <a href="list.html" data-icon="bars" id="bars" data-transition="flip">Elenco</a>
		</li>
		<li>
		    <a href="info.html" data-icon="info" id="info" data-rel="dialog" data-transition="pop">Info</a>
		</li>
            </ul>
        </div><!-- /navbar -->
    </div>

<?php }?>

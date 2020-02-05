<?php
include("config.inc.php");
/* include("AdminSql.php"); */
$posto = "Salò";
$quando = date('d-m-Y');
$entro = 7;
$dist = 10;
$nome = "Musso";
$settore = "agricoltura";
if(isset($_GET['posto'])){  $posto = $_GET['posto'];}
if(isset($_GET['quando'])){  $quando = $_GET['quando'];}
if(isset($_GET['entro'])){  $entro = $_GET['entro'];}
if(isset($_GET['dist'])){  $dist = $_GET['dist'];}
if(isset($_GET['nome'])){$nome = $_GET['nome'];}
if(isset($_GET['settore'])){$settore = $_GET['settore'];}

// funzione per la formattazione della data
/* public function format_data($d)  { */
/*   $vet = explode("-", $d); *//*   // converte la data in timestamp *//*   //  $vet = strtotime($d); */
/*   // converte il timestamp della variabile $vet */
/*   // in data formattata */
/*   //$df = strftime('%d-%m-%Y', $vet); */
/*   return $df; */
/* } */
function ReadComm($page){
  global $db_user, $db_host, $db_password,$db_name;
   $conn = mysqli_connect($db_host, $db_user, $db_password);
   if ($conn == FALSE){
     die ("Errore nella connessione. Verificare i parametri nel file config.inc.php");
   }
   mysqli_select_db($conn,$db_name);
   $query = "SELECT comment.date, comment.author, comment.text FROM comment WHERE comment.page = '$page';";
   $result = mysqli_query($conn,$query);
   $nrows = mysqli_num_rows($result);
   if($nrows != 0){
   echo '<br><br><br><br><br><div id="commentTab"> <table border="0" align="center" cellpadding="2" cellspacing="12"  class="maintable"><thead> </thead><tbody>';
   /* echo '<tr><th colspan="3">comments so far:</tr>'; */
   echo '<tr><td width="200">data</td><td>autore</td><td width="400">testo:</td></tr>';
  while ($riga = mysqli_fetch_row($result)){
    echo "<tr>";
    echo "<td><div class=\"testo3\">" . utf8_encode($riga[0]) . "</div></td>";
    echo "<td><div class=\"testo3\">" . utf8_encode($riga[1]) . "</div></td>";
    echo "<td><div class=\"testo3\">" . utf8_encode($riga[2]) . "</div></td>";
    echo "</tr>";
  }
  echo "</table></div>";
   }
   mysqli_close($conn);
}
function WrCommSmall($page){
  global $nome;
  echo '<div id="schedaRec">' . "\n";
  echo '<h1> referenze </h1>';
  echo '  <form action="' . $page . "+" . $nome . '.php" method="post">' . "\n";
  echo '<input class="commentLarge" type="text" id="CText" name="CText" width="10">';
  echo '	      <div id="CheckComment">';
  /* echo '<input onclick="CheckComment(form)" type="button" value="comment" >'; */
  echo ' <input class="comment" type="submit" value="commenta" name="submit"> </div>';
  echo '</form>' . "\n";
  echo '</div> <!-- schedaRec -->';
}
function WrCommTable($page){
  echo '<div id="commentTab">';
  echo "\n";
  echo '  <form action="';
  echo $page;
  echo '.php" method="post">';
  echo "\n";
  echo '      <table border="0" align="center" cellpadding="2" cellspacing="12"  class="maintable">';
  echo '	<tbody>';
  echo "\n";
  echo '	  <tr><td align="right">';
  echo '	      Testo:<br><br>';
  echo '	      Autore: <input id="CAuthor" name="CAuthor" type="text" width="10"><br><br>';
  echo '	      <!-- Titolo:  <input id="CTitle" name="CTitle" width="10" /><br><br> -->';
  echo '	      <div id="CheckComment">';
  /* echo '<input onclick="CheckComment(form)" type="button" value="comment" >'; */
  echo ' <input type="submit" value="submit" name="submit"> </div>';
  echo '	    </td>';
  echo '	    <td width="200"><textarea id="CText" name="CText" cols="30" rows="10"></textarea></td>';
  echo '</tr>';
  echo '</tbody></table>';
  echo '</form>';
  echo "\n";
  //  echo '   <div class="fb-comments" data-href="http://www.inventati.org/kotoba/gardali/' . $page . '.php" data-numposts="5" data-colorscheme="light"></div>';
  echo '</div> <!-- commentTab -->';
}
function WrComment($page){
  global $db_user, $db_host, $db_password,$db_name;
  $conn = mysqli_connect($db_host, $db_user, $db_password);
  if ($conn == FALSE){
    die ("Errore nella connessione. Verificare i parametri nel file config.inc.php");
  }
  mysqli_select_db($conn,$db_name);
  $date = date("j-M-Y - g:i");
  $query = "INSERT INTO comment (date,author,text,page)
  		   VALUES
                 ('$date',";
  $query .= '\'' . mysqli_real_escape_string($_POST['CAuthor']) . ',\',';
  $query .= '\'' . mysqli_real_escape_string($_POST['CText']) . '\',';
  $query .= '$page);';
  //  echo "query:<br>$query:<br>";
  $result = mysqli_query($conn,$query);
  //  echo "$result\n";
  if (!$result){
    die('Error:  ' . mysqli_error($conn));
  }
  //  echo "one comment added";
  mysqli_close($conn);
}
function WrAttivita($dbConn){
  $query = "SELECT nome, settore FROM gi_attivita;";
  $result = $dbConn->DbQuery($query);
  echo '<select id="PSettore" name="PSettore"> ';
  while ($riga = mysqli_fetch_row($result)){
    echo '<option value="'. utf8_encode($riga[0])  . '"> ';
    echo " " . utf8_encode($riga[0]) . " ";
    echo " " . utf8_encode($riga[1]) . " ";
    echo "</option>\n";
  }
  echo '</select>';
}
function WrSettoreSelect($dbConn){
  $query = "SELECT nome FROM gi_settori;";
  $result = $dbConn->DbQuery($query);
  echo '<div id="wrapText">' . "\n";
  echo '<select id="PSettore" name="PSettore"> ';
  echo '<option value="" ></option>';
  while ($riga = mysqli_fetch_row($result)){
    echo '<option value="'. utf8_encode($riga[0])  . '"> ';
    echo " " . utf8_encode($riga[0]) . " ";
    echo " " . utf8_encode($riga[1]) . " ";
    echo "</option>\n";
  }
  echo '</select>' . "\n";
  echo '</div><!-- wrapText -->';
}
function WrUpdate($dbConn,$settore){
  $query = "SELECT nome FROM gi_eventi WHERE settore='$settore';";
  $result = $dbConn->DbQuery($query);
  $id = 0;
  $outStr = "";
  while ($row = mysqli_fetch_array($result)){
    $id = $id + 1;
    $outStr .= '<li class="testo1"><a> ' . utf8_encode($riga[0]) . ' </a></li>' . "\n";
  }
  if($id > 0){
    echo '<ul id="notBox" class="testo1">  <li> (' . $id . ') <ul>';
    echo $outStr;
    echo '</ul></li></ul>';
  }
}
function WrConfigura(){
  echo '<form name="data_eventi">' . "\n";
  echo 'da <input type="text" id="datepicker" class="data-attivita" name="quando" value="' . date('Y-m-d') . '"> a <input id="dataEntro" class="slider-attivita" type="range" onclick="timeRange(form);" name="entro" min="0" max="20" value="7"><div id="TimeRange"> 7 gg</div><br>' . "\n";
  echo 'da <input type="text" id="posto" name="posto" class="data-attivita" value="Salò"> a<input id="dist" name="dist" class="slider-attivita" type="range" onclick="lengthRange(form);" min="0" max="20" value="7"> <div id="LengthRange">10 km</div><br>' . "\n";
  echo '</form>' . "\n";
  echo '<button onclick="getLocation()">Geolocalizza</button>' . "\n";
  echo '<button onclick="drawMapAll()">mostra tutto</button>' . "\n";
}
function WrBlankIt($id,$settore){
  if($id < 1) return;
  echo '<div id="dashItem' . $id . '" class="dashItem">' . "\n";
  echo '<div id="dragBox" ondrop="drop(event)" ondragover="allowDrop(event)" onMouseOver="drawMap(' . $settore . ')" onMouseOut="">' . "\n";
  echo '<img   id="dragIt' . $id . '" dropzone="copy s:text" draggable="false" src="f/blank.png" ondragenter="inDrop(event)" ondragleave="outDrop(event)" ondragover="onDrop(event)" ondrop="drop(event)" width="100" height="100" onMouseOver="">' . "\n</div><!-- dragBox -->\n";
}
function WrSettore($dbConn){
  echo '<h1  class="balloon" title="scegli" > Settori</h1>';
  echo '<div id="wrapText"><form id="settoreForm"><fieldset id="settore" name="settore">' . "\n";
  echo '<div id="ColL">';
  $id = 0;
  $settori = array("profilo","attivita","eventi","promozioni");
  foreach($settori as &$sett){
    $tag = "liSettore" . $id;
    echo '<input type="checkbox" name="' . $tag . '" value="' . $sett . '" id="'. $tag . '" onclick="setSettoreState(\''. $sett . '\',1);" />' . $sett . '<br>' . "\n";
    $id++;
    if(($id%2)==0){
      echo '</div><!-- ColL --><div id="ColR">' . "\n";
    }
  }
  echo '</div><!-- ColR -->' . "\n";
  unset($sett);
  echo "</fieldset></form></div><!-- wrapText -->\n";
}
function WrSuggerimenti($dbConn){
  echo '<div id="suggerimentiBox">';  
  echo '<h1  class="balloon" title="prova"> Suggerimenti</h1>';
  echo '</div> <!-- suggerimentiBox -->';
}

function WrSchedaLists($dbConn){
  $settori = array("profilo","attivita","eventi","promozioni");
  echo '<div id="schedaList">';
  /* echo '<form name="selScheda" method="get" action=\''. $PHP_SELF . '\'>' . "\n"; */
  /* echo '<select  class="select-attivita" id="nome" name="nome">' . "\n"; */
  foreach($settori as &$settore){
    $dbTipo = "gi_" . $settore;
    $query = "SELECT nome, id  FROM $dbTipo;";
    $result = $dbConn->DbQuery($query);
    if(!$result) continue;
    $id = 1;
    /* echo '<optgroup label="' . $settore . '">' . "\n"; */
    echo '<h2>' . $settore . '</h2>';
    while ($row = mysqli_fetch_array($result)){
      /* echo "<option value='$row[0]'> $row[0] </option>\n"; */
      echo '<a href="javascript:void(0);" onclick="ajaxScheda(\'' . utf8_encode($row[1]) . '\',\'' . $settore . '\');ajaxSingleMap(\'' . utf8_encode($row[1]) . '\',\'' . $settore . '\');">' . utf8_encode($row[0]) . '</a>' . "\n";
  	$id = $id + 1;
    }
    /* echo "<optgroup>" . "\n"; */
  }
  /* echo "</select>" . "\n"; */
  /* echo "<button class='slider-attivita' type='button' onclick='ajaxScheda()' value='aggiorna'/>visualizza</button>" . "\n"; */
  unset($settore);
  /* echo "</form>" . "\n"; */
  echo "</div><!-- schedaList -->\n";
}
function WrScheda($dbConn){
  global $nome;
  $query = "SELECT * FROM gi_profilo WHERE nome='$nome';";
  $result = $dbConn->DbQuery($query);
  $riga = mysqli_fetch_row($result);
  echo '<div id="headerBox">';
  echo 'nome: '. utf8_encode($riga[1]) . '<br>';
  echo 'luogo: '. utf8_encode($riga[2]) . '';
  echo '</div>';
  echo '<div id="imgBox">';
  $imgScheda = $riga[5];
  if($imgScheda == ""){
    $imgScheda = "LogoFoto.svg";
  }
  echo '<img src=f/' . $imgScheda . ' width="50%">';
  echo '</div>';
  echo '<div id="descBox">settore: '. utf8_encode($riga[3]) . '<br>'; 
  echo 'contatti: '. utf8_encode($riga[4]) . '<br>';
  echo 'capacità: '. utf8_encode($riga[6]) . '<br>';
  echo 'cerca: '. utf8_encode($riga[7]) . '<br>';
  echo '</div>';
}
function ArrayProfilo($dbConn,$filtro){
  $righe = array();
  if($filtro == ""){
    $query = "SELECT nome, settore, offre, cerca, Nord, Est FROM gi_profilo;";
  }
  else{
    $query = "SELECT nome, settore, offre, cerca, Nord, Est FROM gi_profilo WHERE gi_profilo.settore='$filtro';";
  }
  $result = $dbConn->DbQuery($query, $db);
  while ($riga = mysqli_fetch_row($result)){
    $query = "SELECT gi_settori.icona FROM gi_settori WHERE gi_settori.nome = '$riga[1]';";
    $result1 = $dbConn->DbQuery($query, $db);
    $icona = mysqli_fetch_row($result1);
    array_push($riga,$icona[0]);
    array_push($righe,$riga);
  }
  echo json_encode($righe);
}
function ArrayEventi($dbConn,$filtro){
  if($filtro == ""){
    $query = "SELECT nome, settore, descrizione, Nord, Est FROM gi_eventi;";
  }
  else{
    $query = "SELECT nome, settore, descrizione, Nord, Est FROM gi_eventi WHERE gi_eventi.settore='$filtro';";
  }
  $result = $dbConn->DbQuery($query, $db);
  $righe = array();
  while ($riga = mysqli_fetch_row($result)){
    $query = "SELECT gi_settori.icona FROM gi_settori WHERE gi_settori.nome = '$riga[1]';";
    $result1 = $dbConn->DbQuery($query, $db);
    $icona = mysqli_fetch_row($result1);
    array_push($riga,$icona[0]);
    array_push($righe,$riga);
  }
  echo json_encode($righe);
}
function ArrayPromozioni($dbConn,$filtro){
  if($filtro == ""){
    $query = "SELECT nome, settore, descrizione, Nord, Est FROM gi_promozioni;";
  }
  else{
    $query = "SELECT nome, settore, descrizione, Nord, Est FROM gi_promozioni WHERE gi_promozioni.settore='$filtro';";
  }
  $result = $dbConn->DbQuery($query, $db);
  $righe = array();
  while ($riga = mysqli_fetch_row($result)){
    $query = "SELECT gi_settori.icona FROM gi_settori WHERE gi_settori.nome = '$riga[1]';";
    $result1 = $dbConn->DbQuery($query, $db);
    $icona = mysqli_fetch_row($result1);
    array_push($riga,$icona[0]);
    array_push($righe,$riga);
  }
  echo json_encode($righe);
}
function ArrayAttivita($dbConn,$filtro){
  if($filtro == ""){
    $query = "SELECT nome, settore, descrizione, Nord, Est FROM gi_attivita;";
  }
  else{
    $query = "SELECT nome, settore, descrizione, Nord, Est FROM gi_attivita WHERE gi_attivita.settore='$filtro';";
  }
  $result = $dbConn->DbQuery($query, $db);
  $righe = array();
  while ($riga = mysqli_fetch_row($result)){
    $query = "SELECT gi_settori.icona FROM gi_settori WHERE gi_settori.nome = '$riga[1]';";
    $result1 = $dbConn->DbQuery($query, $db);
    $icona = mysqli_fetch_row($result1);
    array_push($riga,$icona[0]);
    array_push($righe,$riga);
  }
  echo json_encode($righe);
}
function ArrayPic($dbConn){
    $query = "SELECT nome icona FROM gi_settori";
    $result = $dbConn->DbQuery($query, $db);
    while ($riga = mysqli_fetch_row($result)){
      array_push($righe,$riga);
    }
    echo json_encode($righe);
}
function ShowAttivita($dbConn,$col){
  $query = "SELECT icona, nome, img FROM gi_settori";
  $result = $dbConn->DbQuery($query);
  $it = 1;
  echo '<h1 class="balloon" alt="<" title="trascina qui->"> Attività</h1>';
  echo '<div id="attivitaList">';
  echo '<div id="ColL">';
  echo '<ul id="trascina" ondragstart="drag(event)">' . "\n";
  while ($row = mysqli_fetch_array($result)){
    echo '<li draggable="true" data-interesse="' . $row[1] . '" id="' . $row[2] . '" data-icona="f/' . $row[2] . '"> <img  src="f/' . $row[0]  . '"  id=arg' . $row[2] . '>' . $row[1] . '</li>' . "\n";
    $it = $it + 1;
    if($it == $col+1){
      echo '</ul>' . "\n";
      echo '</div><div id="ColR">' . "\n";
      echo '<ul id="trascina" ondragstart="drag(event)">' . "\n";
    }
    if($it > $col*2){
      break;
    }
  }
  echo '</ul></div></div><!--wrapText-->' . "\n";
}
function ShowArgomenti($dbConn){
  $query = "SELECT nome, settore, id FROM gi_arg";
  $result = $dbConn->DbQuery($query);
  $it = 1;
  echo '<div id="argList">';
  echo '<ul id="argomList" ondragstart="drag(event)">' . "\n";
  while ($row = mysqli_fetch_array($result)){
    $query = "SELECT gi_settori.icona FROM gi_settori WHERE gi_settori.nome = '$row[1]';";
    $result1 = $dbConn->DbQuery($query, $db);
    $icona = mysqli_fetch_row($result1);
    /* echo '<li  style="list-style-image:url(\'f/' . $icona[0]  . '\');"  id=arg' . $row[2] . '><a href="javascript:void(0);" onclick="ajaxArgomento(\'' . $row[2] . '\');writeCommento(\'' . $row[2] . '\');"> ' . utf8_encode($row[0]) . '</a></li>' . "\n"; */
    echo '<img  src="f/' . $icona[0]  . '"  id=arg' . $row[2] . '><a href="javascript:void(0);" onclick="ajaxArgomento(\'' . $row[2] . '\');"> ' . utf8_encode($row[0]) . '</a><br>' . "\n";
    $it = $it + 1;
  }
  echo '</ul></div><!--schedaList-->' . "\n";
}
function setInterest($id,$interest){
  $int_id = "int_" . $id;
  $_SESSION[$int_id] = $interest;
}
function getInterest($id,$interest){
  $int_id = "int_" . $id;
  return $_SESSION[$int_id];
}
?>

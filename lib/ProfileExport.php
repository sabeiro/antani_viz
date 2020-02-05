<?php
//ini_set('error_reporting', E_ALL);
//ini_set('display_errors', '1');

require_once('ProfileClass.php');

class ProfiloReader
{
    private $dbuser = "localiuser";
    private $dbpass = "locali12pass";
    private $dbname = "localidelgarda";
    
    private $conn;
    private $config;


    public function init()
    {
	// carica la configurazione dal database
	//$this->loadConfiguration();
    }

	function openDbConn()
	{
	 	$this->conn = mysqli_connect("localhost", $this->dbuser, $this->dbpass)
			or die("Connessione non riuscita: " . mysqli_error());

		$db_selected = mysqli_select_db($this->dbname, $this->conn);
		if (!$db_selected)
			die ('Can\'t use database : ' . mysqli_error());

		// imposta la codifica dei caratteri
	    mysqli_query($this->conn,"SET CHARACTER SET utf8");
	}

	function closeDbConn()
	{
		mysqli_close($this->conn);
	}


    public function loadProfilo($includeDisabled=false)
    {
	$dt = new DateTime();
	$dt->modify("+7 day");
	$endDate = $dt->format("Y-m-d");
	$today = date("Y-m-d");

	$this->openDbConn();
	$query = "SELECT  p.* , s.nome , s.img , s.icona FROM gi_profilo p LEFT JOIN gi_settori s ON s.nome=p.settore ORDER BY s.nome;";
	$result = mysqli_query($this->conn,$query);
//	$result = $dbConn->DbQuery($query, $db);
	$ev_arr = array();
	$profili = array();
	while ($riga = mysqli_fetch_row($result)){
	    $nome = $row['nome'];
	    array_push($ev_arr,$riga);
	    $profili = $this->addProfilo($profili,$row);
	}
	$this->closeDbConn();
	return $profili;
    }


    public function getProfilo($eid)
    {
	$this->openDbConn();
	$sql = "SELECT e.*, l.* FROM events e LEFT JOIN locations l ON e.locationid=l.id WHERE e.disabled<>1 AND eid = ".$eid.";";
	$res = mysqli_query($this->conn,$sql);
	$row = mysqli_fetch_assoc($res);

	$event = new FbEvent();
	$event->setData($row);

	$this->closeDbConn();

	return $event;
    }


    private function addEvent($eventArr, $data)
    {
	if(!isset($eventArr[$day]))
	    $eventArr[$day] = array();

	$event = new FbEvent();
	if($forceDate)
	{
	    $data['startTime'] = $day.substr($data['startTime'], 10);
	}
	$event->setData($data);
	$eventArr[$day][] = $event;

	return $eventArr;
    }


    // credits: http://boonedocks.net/mike/archives/137-Creating-a-Date-Range-Array-with-PHP.html
    function createDateRangeArray($strDateFrom,$strDateTo)
    {
	// takes two dates formatted as YYYY-MM-DD and creates an
	// inclusive array of the dates between the from and to dates.

	$aryRange=array();

	$iDateFrom=mktime(1,0,0,substr($strDateFrom,5,2),     substr($strDateFrom,8,2),substr($strDateFrom,0,4));
	$iDateTo=mktime(1,0,0,substr($strDateTo,5,2),     substr($strDateTo,8,2),substr($strDateTo,0,4));

	if ($iDateTo>=$iDateFrom)
	{
	    array_push($aryRange,date('Y-m-d',$iDateFrom)); // first entry
	    while ($iDateFrom<$iDateTo)
	    {
		$iDateFrom+=86400; // add 24 hours
		//$iDateFrom=strtotime("+1 day",$iDateFrom);
		array_push($aryRange,date('Y-m-d',$iDateFrom));
	    }
	}
	return $aryRange;
    }
}
?>

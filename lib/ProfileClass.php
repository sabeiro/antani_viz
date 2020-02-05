<?php
//ini_set('error_reporting', E_ALL);
//ini_set('display_errors', '1');

// =================================================================
//	PROFILO
// =================================================================

setlocale(LC_ALL, 'it_IT.UTF-8');

class ProfiloCl
{
    public $id;
    public $name;
    public $place;
    public $sector;
    public $contacts;
    public $img;
    public $offer;
    public $search;
    public $lat;
    public $lon;
    public $user;
    public $pass;
    public $tag;
    public $date;
    public $active;

    public function __construct()
    {

    }

    public function setData($data)
    {
	$this->id = $data['id'];
	$this->place = $data['nome'];
//		$this->mapTitle = (strlen($data['name'])>25 ? substr($data['name'],0,25)."..." : $data['name']);
	$this->search = html_entity_decode(substr($data['cerca'],0,170)."...");
	$this->offer = html_entity_decode(substr($data['offre'],0,170)."...");
//		$this->mapDesc = preg_replace("/\n|\r/",' ',substr($data['description'],0,100)."...");
//		$this->fullDesc = nl2br(html_entity_decode($data['description']));
	$this->img = $data['immagine'];
	$this->lat = $data['nord'];
	$this->lon = $data['est'];
	$this->user = $data['user'];
	$this->pass = $data['pass'];
	$this->tag = $data['tag'];
	$this->date = ucfirst(strftime( "%A %d %B %Y", strtotime($data['ins']) ));
	$this->active = true;
    }


    private function month2str($m)
    {
	switch($m)
	{
	case '01': return 'gen';
	case '02': return 'feb';
	case '03': return 'mar';
	case '04': return 'apr';
	case '05': return 'mag';
	case '06': return 'giu';
	case '07': return 'lug';
	case '08': return 'ago';
	case '09': return 'set';
	case '10': return 'ott';
	case '11': return 'nov';
	case '12': return 'dic';
	}
    }
}

?>
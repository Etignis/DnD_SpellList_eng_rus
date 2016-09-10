<?
if(!defined("SCANDIR_SORT_ASCENDING")) {
    define("SCANDIR_SORT_ASCENDING", 0);
}
if(!defined("SCANDIR_SORT_DESCENDING")) {
    define("SCANDIR_SORT_DESCENDING", 1);
} 

$out="-";

	$spell_folder = "../spells";// список файлов
	// список файлов
	$files = array();

	$list = scandir($spell_folder, SCANDIR_SORT_ASCENDING);
	 //print_r($list); 
	foreach($list AS $key => $txt)
		{
		$wd=explode(".", $txt);
		if($txt!="." && $txt!=".." && $wd[count($wd)-1]=='csv')
			{
			//echo $txt."<br>";
			$files[]=$txt;		
			}
		}
	$out = json_encode($files);	
	

echo $out;	
?>
<?
$spell_folder = "../spells";
$out="//--//";


	$file_name=$spell_folder."/bard.csv.json";
	
	//echo "try to open ".$file_name."<br>";
	
	$handle = fopen($file_name, "r");
	//echo "handle: ".$handle."<br>";
	$contents = fread($handle, filesize($file_name));
	// закрыть файл
	fclose($handle);
	
	//$json=json_decode($contents);
	
	//print_f($json);

?>
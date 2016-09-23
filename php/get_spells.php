<?
$spell_folder = "../spells";
$out="//--//";
if($_POST[file])
{
	$file=$_POST[file];
	$out=$file;
	
//$page_start = "<div size='A4' class='page' style='padding-left:0.2cm;'> <div class='subpage'>";
//$page_end = "</div></div>";

$p_num=9;
$out="";
$json="";
$j_out='';
$f_j=0;

$f_make_json=0;

$schools_array = array('Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Transmutation', 'Проявление', 'Призыв', 'Иллюзия', 'Некромантия', 'Ограждение', 'Очарование', 'Преобразование', 'Прорицание'); 
$school_pt = "Abjuration|Conjuration|Divination|Enchantment|Evocation|Illusion|Necromancy|Transmutation|проявление|призыв|иллюзия|некромантия|ограждение|очарование|преобразование|прорицание";


	$file_name=$spell_folder."/".$file;
	
	//echo "try to open ".$file_name."<br>";
	
	$handle = fopen($file_name, "r");
	//echo "handle: ".$handle."<br>";
	$contents = fread($handle, filesize($file_name));
	// закрыть файл
	fclose($handle);

	//print_r ($contents);

	$block = explode("\n", $contents); // \r
	$f_p_num=1;
	$cross="<div class='hide_spell' title='Скрыть'>X</div>";
	$font_size="<div class='font_sizer' title='Изменить размер текста'><span class='f_min'>-</span><span class='f_max'>+</span></div>";
	//print_r($block);
	//echo "size block: ".(sizeof($block)-1).";<br>";
	for($i=0, $n=sizeof($block)-1; $i<$n; $i++)
		{
		$block[$i] = explode(";", $block[$i]);
		
		$cond="";
		$j_cond='';
		$text=$block[$i][7];
		
		if($text[0]=="(")
			{
			$tmp = explode(")", $block[$i][7], 2);
			$cond="<b class='need'>".substr($tmp[0], 1)."</b>";
			$j_cond=substr($tmp[0], 1);
			$text=$tmp[1];
			}
		//if($block[$i][6])
		$class="class-0";
	
	// 1 wisard
	// 2 bard
	// 3 cleric
	// 4 druid
	// 5 paladin
	// 6 ranger
	// 7 warloc
	// 8 sorcerer 
		
		
		mb_internal_encoding("UTF-8");
		$cl=mb_substr($block[$i][8], 0, 3);
		if($cl=="Wis"   || $cl=="Вол")
			$class="class-1"; 
		if($cl=="Bar"     || $cl=="Бар")
			$class="class-2";
		if($cl=="Cle"   || $cl=="Жре")
			$class="class-3"; 
		if($cl=="Dru"    || $cl=="Дру")
			$class="class-4";
		if($cl=="Pal"  || $cl=="Пал")
			$class="class-5";
		if($cl=="Ran"   || $cl=="Сле")
			$class="class-6";
		if($cl=="War"   || $cl=="Кол")
			$class="class-7";
		if($cl=="Sor" || $cl=="Чар")
			$class="class-8";
		
		$language = 'en';
		if (preg_match("|[А-Яа-яЁё]|", $cl))
			$language = 'ru';
		$fl_i='';
		$out.="<div id='".$fl_i.$i."' class='cardContainer cardBlock ".$class."' data-class='".mb_strtolower($block[$i][8])."' data-level='".mb_strtolower ($block[$i][0])."' data-name='".mb_strtolower ($block[$i][1])."' data-school='".mb_strtolower ($block[$i][2])."' data-language='".$language."'>
				<div class='panel'>
					<div class='cont'>
						<h1 class='name bord'>".$block[$i][1].$cross."</h1>
							<div class='status bord'>
								<div class='w50'><b>casting time</b>".$block[$i][3]."</div>
								<div class='w50 second'><b>range</b>".$block[$i][4]."</div>
								<!--br clear='all'-->
							</div>
							<div class='status bord'>
								<div class='w50'><b>components</b>".$block[$i][5]."</div>
								<div class='w50 second small'><b>duration</b>".$block[$i][6]."</div>			
								<!--br clear='all'-->
							</div>	
						".$cond."
						<div class='text-scroll'>
							<p class='text'> ".$text.$font_size."</p>											
						</div>
					</div>    		
					<b class='class srclass'>".$block[$i][8]."</b>
					<b class='type srtype'>".$block[$i][2]."</b>
				</div>
			</div>";
		if($f_make_json==1)	
		{
		/*
		$school_field = explode(" ", $block[$i][2]);
		if($school_field[1]=='Cantrip')
			$school=$school_field[0];
		else
			$school=$school_field[2];
		*/
		$school_line=$block[$i][2];
		//$pattern = "/\([A-Za-zА-Яа-яЁё0-9-]*\)\s\(".$school_pt."\)\s\([A-Za-zА-Яа-яЁё0-9-]*\)/i";
		//$pattern = "/^\(".$school_pt."\)&/i";
		//$pattern = "/\[^\(".$school_pt."\)\]/i";
		$pattern = '/('.$school_pt.')/i';
		//$replacement="__";
		//$school=preg_replace($pattern, $replacement, $school_line);
		preg_match($pattern, $school_line, $matches);
		$school=$matches[1];
		$school=mb_strtolower($school);
		$school=ucfirst($school);
		
		$text = trim($text);
		
		if($f_j==1)
			$json.=",
";
		$json.='{
	"en": {
		"name": "'.trim($block[$i][1]).'",
		"casting time": "'.trim($block[$i][3]).'",
		"range": "'.trim($block[$i][4]).'",
		"components": "'.trim($block[$i][5]).'",
		"duration": "'.trim($block[$i][6]).'",
		"conditions": "'.trim($j_cond).'",
		"text": "'.$text.'",
		"school": "'.trim($school).'",
		"level": "'.trim($block[$i][0]).'"
	}
}';
		$f_j=1;
		}
	}
	/**/
}	

if($f_make_json==1)
	{
	$j_out="[
	".$json."
	]";

	$file_name=$spell_folder."/".$file.".json";
	$handle = fopen($file_name, "wt");
	fwrite($handle, $j_out);
	fclose($handle);
	}
echo $out;	
?>
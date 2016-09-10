<?
$spell_folder = "spells";

/*$page_start = "<div size='A4' class='page' style='padding-left:0.2cm;'>
				<div class='subpage'>";
$page_end = "</div></div>";*/

$p_num=9;
$out="";

 // список файлов
 $files = array();

if ($handle = opendir($spell_folder)) {
    
    /* Именно этот способ чтения элементов каталога является правильным. */
    while (false !== ($file = readdir($handle))) { 
       // echo "$file<br>";
		if($file!='..' && $file!='.')
			{
				$files[]=$file;				
			}
    }
    closedir($handle); 
}
//print_r($files);
$sof=sizeof($files);
for($fl_i=0; $fl_i<$sof; $fl_i++)
	{
		//echo "-- ".$fl_i." --<br>";
	// открыть файл
	$file_name=$spell_folder."/".$files[$fl_i];
	//echo "try to open ".$file_name."<br>";
	$handle = fopen($file_name, "r");
	//echo "handle: ".$handle."<br>";
	$contents = fread($handle, filesize($file_name));
	// закрыть файл
	fclose($handle);

	//echo $contents;

	$block = explode("\r", $contents);
	$f_p_num=1;
	
	$cross="<div class='hide_spell' title='Скрыть'>X</div>";
	$font_size="<div class='font_sizer' title='Изменить размер текста'><span class='f_min'>-</span><span class='f_max'>+</span></div>";
	for($i=0, $n=sizeof($block)-1; $i<$n; $i++)
		{
		$block[$i] = explode(";", $block[$i]);
		
		if($f_p_num==1)
			{
			$out.=$page_start;	
			}
		
		$cond="";
		$text=$block[$i][7];
		
		if($text[0]=="(")
			{
			$tmp = explode(")", $block[$i][7], 2);
			$cond="<b class='need'>".substr($tmp[0], 1)."</b>";
			$text=$tmp[1];
			}
		//if($block[$i][6])
		$class="class-0";
	/*
	 1 wisard
	 2 bard
	 3 cleric
	 4 druid
	 5 paladin
	 6 ranger
	 7 warloc
	 8 sorcerer 
	*/	
		//$block[$i][8] = preg_replace ("/[^a-zA-ZА-Яа-я0-9\s]/","",$block[$i][8]);
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
		
		
		$out.="<div id='".$fl_i.$i."' class='card cardBlock ".$class."' data-class='".mb_strtolower($block[$i][8])."' data-level='".mb_strtolower ($block[$i][2])."' data-name='".mb_strtolower ($block[$i][1])."' data-language='".$language."' data-school=''>
				<div class='front'>
					<div class='body'>
						<h3 class='name lined srname'>".$block[$i][1].$cross."</h3>
															<ul class='status lined'>
							<li><em>casting time</em>".$block[$i][3]."</li>
							<li class='second'><em>range</em>".$block[$i][4]."</li>
							<br clear='all'>
						</ul>
						<ul class='status lined'>
							<li><em>components</em>".$block[$i][5]."</li>
							<li class='second small'><em>duration</em>".$block[$i][6]."</li>			
							<br clear='all'>
						</ul>	
						".$cond."<p class='text'> ".$text.$font_size."</p>											
						
					</div>    		
					<b class='class'>".$block[$i][8]."</b>
					<b class='type'>".$block[$i][2]."</b>
				</div>
			</div>";
		
		if($f_p_num==$p_num)
			{
			$out.=$page_end;	
			$f_p_num=0;
			}	
		$f_p_num++;
		}
		/*if($f_p_num!=1)
			$out.="</div></div>";*/	
		//$out.="<hr>";
	}	
echo $out;	
?>

<!--div size="A4" class="page" style="padding-left:0.2cm;">
	<div class="subpage">
		
		<div id="c57cbe" class="card cardBlock class-5">
			<div class="front">
				<div class="body">
					<h3 class="name lined srname">Благословение</h3>
														<ul class="status lined">
						<li><em>casting time</em>1 действие</li>
						<li class="second"><em>range</em>30 футов</li>
						<br clear="all">
					</ul>
					<ul class="status lined">
						<li><em>components</em>В, С, М </li>
						<li class="second small"><em>duration</em>Концентрация, до 1 минуты</li>			
						<br clear="all">
					</ul>	
					<b class="need">немного святой воды</b><p class="text"> Вы благословляете до трех существ на ваш выбор в пределах дальности заклинания. Каждый раз, когда цель совершает бросок атаки или спасбросок во время действия заклинания, она может бросить d4 и добавить результат к броску атаки или спасброску. На более высоких кругах. Когда вы произносите заклинание, используя ячейку 2 круга или выше, вы можете выбрать одно дополнительное существо за каждый круг выше 1.</p>											
					
				</div>    		
				<b class="class srclass">Паладин</b>
				<b class="type srtype">1 круг очарование</b>
			</div>
		</div>        				
						
	</div>
</div-->
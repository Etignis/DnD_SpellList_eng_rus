$(window).load(function(){
	f_dbg=0;
	//console.log("/"+$(".card[data-class*='wiz']").eq(0).attr('data-level')+"/");
	//$(".p_side").hide();
	// фильтр спеллов
	function spell_filter(cl, nm, lv, sc, s_cl, s_l1, s_l2, lang){
		tmp1=0, tmp2=0;
		if(s_cl==1)
			{tmp1="wizard"; tmp2="волшебник"; console.log("1");}
		if(s_cl==2)
			{tmp1="bard"; tmp2="бард"; console.log("2");}
		if(s_cl==3)
			{tmp1="cleric"; tmp2="жрец"; console.log("3");}
		if(s_cl==4)
			{tmp1="druid"; tmp2="друид"; console.log("4");}
		if(s_cl==5)
			{tmp1="paladin"; tmp2="паладин"; console.log("5");}
		if(s_cl==6)
			{tmp1="ranger"; tmp2="следопыт"; console.log("6");}
		if(s_cl==7)
			{tmp1="warloc"; tmp2="колдун";  console.log("7");}
		if(s_cl==8)
			{tmp1="sorcerer"; tmp2="чародей"; console.log("8");}
		//console.log("tmp1: "+tmp1);
		$(".card").hide();
		var atr="";
		var atr2='';
		var f_atr2=0;
		if(cl!=undefined && cl!='')
			atr+= "[data-class*='"+cl+"']";
		else
			{
			cl=0;	
			if(tmp1!=0)
				{
				atr+= "[data-class*='"+tmp1+"']";
				atr2+= "[data-class*='"+tmp2+"']";
				f_atr2=1;
				}
			}
		if(nm!=undefined && nm!='')
		{
			atr+= "[data-name*='"+nm+"']";
			atr2+= "[data-name*='"+nm+"']";
		}
		if(lv!=undefined && lv!='')
		{
			atr+= "[data-level*='"+lv+"']";
			atr2+= "[data-level*='"+lv+"']";
		}
		else
			lv=0;
		if(sc!=undefined && sc!='')
		{
			atr+= "[data-school*='"+sc+"']";
			atr2+= "[data-school*='"+sc+"']";
		}
		if(lang=="en" || lang=='ru')
		{
			atr+= "[data-language*='"+lang+"']";
			atr2+= "[data-language*='"+lang+"']";
		}
		//console.log(atr);
		//console.log("s_cl: "+s_cl);
		
		//console.log("class: "+cl+" name: "+nm+" level: "+lv+" school: "+sc);
		console.log("atr: "+atr);
		console.log("atr2: "+atr2);
		$(".card"+atr).show();
		if(f_atr2==1)
			$(".card"+atr2).show();
			$(".card").each(function(){
				lvl = $(this).attr("data-level");
				if(lvl<s_l1)
					$(this).hide();
				if(lvl>s_l2)
					$(this).hide();
			});
	}
	function get_filter(){
		var cl=$(".f_class").val().toLowerCase();
		var nm=$(".f_name").val().toLowerCase();
		var lv=$(".f_level").val().toLowerCase();
		var sc=$(".f_school").val().toLowerCase();
		var s_cl=$(".s_sp").val().toLowerCase();
		var s_l1=$(".s_levfrom").val().toLowerCase();
		var s_l2=$(".s_levto").val().toLowerCase();
		var lang=$('.flt input[name=r_lang]:checked').attr("data-val");
		//console.log(s_cl+" "+s_l1+" "+s_l2)
		console.log("lang: "+lang);
		if(cl!='' || nm!='' || lv!='' || sc!='' || s_cl!=0 || s_l1!=0 || s_l2!=9 || lang!='r_all')
			spell_filter(cl, nm, lv, sc, s_cl, s_l1, s_l2, lang);
		else
			$(".card").show();
	}
	
	function make_spell_list(){
		var s_class='', s_name='', s_lang='', result='';
		if($('.a_h_spell').length<1)
			{
			$(".card").each(function(){
				s_class=$(this).attr("data-class");
				s_name=$(this).attr("data-name");
				//s_lang=$(this).attr("data-language");
				//result+="<a href='#' class='a_h_spell' data-class='"+s_class+"' data-name='"+s_name+"' data-lang='"+s_lang+"'>"+s_name+"</a>";
				result+="<a href='#' class='a_h_spell' data-class='"+s_class+"' data-name='"+s_name+"'>"+s_name+"</a>";
			});	
			$(".hidden_spells").append(result);
			console.log("duble num: "+$(".a_h_spell[data-class=cleric][data-name=guidance][data-lang=en]").length);
			}
	}
	
	// ввод в фильтр
	$(".flt input").live('keyup', function(){
		console.log('keyup');
		if($(this).val().length==1)
			{
			setTimeout(function(){get_filter();}, 500);
			}
		else
			get_filter();
		
	});
	$(".s_sp, .s_levfrom, .s_levto").live("change", function(){
		console.log("select changed");
		get_filter();
	});
	$("input[name=r_lang]").live("click", function(){
		console.log("radio changed");
		//alert($(this).attr("id"));
		get_filter();
	});
	
	// скрыть / показать спеллы
	$(".hide_spell").live("click", function(){
		var s_name= $(this).closest(".card").attr("data-name");
		var s_class= $(this).closest(".card").attr("data-class");
		//var s_lang= $(this).closest(".card").attr("data-language");
		
		$(this).closest(".card").hide();
		//$(".a_h_spell[data-class="+s_class+"][data-name="+s_name+"][data-lang="+s_lang+"]").css('display', 'inline-block');
		$(".a_h_spell[data-class='"+s_class+"'][data-name='"+s_name+"']").eq(0).css('display', 'inline-block');
	});
	$(".a_h_spell").live("click", function(){
		var s_name= $(this).attr("data-name");
		var s_class= $(this).attr("data-class");
		//var s_lang= $(this).attr("data-lang");
		
		$(this).hide();
		//$(".card[data-class="+s_class+"][data-name="+s_name+"][data-language="+s_lang+"]").show();
		$(".card[data-class='"+s_class+"'][data-name='"+s_name+"']").eq(0).show();
		
		return false;
	});
	
	$(".f_hide_all").live("click", function(){
		$('#dbg').fadeIn('fast', function() {
			$(".card:visible").each(function(){
				$(this).find(".hide_spell").click();
			});

			$(this).hide('fast'); // имейте в виду, не будет задержки после появления сразу начнет исчезать
			f_dbg=0;
		});		
		
	});
	$(".f_show_all").live("click", function(){
		/*$(".a_h_spell:visible").each(function(){
			$(this).click();
		});*/
		
		
		$('#dbg').fadeIn('fast', function() {
			$(".a_h_spell:visible").each(function(){
				$(this).click();
			});

			$(this).hide('fast'); // имейте в виду, не будет задержки после появления сразу начнет исчезать
			f_dbg=0;
		});
	});
	
	// размер текста
	$(".f_min").live("click", function(){
		var f_s=$(this).closest(".body").find(".text").css("font-size");
		f_s=f_s.substring(0, f_s.length - 1);
		f_s=f_s.substring(0, f_s.length - 1);
		//console.log(f_s);

		if(f_s>6)
		 f_s--;
		console.log(f_s);
	    $(this).closest(".body").find(".text").css({"font-size": f_s+"px", "line-height": f_s-1+"px"});
		
	});
	$(".f_max").live("click", function(){
		var f_s=$(this).closest(".body").find(".text").css("font-size");
		f_s=f_s.substring(0, f_s.length - 1);
		f_s=f_s.substring(0, f_s.length - 1);
		if(f_s<20)
		 f_s++;
		console.log(f_s);
	    $(this).closest(".body").find(".text").css({"font-size": f_s+"px", "line-height": f_s-1+"px"});
		
	});
	
	// ширина карточек
	
	$(".f_card_thin").live("click", function(){
		var width = $(".card").eq(0).width();
		f_dbg=1;
		//$("#dbg").show();
		//$.when($(".card").width(width-20+"px")).then(function(){$("#dbg").hide();f_dbg=0});
		
		
		$('#dbg').fadeIn('fast', function() {
			$('.card').width(width-20+"px");

			$(this).hide('fast'); // имейте в виду, не будет задержки после появления сразу начнет исчезать
			f_dbg=0;
		});
		
	});
	$(".f_card_wide").live("click", function(){
		$("#dbg").show();
		var width = $(".card").eq(0).width();
		f_dbg=1;
		//$("#dbg").show();
		//f_dbg=1;
		//$.when($("#dbg").show()).then(function(){ $.when().then(function(){ $.when($(".card").width(width+20+"px")).then(function(){$("#dbg").hide();f_dbg=0}) }); });
		//$(".card").width(width+20+"px");
		//$.when($(".card").each(function(){ $(this).width(width+20+"px"); })).then(function(){$("#dbg").hide(); f_dbg=0});
		
		$('#dbg').fadeIn('fast', function() {
			//$.when($('.card').width(width+20+"px")).then(function(){(this).hide('fast');});
			//$('.card').width(width+20+"px");
			$(".card").each(function(){ $(this).width(width+20+"px"); })
			$(this).hide('fast'); // имейте в виду, не будет задержки после появления сразу начнет исчезать
			f_dbg=0;
		});
	});
	$(".f_card_norm").live("click", function(){
		f_dbg=1;
		//$("#dbg").show();
		//var width = $(".card").eq(0).width();
		//$(".card").width("2.5in");
		//$.when($(".card").width("2.5in")).then(function(){$("#dbg").hide();f_dbg=0});
		
		$('#dbg').fadeIn('fast', function() {
			$('.card').width("2.5in");

			$(this).hide('fast'); // имейте в виду, не будет задержки после появления сразу начнет исчезать
			f_dbg=0;
		});
		
	});

	
	// запрос списка файлов
	var spell_dir = "php/class_list.php";
	data = "get_list";
	//console.log("start ajax");
	
   $.ajax(
    {
    type: "POST",
    url: spell_dir,
    data: data,
    success: function(html){
		//$(".p_cont").html(html);
		class_list = JSON.parse(html);
		// зааяксить данные из файлов.
		show_spells(class_list);
      }
    }); 
	
	function show_spells(class_list){
		// из каждого файла извлекаем спеллы
		var num1 = 0;
		var num2 = 0;
		class_list.forEach(function(item, i, arr){
				num1++;
				get_spells(item);
			});
			/*
		$.when().then(
			function(){console.log(ajaxes done!!!);}
		);
		*/
		//var timer1 = setInterval(make_spell_list, 4000);
		//var timer2 = setInterval(function(){if($(".a_h_spell").length>0){clearInterval(timer1);clearInterval(timer2);};},5000);
		make_spell_list();
		$("#before_spells").hide();	
		$(".p_side").show();
	}
	function get_spells(file){
		data="file="+file;
		$.ajax(
		{
		type: "POST",
		url: "php/get_spells.php",
		data: data,
		async: false,
		success: function(html){
			$(".p_cont").append(html);	
			console.log("OK!");
			//$(".p_side").show();
		  }
		});
	}
	// zero
	$(".n_zero").live("click", function(){
		$(this).next("input").val("");
		get_filter();
	});
	$(".s_zero").live("click", function(){
		$(this).parent().find("select").val("0");
		get_filter();
	});
	$(".level_zero").live("click", function(){
			$(".s_levfrom").val(0);
			$(".s_levto").val(9);
		get_filter();
	});
	
	// при нажатии кнопки с вопросом
	$("#info").live("click", function(){
		if($("#dbg").length<1)
		{
			$("body").append("<div id='dbg'></div>");
		}
		$("#dbg").show();
		if($(".mod_win").length<1)
		{
			$("body").append("<div class='mod_win'></div>");
		}
		$(".mod_win").show();
		
		var info="<div class='m_head'>Справка</div>"+
		"<p> По умолчанию открыты все заклинания. Для всех классов на двух языках (английский и русский).</p>"+
		"<p> Первое поле 'Класс' позволяет выбрать из списка класс, чьи заклинания будт отображаться. По умолчанию на двух языках.</p>"+
		"<p> Второе поле 'Уровень' позволяет задать диапазон отображаемых заклинаний. От первого значения (включая его), до второго (включая его тоже). </p>"+
		"<p> Остальные поля работают как фильтры. Например, если требуется найти все заклинания школы некромантии, достаточно в поле 'Школа' ввести начало названия: 'некр'. Так как заклинания этой школы есть у разных классов, то и отобразятся все заклинания этой школы независимо от класса. Если нужны заклинания определенного класа, нужно выбрать и класс. Либо в выпадающем списке, либо набрав его название в строке-фильтре.</p>"+
		"<br>"+
		"<p>Версия 0.2.1 [03.04.2016]<br>"+
		"Исправлены описания некотрых заклинаний<br>"+
		"Добавлена возможность изменять ширину карточек";
		
		$(".mod_win").html(info);
	});
	
	// убираем затемнение при нажатии на него
	$("#dbg").live("click", function(){
		if(f_dbg==0){
			$("#dbg").hide();
			$(".mod_win").hide();
		}
	});
	
	
	if($("#dbg").length<1)
	{
		$("body").append("<div id='dbg' style='display: none'></div>")
	}
}); 
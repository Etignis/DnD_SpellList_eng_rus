window.onload = function(){
	var oConfig = {}; // global app config data
	var oTimer; // for TimeOut (filtering)
	var nTimerSeconds = 200;
	function getViewPortSize(mod) {
		var viewportwidth;
		var viewportheight;

		//Standards compliant browsers (mozilla/netscape/opera/IE7)
		if (typeof window.innerWidth != 'undefined')
		{
			viewportwidth = window.innerWidth,
			viewportheight = window.innerHeight
		}

		// IE6
		else if (typeof document.documentElement != 'undefined'
		&& typeof document.documentElement.clientWidth !=
		'undefined' && document.documentElement.clientWidth != 0)
		{
			viewportwidth = document.documentElement.clientWidth,
			viewportheight = document.documentElement.clientHeight
		}

		//Older IE
		else
		{
			viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
			viewportheight = document.getElementsByTagName('body')[0].clientHeight
		}

		if(mod=="width")
			return viewportwidth;
		
		return viewportwidth + "~" + viewportheight;
	}
	
	function createSelect(src, params) {
		var options = "";
		var selected_key = params.selected_key;
		var id = params.id? "id='"+params.id+"'" : "";
		var sClass = params.controlClass? params.controlClass : "";
		var atr_class = params.class? params.class : "";
		var width = params.width? "; width: "+ params.width: "";
		var lableText;
		var min_width = 0;
		var oParams = params.params;
		var aParams = [], sParams="";
		if(oParams) {
			oParams.forEach(function(item) {
				aParams.push(item.name+"='"+item.value+"'");
			});
			sParams = aParams.join(" ");
		}
		src.forEach(function(item){
			var key = item.name;
			var text = item.title;
			if(text.length > min_width)
				min_width = text.length/2;
			options += "<li class='option' data-key='"+key+"'>"+text+"</li>"; 
			if(key == selected_key){
				lableText = text
			}
		});
		min_width = min_width>20? 20: min_width;
		min_width = min_width<5? 5: min_width;
		min_width = ~~(min_width*0.75);

		var list = "<ul class='list'>" + options + "</ul>";

		var selectedKey = selected_key; 
		var label="<div class='label "+atr_class+"' data-selected-key='" + selectedKey + "' style='min-width:"+min_width+"em "+width+"'>" + lableText + "</div>";
		var select = "<button " + id + " " + sParams + " class='customSelect "+sClass+"' style='min-width:"+min_width+"em "+width+"'>" + label + list + "</button>"

		return select;
	}	
	
	function createComboBox(src, param) {
		var ARR_DOWN = '<i class="fa fa-arrow-down"></i>';
		var ARR_UP = '<i class="fa fa-arrow-up"></i>';
		var ret = '';
		var id =  param.id? "id='"+param.id+"'": "";
		var title = param.title? param.title: "Выберите";
		var checked = param.checkAll? "checked": "";
		var isOpen = (param.isOpen!=undefined) ? param.isOpen : true;
		var arrow, display = "", content_open=true;
		var min_width = 0;
		if(isOpen && isOpen != "false"){
			arrow="<div class='combo_box_arrow'><span class='arr_down' style='display:none'>"+ARR_DOWN+"</span><span class='arr_up'>"+ARR_UP+"</span></div>";
		} else {
			arrow="<div class='combo_box_arrow'><span class='arr_down'>"+ARR_DOWN+"</span><span class='arr_up' style='display:none'>"+ARR_UP+"</span></div>";
			display = " style='display:none' ";
			content_open = false;
		}			
		for (var i =0; i < src.length; i++) {
			var type = src[i];
			var max = Math.max(type.en.length, type.ru.length)/2;
			if (max > min_width) {
				min_width = max;
			}
			ret+="<input "+checked+" type='checkbox' value='"+type.en+"' id='ch_"+type.en+"'><label for='ch_"+type.en+"' data-hierarchy='root'>"+type.en+"<br>"+type.ru+"</label>";
			
		}
		min_width = min_width>20? 20: min_width;
		min_width = min_width<5? 5: min_width;
		min_width = ~~(min_width*0.9)+2;
		ret = "<div "+id+" class='combo_box' style='min-width:"+min_width+"em' data-text='"+title+"' data-content-open='"+content_open+"'><div class='combo_box_title'>"+title+"</div><div class='combo_box_content' "+display+" >"+ret+"</div>"+arrow+"</div>";
		return ret;
	}
	
	function createInput(params){
		var id = params.id? "id='"+params.id+"'" : "";
		return "<div "+id+" class='customInput'><input type='text'><span class='cross'></span></div>";
	}
	
	function showInfoWin(sText) {
		if(!$(".mod_win").length){
			$("body").append("<div class='mod_win'>"+sText+"</div>");
		}
		$(".mod_win").fadeIn();
	}
	function hideInfoWin() {
		if($(".mod_win").length){
			$(".mod_win").fadeOut();
		}

	}
	function showDBG() {
		if(!$("#dbg").length){
			$("body").append("<div id='dbg'></div>");
		}
		$("#dbg").fadeIn();
		$("body").height();
	}
	function hideDBG() {
		if($("#dbg")){
			$("#dbg").fadeOut();		
		}		
	}
	
	function setConfig(prop, val) {
		if(prop && val != undefined) {
			oConfig[prop] = val;
		}
		localStorage.setItem("config", JSON.stringify(oConfig));
	}
	function getConfig(prop) {
		/**/
		if(prop!=undefined) {
			return localStorage.getItem("config")? JSON.parse(localStorage.getItem("config"))[prop] : null;
		}
		return JSON.parse(localStorage.getItem("config"));
		/**/
	}
		
	function createCard(spell, lang, sClass) {
		if (spell[lang] || (lang="en", spell[lang])) {
			var o = spell[lang];
			var s_name = o.name;
			var s_ritual = o.ritual? " ("+o.ritual+")" : "";
			var s_castingTime = o.castingTime;
			var s_range = o.range;
			var s_components = o.components;
			var s_duration = o.duration;
			var s_materials = o.materials;
			var s_text = o.text;
			var s_level = o.level;
			var st_castingTime, st_range, st_components, st_duration;
			switch (lang){		
				case "ru": 
					s_level = s_level>0? s_level + " круг" : "Трюк"; 
					st_castingTime = "Время накладывания";
					st_range = "Дистанция";
					st_components = "Компоненты";
					st_duration = "Длительность";
					break;	
				default: 
					s_level = s_level>0? s_level + " lvl" : "Cantrip";
					st_castingTime = "CASTING TIME";
					st_range = "RANGE";
					st_components = "COMPONENTS";
					st_duration = "DURATION";	
			}
			var s_school = o.school;
			var s_source = o.source;
			
			var sClassName = classSpells[sClass]? classSpells[sClass].title[lang] : false;;
			
			ret = '<div class="cardContainer '+sClass+'" data-level="' + spell.en.level + '" data-school="' + spell.en.school + '">'+
				'<div class="spellCard">'+
					'<div class="content">'+
						'<h1>' + s_name + s_ritual + '</h1>'+
						'<div class="row">'+
							'<div class="cell castingTime">'+
								'<b>'+st_castingTime+'</b>'+
								'<span>' + s_castingTime + '</span>'+
							'</div>'+
							'<div class="cell range">'+
								'<b>'+st_range+'</b>'+
								'<span>' + s_range + '</span>'+
							'</div>'+
						'</div>'+
						'<div class="row">'+
							'<div class="cell components">'+
								'<b>'+st_components+'</b>'+
								'<span>' + s_components + '</span>'+
							'</div>'+
							'<div class="cell duration">'+
								'<b>'+st_duration+'</b>'+
								'<span>' + s_duration + '</span>'+
							'</div>'+
						'</div>'+
						'<div class="materials">' + s_materials + '</div>'+
						'<div class="text">' + s_text + '</div>	'+	
						(sClassName? '<b class="class">' + sClassName + '</b>' : "")+
						'<b class="school">' + s_level + ", " + s_school + '</b>'+
					'</div>'+
				'</div>'+
			'</div>';
			return ret;
		} else {
			console.log("not found: ");
			console.dir(spell);
		}
	}
	
	
	function createSpellsIndex() {
		var spells = "";
		allSpells.forEach(function(item) {
			spells += createCard(item);
		});
		$(".spellContainer").html(spells);
		$("#before_spells").hide();
		$("#info_text").hide();
	}
	function showFiltered(oParams) {
		var sName = oParams.sName;
		var sClass = oParams.sClass;
		var sSubClass = oParams.sSubClass;
		var sSubSubClass = oParams.sSubSubClass;
		var nLevelStart = oParams.nLevelStart;
		var nLevelEnd = oParams.nLevelEnd;
		var aSchools = oParams.aSchools;
		var sLang = oParams.sLang;
		
		$(".spellContainer").empty();
		var spells = "";
		var filteredSpells = [];
		//console.log("#");
		//console.log("# Start filtering");
		
		//class
		var aSpells = [];
		if(sClass) {
			if(classSpells[sClass]) {
				aSpells = aSpells.concat(classSpells[sClass].spells);
				if(classSpells[sClass].subclasses && classSpells[sClass].subclasses[sSubClass]) {
					aSpells = aSpells.concat(classSpells[sClass].subclasses[sSubClass].spells);
					if(classSpells[sClass].subclasses[sSubClass].subclasses && classSpells[sClass].subclasses[sSubClass].subclasses[sSubSubClass]) {
						aSpells = aSpells.concat(classSpells[sClass].subclasses[sSubClass].subclasses[sSubSubClass].spells);
					}
				}
				aSpells.forEach(function(spellName){
					var fFind = false;
					for (var i = 0; i<allSpells.length; i++){	
						if(allSpells[i].en.name == spellName) {
							filteredSpells.push(allSpells[i]);
							fFind = true;
							break;
						}
					}
					if(!fFind){
						//console.log(spellName);
					}
				})
			}	else {
				filteredSpells = allSpells;
			} 
		} else {
			filteredSpells = allSpells;
		}
		
		// level
		/**/
		if(nLevelStart && nLevelEnd) {
			filteredSpells = filteredSpells.filter(function(spell){
				return !(spell.en.level < nLevelStart || spell.en.level > nLevelEnd);
			});
		}
		/**/
		
		
		//school		
		if(aSchools && aSchools.length>0 && aSchools.length<9) {
			filteredSpells = filteredSpells.filter(function(spell){
				for(var i = 0; i < aSchools.length; i++) {
					if(aSchools[i].toLowerCase().trim() == spell.en.school.toLowerCase().trim()) {
						return true;
					}
				}
				return false;
			});
		}
			
		// name
		if (sName) {
			sName = sName.toLowerCase().trim();
			filteredSpells = filteredSpells.filter(function(spell){
				return (spell.en.name.toLowerCase().trim().indexOf(sName)>=0 || (spell.ru && spell.ru.name.toLowerCase().trim().indexOf(sName)>=0));
			});
		}
			
		// sort
		filteredSpells.sort(function(a, b) {
			if(a[sLang] && b[sLang]) {
				if (a[sLang].level+a[sLang].name.toLowerCase().trim() < b[sLang].level+b[sLang].name.toLowerCase().trim() )
					return -1;
				if (a[sLang].level+a[sLang].name.toLowerCase().trim() > b[sLang].level+b[sLang].name.toLowerCase().trim() )
					return 1;
			}
			return 0
		});
		

		for (var i in filteredSpells) {
			if(filteredSpells[i]) {
				var tmp = createCard(filteredSpells[i], sLang, sClass)
				if (tmp)
					spells += tmp;
			} 
		}

		$(".spellContainer").html(spells);
		$("#before_spells").hide();
		$("#info_text").hide();
	}
	
	function filterSpells(){
		var sName = $("#NameInput input").val();
		var sClass = $("#ClassSelect .label").attr("data-selected-key");
		var sSubClass = $("#SubClassSelect .label").attr("data-selected-key");
		var sSubSubClass = $("#SubSubClassSelect .label").attr("data-selected-key");
		var nLevelStart = $("#LevelStart .label").attr("data-selected-key");
		var nLevelEnd = $("#LevelEnd .label").attr("data-selected-key");
		var aSchools = $("#SchoolCombobox .combo_box_title").attr("data-val");
			if(aSchools) aSchools = aSchools.split(",").map(function(item){return item.trim()});
		var sLang = $("#LangSelect .label").attr("data-selected-key");
		
		setConfig("language", sLang);
		//setConfig("schoolOpen", $("#SchoolCombobox").attr("data-content-open"));
		clearTimeout(oTimer);
		oTimer = setTimeout(function(){
			showFiltered({
				sName: sName, 
				sClass: sClass, 
				sSubClass: sSubClass, 
				sSubSubClass: sSubSubClass, 
				nLevelStart: nLevelStart, 
				nLevelEnd: nLevelEnd, 
				aSchools: aSchools, 
				sLang: sLang
				});
		}, nTimerSeconds/2);		
		
	}
	
	function createButtons() {
		var bHome = "<a href='/' class='bt'><i class='fa fa-home'></i></a>";
		var bInfo = "<a href='/' class='bt' id='bInfo'><i class='fa fa-question-circle'></i></a>";
		$(".p_side").append("<div class='mediaWidth'>" + bHome + bInfo + "</div>");		
	}
	
	function createLabel(text) {
		return "<div class='filterLabel'>"+text+"</div>";
	}
	function createClassSelect() {
		var src = [{
			name: "[ALL]",
			title: "[ВСЕ]"
		}];
		for (var i in classSpells){
			src.push(
			{
				name: classSpells[i].title.en,
				title: classSpells[i].title.en+"<br>"+classSpells[i].title.ru
			}
			);
		}
		var classSelect = createSelect(src, {id: "ClassSelect", selected_key: "[ALL]", width: "100%"});
		var label = createLabel("Класс");
		
		$(".p_side").append("<div class='mediaWidth'>" + label + classSelect + "</div>");		
	}
	function createSubClassSelect(sClass) {
		$("#SubSubClassSelect").remove();
		var src = [{
			name: "[NONE]",
		    title: "[ПОДКЛАСС]"
		}];
		for (var i in classSpells[sClass].subclasses){
			src.push(
			{
				name: i,
				title: classSpells[sClass].subclasses[i].title.en+"<br>"+classSpells[sClass].subclasses[i].title.ru
			}
			);
		}
		var classSelect = createSelect(src, {id: "SubClassSelect", selected_key: "[NONE]", width: "100%"});
		var label = createLabel("Класс");
		
		var index = 1;
		if($("#SubClassSelect").length>0) {
			index = $("button").index($("#SubClassSelect"));
			$("#SubClassSelect").remove();
		}
		
		if(src.length>1) {
			$("#ClassSelect").parent().find("button").eq(index-1).after(classSelect);
			//$("#ClassSelect").parent().append(classSelect);
		}
		
		//$(".p_side").append("<div class='mediaWidth'>" + classSelect + "</div>");		
	}
	function createSubSubClassSelect(sClass, sSubClass) {
		var src = [{
			name: "[NONE]",
		    title: "[ПОДПОДКЛАСС]"
		}];
		for (var i in classSpells[sClass].subclasses[sSubClass].subclasses){
			src.push(
			{
				name: i,
				title: classSpells[sClass].subclasses[sSubClass].subclasses[i].title.en+"<br>"+classSpells[sClass].subclasses[sSubClass].subclasses[i].title.ru
			}
			);
		}
		var classSelect = createSelect(src, {id: "SubSubClassSelect", selected_key: "[NONE]", width: "100%"});
		var label = createLabel("Класс");
		//src[0].title= "[Полкласс]";
		
		var index = 1;
		if($("#SubSubClassSelect").length>0) {
			index = $("button").index($("#SubSubClassSelect"));
			$("#SubSubClassSelect").remove();
		} else {
			index = $("button").index($("#SubClassSelect"));
		}
		
		if(src.length>1) {
			$("#SubClassSelect").after(classSelect);
			//$("#ClassSelect").parent().append(classSelect);
		}
		//$(".p_side").append("<div class='mediaWidth'>" + classSelect + "</div>");		
	}
	function createLevelSelect() {
		var src = [];
		for (var i=0; i<10; i++) {
			src.push(
				{
					name: i,
					title: i
				}
			);
		}
		var s1 = createSelect(src, {id: "LevelStart", selected_key: 0, width: "100%"});
		var s2 = createSelect(src, {id: "LevelEnd", selected_key: 9, width: "100%"});
		var str = "<div class='row'><div class='cell'>"+s1+"</div><div class='cell'>"+s2+"</div></div>";
		var label = createLabel("Уровень с/по");
		$(".p_side").append("<div class='mediaWidth'>" + label + str + "</div>");	
	}
	function createSchoolCombobox(isOpen) {	
		if(isOpen == undefined)
			isOpen = false;
		var s1=createComboBox(schoolList, {id: "SchoolCombobox", title: "Школы", checkAll: true, isOpen: isOpen});
		$(".p_side").append("<div class='mediaWidth'>" + s1 + "</div>");
	}
	function createNameFilter() {
		var ret=createInput({id: "NameInput"});
		var label = createLabel("Название");
		$(".p_side").append("<div class='mediaWidth'>" + label + ret + "</div>");		
	}
	function createLangSelect(lang) {
		var src = [
			{
				name: "en",
				title: "English"
			},
			{
				name: "ru",
				title: "Русский"
			}
		];
		if(!lang)
			lang = "ru";
		var classSelect = createSelect(src, {id: "LangSelect", selected_key: lang, width: "100%"});
		var label = createLabel("Язык");
		$(".p_side").append("<div class='mediaWidth'>" + label + classSelect + "</div>");	
	}
	
	function createSidebar() {
		var lang = getConfig("language");
		var schoolOpen = getConfig("schoolOpen");
		createButtons();
		createNameFilter();
		createClassSelect();
		createLevelSelect();
		createSchoolCombobox(schoolOpen);
		createLangSelect(lang);
		
		$(".p_side").fadeIn();	
	}
	

	/// handlers
	
	// hide DBG
	$("body").on("click", "#dbg", function() {
		$(this).fadeOut();
		hideInfoWin();
	});
	
	//custom Select
	$("body").on("click", ".customSelect .label", function() {
	  if($(this).next(".list").css('display') == 'none') {
		$(this).parent().focus();		
	  }
	  $(this).next(".list").fadeToggle();
	});
	$("body").on("focusout", ".customSelect", function() {	  
	  $(this).find(".list").fadeOut();
	});
	$("body").on("click", ".customSelect .option", function() {
	  var key = $(this).attr("data-key");
	  var text = $(this).html().replace("<br>", " | ");
	  $(this).closest(".customSelect").find(".label").attr("data-selected-key", key).text(text);
	  $(this).parent("ul").fadeOut();
	  $(this).closest(".customSelect").focusout();
	  $(this).closest(".customSelect").blur();
	  //$("#toFocus").focus();	  
	});
	
	// custom Combobox
	$("body").on('click', ".combo_box_title, .combo_box_arrow", function(){
		var el = $(this).closest(".combo_box").find(".combo_box_content");
		if(el.is(":visible"))
		{
			el.slideUp();
			el.next(".combo_box_arrow").find(".arr_down").show();
			el.next(".combo_box_arrow").find(".arr_up").hide();
			el.parent().attr("data-content-open", false);
		}
		else
		{
			el.slideDown();
			el.next(".combo_box_arrow").find(".arr_down").hide();
			el.next(".combo_box_arrow").find(".arr_up").show();
			el.parent().attr("data-content-open", true);
		}
	});// get item
	function onSelectItemPress(src) {
	var d_root='', d_parent='', trig=true;
	
	var attrFor = src.attr("for"); // $("input#"+attrFor)
	d_root = $("input#"+attrFor).attr("data-root");
	d_parent = $("input#"+attrFor).attr("data-parent");
	if($("input#"+attrFor).prop("checked"))
		{
		trig=false;
		}
	$("input#"+attrFor).prop("checked", trig);
	/**/
	if(d_root!='' && d_root!=undefined)
	{
		$("input[type=checkbox][data-parent="+d_root+"]").each(function(){
			$(this).prop( "checked", trig );
		});
	}
	/**/
	if(d_parent!='' && d_parent!=undefined && trig==false)
	{
		$("input[type=checkbox][data-root="+d_parent+"]").prop( "checked", trig);

	}
	/**/
	/**/
	if($("input[type=checkbox]:checked").length<1)
		{
		$("#go").attr("disabled", "disabled");
		}
	else
		{
		$("#go").removeAttr("disabled");
		}
	/**/

	function make_val(ex, ad, dp){
		var ret = '';
		if(dp!=undefined) {
			ad = dp + " " + ad;
		}
		if(ex!=undefined && ex!=""){
			ret = ex+", "+ad;
		} else {
			ret = ad;
		}
		return ret;
	}

	/**/
	var d_root='';
	var before_root='';
	var d_parent='';
	var txt='';
	var value='';
	var title=''
	$(".combo_box_title").html("");
	$(".combo_box_title").attr('data-val',"");
	$("input[type=checkbox]:checked").each(function(){
		d_root='';
		d_parent='';
		d_parent=$(this).attr("data-parent");
		d_root=$(this).attr("data-root");

		title=$(".combo_box_title").html();
		value=$(".combo_box_title").attr('data-val');

		if(title!="" && title.charAt(title.length-1)!="(") {
			$(".combo_box_title").append(", ");
		}
		// обычный пункт
		if(d_parent==undefined && d_root==undefined)
			{
			txt = $(this).next("label").html().replace("<br>", " | ");
			title_value = $(".combo_box_title").attr("data-val");
			value = $(this).attr('value');
			dp = $(this).attr('data-parent');
			value = make_val(title_value, value, dp);
			//$(".combo_box_title").append(txt).attr("data-val", value);
			$(".combo_box_title").attr("data-val", value);
			}
		// если root
		if(d_root!=undefined)
			{
				// если есть отмеченные потомки
			if($("input[type=checkbox][data-parent="+d_root+"]:checked").length>0)
				{
				txt=$(this).next("label").text()+" (";
				//$(".combo_box_title").append(txt);

				before_root=d_root;
				}
			}
		// если parent
		if(d_parent!=undefined)
			{

				txt=$(this).next("label").text();
				title_value = $(".combo_box_title").attr("data-val");
				value = $(this).attr('value');
				dp = $(this).attr('data-parent');
				value = make_val(title_value, value, dp);
				var ind = $("input[type=checkbox][data-parent="+d_parent+"").index(this);
				if(ind==$("input[type=checkbox][data-parent="+d_parent+"").length-1 && d_parent==before_root){
					txt+=")";
				}

				$(".combo_box_title").append(txt).attr("data-val", value);
			}
		});

		if($(".combo_box_title").html()=='')
			$(".combo_box_title").html(src.closest(".combo_box").attr('data-text'));


	var bg = $("#selector").find("input:checked + label[data-bg] ").attr("data-bg");
	var leng = $("#selector").find("input:checked + label[data-bg] ").length;
	$("#selector").find("input:checked + label[data-bg] ").each(function(){
		if ($(this).attr("data-bg") != bg){
			leng = 0;
		}
	});
	if(bg && leng>0) {
		$("body").attr("class", bg);
	} else {
		$("body").attr("class", "");
	}
		
	// bg /
	return false;
}

	$("body").on('click', ".combo_box input", function(event){
		return false;
	});

	$("body").on('click', ".combo_box label", function(){
		onSelectItemPress($(this));
		return false;
	});
	
	// custom Input
	$("body").on('click', ".customInput .cross", function(){
		$(this).parent().find("input").val("");
		$(this).parent().focusout();
	});
	
	// filters
	
	// name select
	$("body").on('focusout', "#NameInput", function(){
		clearTimeout(oTimer);
		oTimer = setTimeout(function(){
			filterSpells();
		}, nTimerSeconds);		
	});
	$("body").on('keyup', "#NameInput input", function(){
		clearTimeout(oTimer);
		oTimer = setTimeout(function(){
			filterSpells();
		}, nTimerSeconds*3);		
	});
	// class select
	$("body").on('focusout', "#ClassSelect", function(){
		clearTimeout(oTimer);
		oTimer = setTimeout(function(){
			filterSpells();
			var sClass = $("#ClassSelect .label").attr("data-selected-key");
			createSubClassSelect(sClass);
		}, nTimerSeconds);		
	});
	// sub class select
	$("body").on('focusout', "#SubClassSelect", function(){
		clearTimeout(oTimer);
		
		oTimer = setTimeout(function(){
			filterSpells();
			var sClass = $("#ClassSelect .label").attr("data-selected-key");
			var sSubClass = $("#SubClassSelect .label").attr("data-selected-key");
			createSubSubClassSelect(sClass, sSubClass);
		}, nTimerSeconds);		
	});
	// sub sub class select
	$("body").on('focusout', "#SubSubClassSelect", function(){
		clearTimeout(oTimer);
		
		oTimer = setTimeout(function(){
			filterSpells();			
		}, nTimerSeconds);		
	});
	
	// level select
	$("body").on('focusout', "#LevelStart", function(){
		clearTimeout(oTimer);
		oTimer = setTimeout(function(){
			filterSpells();
		}, nTimerSeconds);		
	});
	$("body").on('focusout', "#LevelEnd", function(){
		clearTimeout(oTimer);
		oTimer = setTimeout(function(){
			filterSpells();
		}, nTimerSeconds);		
	});
	// school combobox
	$("body").on('click', "#SchoolCombobox label", function(){
		clearTimeout(oTimer);
		oTimer = setTimeout(function(){
			filterSpells();
		}, nTimerSeconds);		
	});
	$("body").on('click', "#SchoolCombobox .combo_box_title, #SchoolCombobox .combo_box_arrow", function(){
		setConfig("schoolOpen", $("#SchoolCombobox").attr("data-content-open"));	
	});
	
	// lang select
	$("body").on('focusout', "#LangSelect", function(){
		clearTimeout(oTimer);
		oTimer = setTimeout(function(){
			filterSpells();
		}, nTimerSeconds);		
	});
	
	// show all spells
	$("body").on('click', "#showAllSpells", function(){
		filterSpells();	
		hideInfoWin();
		hideDBG();
		return false;
	});
	
	//info_textbInfo
	$("body").on('click', "#bInfo", function(){
		var sInfo = $("#info_text").html();
		showDBG();
		showInfoWin(sInfo);
		return false;
	});
	
	//createSpellsIndex();	
	
	$.when(createSidebar()).done(
		function(){
			if(getViewPortSize("width") > 600)
				filterSpells()
		}
	);
}; 
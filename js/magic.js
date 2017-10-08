var TENTACULUS_APP_VERSION = "2.2.4";

var oConfig = {}; // global app config data
function setConfig(prop, val) {
	if(prop && val != undefined && oConfig) {
		oConfig[prop] = val;
		localStorage.setItem("config", JSON.stringify(oConfig));
	}
}
function getConfig(prop) {
	oConfig = JSON.parse(localStorage.getItem("config")) || {};
	if(prop!=undefined) {
		return localStorage.getItem("config")? oConfig[prop] : null;
	}
	return oConfig;
}

window.onload = function(){
	var fCtrlIsPressed = false;

	var oTimer; // for TimeOut (filtering)
	var nTimerSeconds = 100;

	var aHiddenSpells = [];
	var aLockedSpells = {};
	var filteredSpells = [];

	var oSource = {};

	function arrDiff(arr1, arr2) {
		var arr3 = arr2.map(function(item){return item.en});
		return arr1.filter(
			function(item){
				return (arr3.indexOf(item.en.name)>=0)? false: true;
			}
		);
	}

	function removeFromArr(arr, el) {
		var index;

		for (var i=0; i<arr.length; i++) {
			if(arr[i] == el) {
				index = i;
				break;
			}
		}
		arr.splice(i, 1);
		return arr
	}

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
		var label="<div class='label "+atr_class+"' data-selected-key='" + selectedKey + "' "+width+"'>" + lableText + "</div>";
		var select = "<button " + id + " " + sParams + " class='customSelect "+sClass+"' "+width+"'>" + label + list + "</button>"

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

			var sOptionValue = type.key? type.key : type.en;

			ret+="<input "+checked+" type='checkbox' value='"+sOptionValue+"' id='ch_"+sOptionValue+"'><label for='ch_"+sOptionValue+"' data-hierarchy='root'>"+type.en+"<br>"+type.ru+"</label>";

		}
		min_width = min_width>20? 20: min_width;
		min_width = min_width<5? 5: min_width;
		min_width = ~~(min_width*0.9)+2;
		ret = "<div "+id+" class='combo_box' data-text='"+title+"' data-content-open='"+content_open+"'><div class='combo_box_title'>"+title+"</div><div class='combo_box_content' "+display+" >"+ret+"</div>"+arrow+"</div>";
		return ret;
	}

	function createInput(params){
		var id = params.id? "id='"+params.id+"'" : "";
		return "<div "+id+" class='customInput'><input type='text'><span class='cross'></span></div>";
	}

	function showInfoWin(sText) {
		if(!$(".mod_win_wrapper").length){
			var bCross = "<span class='bCloseInfoWin'>×</span>";
			$("body").append("<div class='mod_win_wrapper'><div class='mod_win'>"+bCross+sText+"</div></div>");
		}
		$(".mod_win_wrapper").fadeIn();
	}
	function hideInfoWin() {
		if($(".mod_win_wrapper").length){
			$(".mod_win_wrapper").fadeOut();
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

	function pretifyString(s) {
		return s.substr(0,1).toUpperCase() + s.substr(1);
	}

	function createCard(spell, lang, sClass, sLockedSpell) {
		if (spell[lang] || (lang="en", spell[lang])) {
			var o = spell[lang];
			var s_name = o.name;
			var s_ritual = o.ritual? " ("+o.ritual+")" : "";
			var s_castingTime = o.castingTime;
			var s_range = pretifyString(o.range);
			var s_components = o.components;
			var s_duration = pretifyString(o.duration.replace(/концентрация/ig, "конц-я"));
			var s_materials = o.materials;
			var s_text = o.text;
			var s_level = o.level;
			var s_source = o.source? o.source : spell.en.source? spell.en.source: "";
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
			var sNeedHelp = (spell.ru && spell.ru.needHelp)? "Как лучше перевести?" : "";

			var sClassName = classSpells[sClass]? classSpells[sClass].title[lang] : false;
			var bHideSpell = '<span class="bHideSpell" title="Скрыть заклинание (будет внизу панели фильтров)"><i class="fa fa-eye-slash" aria-hidden="true"></i></span>';
			var bLockSpell = sLockedSpell? '<span class="bUnlockSpell" title="Открепить обратно"><i class="fa fa-unlock-alt" aria-hidden="true"></i></span>' : '<span class="bLockSpell" title="Закорепить заклинане (не будут действовать фильтры)"><i class="fa fa-lock" aria-hidden="true"></i></span>';

			sLockedSpell = sLockedSpell? " lockedSpell " : "";

			var sNameRu;
			try{
				spell.ru.name.length;
				sNameRu  = spell.ru.name;
			} catch (err) {
				console.log("!: "+spell.en.name);
				sNameRu = spell.en.name;
			}

			var title = spell.en.name;
			if (lang=='en') {
				title = (spell.ru && spell.ru.name)?spell.ru.name: spell.en.name;
			}

			var textSizeButtons = "<div class='sizeButtonsContainer noprint'><a href='#' class='textMin' title='Уменьшить размер текста'>–</a><a href='#' class='textMax' title='Увеличить размер текста'>+</a></div>";

			var cardWidth = getConfig("cardWidth");
			var style = "";
			if(cardWidth) {
				var style = " style='width: " + cardWidth + "' ";
			}

			ret = '<div class="cardContainer '+sClass+ sLockedSpell +'" '+ style +' data-level="' + spell.en.level + '" data-school="' + spell.en.school + '" data-name="' + spell.en.name + '" data-name-ru="' + sNameRu + '" data-lang="' + lang + '" data-class="' + sClass + '">'+
				'<div class="spellCard">'+
					'<div class="content">'+
						bLockSpell +
						bHideSpell +
						'<h1 title="'+title+(sNeedHelp?" ("+sNeedHelp+")":"")+'">' + s_name + s_ritual + '</h1>'+
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
						textSizeButtons +
						(sClassName? '<b class="class">' + sClassName + '</b>' : "")+
						'<b class="school">' + s_level + ", " + s_school + (s_source?" <span title=\"Источник: "+ oSource[o.source]+"\">("+s_source+")</span>":"")+'</b>'+
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
		var aSources = oParams.aSources;
		var sLang = oParams.sLang;

		var fHiddenSpells = (aHiddenSpells.length>0)? true: false;
		var fLockedSpells = (aLockedSpells.length>0)? true: false;

		$(".spellContainer").empty();
		var spells = "";


		filteredSpells = []; //arrDiff(filteredSpells, aHiddenSpells);


		//class
		var aSpells = [];
		if(sClass) {
			if(classSpells[sClass]) {
				aSpells = aSpells.concat(classSpells[sClass].spells);
				if(classSpells[sClass].subclasses && classSpells[sClass].subclasses[sSubClass]) {
					if(classSpells[sClass].subclasses[sSubClass].spells)
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
		if(aSchools && aSchools.length>0 && aSchools.length<99) {
			filteredSpells = filteredSpells.filter(function(spell){
				for(var i = 0; i < aSchools.length; i++) {
					if(aSchools[i].toLowerCase().trim() == spell.en.school.toLowerCase().trim()) {
						return true;
					}
				}
				return false;
			});
		}

		//source
		if(aSources && aSources.length>0 && aSources.length<9) {
			filteredSpells = filteredSpells.filter(function(spell){
				for(var i = 0; i < aSources.length; i++) {

					if(aSources[i].toLowerCase().trim() == spell.en.source.toLowerCase().trim()) {
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


		filteredSpells = fHiddenSpells? arrDiff(filteredSpells, aHiddenSpells) : filteredSpells;
		//filteredSpells = fLockedSpells? filteredSpells.concat(aLockedSpells) : filteredSpells;
		if (fLockedSpells) {
			for (var i = 0; i<allSpells.length; i++){
				for (var j=0; j<aLockedSpells.length; j++){
					if(allSpells[i].en.name == aLockedSpells[j].en) {
						filteredSpells.push(allSpells[i]);
						break;
					}
				}
			}
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
				var fLocked = filteredSpells[i].locked? true: false;
				var tmp = createCard(filteredSpells[i], sLang, sClass, fLocked)
				if (tmp)
					spells += tmp;
			}
		}

		$(".spellContainer").html(spells);
		$("#before_spells").hide();
		$("#info_text").hide();
	}

	function filterSpells(oParams){
		var sName = $("#NameInput input").val();
		var sClass = $("#ClassSelect .label").attr("data-selected-key");
		var sSubClass = $("#SubClassSelect .label").attr("data-selected-key");
		var sSubSubClass = $("#SubSubClassSelect .label").attr("data-selected-key");
		var nLevelStart = $("#LevelStart .label").attr("data-selected-key");
		var nLevelEnd = $("#LevelEnd .label").attr("data-selected-key");
		var aSchools = $("#SchoolCombobox .combo_box_title").attr("data-val");
			if(aSchools) aSchools = aSchools.split(",").map(function(item){return item.trim()});
		var aSources = $("#SourceCombobox .combo_box_title").attr("data-val");
			if(aSources) aSources = aSources.split(",").map(function(item){return item.trim()});
		var sLang = $("#LangSelect .label").attr("data-selected-key");

		var fHidden = (aHiddenSpells.length>0)? true: false;

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
				aSources: aSources,
				sLang: sLang,
				fHidden: fHidden
				});
		}, nTimerSeconds/4);

	}

	function createButtons() {
		var bHome = "<a href='/' class='bt flexChild' title='На главную страницу'><i class='fa fa-home'></i></a>";
		var bInfo = "<a href='#' class='bt flexChild' id='bInfo' title='Справка'><i class='fa fa-question-circle'></i></a>";
		var bPrint = "<a href='#' class='bt flexChild' id='bPrint' title='Распечатать'><i class='fa fa-print' aria-hidden='true'></i></a>";
		$(".p_side").append("<div class='mediaWidth flexParent'>" + bHome + bInfo + bPrint + "</div>");
	}
	function createCardWidthButtons() {
		var label = createLabel("Ширина карточек");
		var bHome = "<a href='#' class='bt flexChild cardWidthMin' title='Сделать уже'><i class='fa fa-caret-right' aria-hidden='true'></i> <i class='fa fa-caret-left' aria-hidden='true'></i></a>";
		var bInfo = "<a href='#' class='bt flexChild cardWidthNorm' title='Сделать нормальными'><i class='fa fa-square-o' aria-hidden='true'></i></a>";
		var bPrint = "<a href='#' class='bt flexChild cardWidthMax' title='Сделать шире'><i class='fa fa-caret-left' aria-hidden='true'></i> <i class='fa fa-caret-right' aria-hidden='true'></i></a>";
		$(".p_side").append("<div class='mediaWidth flexParent'>" + label + bHome + bInfo + bPrint + "</div>");
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
		if(classSpells[sClass] && classSpells[sClass].subclasses)
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
		} else {
			$("#SubClassSelect").remove();
		}

		//$(".p_side").append("<div class='mediaWidth'>" + classSelect + "</div>");
	}
	function createSubSubClassSelect(sClass, sSubClass) {
		var src = [{
			name: "[NONE]",
		    title: "[ПОДПОДКЛАСС]"
		}];
		if(classSpells[sClass] &&
			classSpells[sClass].subclasses &&
			classSpells[sClass].subclasses[sSubClass] &&
			classSpells[sClass].subclasses[sSubClass].subclasses)
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
		} else {
			$("#SubSubClassSelect").remove();
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
		var s1=createComboBox(schoolList.sort(function(a, b){
			if(a.en < b.en)
				return -1;
			if(a.en > b.en)
				return 1;
			return 0;
		}), {id: "SchoolCombobox", title: "Школы", checkAll: true, isOpen: isOpen});
		$(".p_side").append("<div class='mediaWidth'>" + s1 + "</div>");
	}
	function createSourceCombobox(isOpen) {
		if(isOpen == undefined)
			isOpen = false;
		var s1=createComboBox(sourceList, {id: "SourceCombobox", title: "Источники", checkAll: true, isOpen: isOpen});
		$(".p_side").append("<div class='mediaWidth'>" + s1 + "</div>");

		sourceList.forEach(function(el) {
			oSource[el.key] = el.en;
		});
	}
	function createNameFilter() {
		var ret=createInput({id: "NameInput"});
		var label = createLabel("Название");
		$(".p_side").append("<div class='mediaWidth'>" + label + ret + "</div>");
	}
  function createAutoSizeTextButton() {
		var label = createLabel("Размер текста");
		var bTextSize = "<a href='#' class='bt flexChild cardTestAutoSize' title='Автоподстройка размера текста заклинания'><i class='fa fa-text-height' aria-hidden='true'></i> Рассчитать </a>";
		$(".p_side").append("<div class='mediaWidth flexParent'>" + label + bTextSize + "</div>");		
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

	function createHiddenSpellsList(){
		if(aHiddenSpells.length < 1){
			$("#HiddenSpells").parent().remove();
			return;
		}
		if(!$("#HiddenSpells").length>0){
			var label = createLabel("Скрытые заклинания");
			$("#LangSelect").parent().after("<div class='mediaWidth'>" + label + "<div id='HiddenSpells'></div></div>");
		}
		var listHiddenSpells = aHiddenSpells.map(function(item){
			return "<a href='#' title='Вернуть на место' class='bUnhideSpell' data-name='"+item.en+"'>"+item.ru +" ("+ item.en+") </a>";
			}).join(" ");

		var bReturnAll = "<a href='#' class='bReturnUnvisible'>Вернуть все обратно</a>";
		$("#HiddenSpells").html(bReturnAll + listHiddenSpells);
	}

	function createLockedSpellsArea(){
		var aLocked = [];
		for (var i in aLockedSpells){
			aLocked.push(i);
		}
		var aResult = [];
		var l = aLocked.length;
		if(l>0){
			for (var i=0; i<allSpells.length; i++) {
				for (var j=0; j< l; j++) {
					if(allSpells[i].en.name == aLocked[j]) {
						aResult.push(allSpells[i]);
						aResult[aResult.length-1].lang = aLockedSpells[aLocked[j]].lang;
						aResult[aResult.length-1].class = aLockedSpells[aLocked[j]].class;
					}
				}
			}

			if($("#lockedSpellsArea").length<1){
				$(".p_cont").prepend("<div id='lockedSpellsArea'><span class='bUnlockAll'>Открепить все</span><span class='topHeader'></span><div class='content row'></div><span class='bottomHeader'></span></div>");

			}
			$("#lockedSpellsArea .content").html(aResult.sort(function(a, b) {
				if(a.lang && b.lang) {
					if (a[a.lang].level+a[a.lang].name.toLowerCase().trim() < b[b.lang].level+b[b.lang].name.toLowerCase().trim() )
						return -1;
					if (a[a.lang].level+a[a.lang].name.toLowerCase().trim() > b[b.lang].level+b[b.lang].name.toLowerCase().trim() )
						return 1;
				}
				return 0
			}).map(function(el){return createCard(el, el.lang, el.class, true)}));

			//COUNTER
			$("#lockedSpellsArea .topHeader").html("("+l+")");
			$(".spellContainer").addClass("noprint");
		} else {
			$("#lockedSpellsArea").remove();
			$(".spellContainer").removeClass("noprint");
		}
	}

	function createSidebar() {
		var lang = getConfig("language");
		var schoolOpen = getConfig("schoolOpen");
		var sourceOpen = getConfig("sourceOpen");
		createButtons();
		createNameFilter();
		createClassSelect();
		createLevelSelect();
		createSchoolCombobox(schoolOpen);
		createSourceCombobox(sourceOpen);
		createCardWidthButtons();    
		createAutoSizeTextButton();
		createLangSelect(lang);

		$(".p_side").fadeIn();
	}


	/// handlers

	// close Mod Win
	$("body").on("click", ".bCloseInfoWin", function() {
		$("#dbg").fadeOut();
		hideInfoWin();
	});

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
		var oComboBox = src.closest(".combo_box");
		var sComboBoxId = oComboBox.attr("id");
		d_root = $("#"+sComboBoxId+" input#"+attrFor).attr("data-root");
		d_parent = $("#"+sComboBoxId+" input#"+attrFor).attr("data-parent");
		if($("#"+sComboBoxId+" input#"+attrFor).prop("checked"))
			{
			trig=false;
			}
		$("#"+sComboBoxId+" input#"+attrFor).prop("checked", trig);
		/**/
		if(d_root!='' && d_root!=undefined) {
			$("#"+sComboBoxId+" input[type=checkbox][data-parent="+d_root+"]").each(function(){
				$(this).prop( "checked", trig );
			});
		}
		/**/
		if(d_parent!='' && d_parent!=undefined && trig==false) {
			$("#"+sComboBoxId+" input[type=checkbox][data-root="+d_parent+"]").prop( "checked", trig);

		}


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
		$("#"+sComboBoxId+" .combo_box_title").html("");
		$("#"+sComboBoxId+" .combo_box_title").attr('data-val',"");
		$("#"+sComboBoxId+" input[type=checkbox]:checked").each(function(){
			d_root='';
			d_parent='';
			d_parent=$(this).attr("data-parent");
			d_root=$(this).attr("data-root");

			title=$("#"+sComboBoxId+" .combo_box_title").html();
			value=$("#"+sComboBoxId+" .combo_box_title").attr('data-val');

			if(title!="" && title.charAt(title.length-1)!="(") {
				$("#"+sComboBoxId+" .combo_box_title").append(", ");
			}
			// обычный пункт
			if(d_parent==undefined && d_root==undefined)
				{
				txt = $(this).next("label").html().replace("<br>", " | ");
				title_value = $("#"+sComboBoxId+" .combo_box_title").attr("data-val");
				value = $(this).attr('value');
				dp = $(this).attr('data-parent');
				value = make_val(title_value, value, dp);
				//$(".combo_box_title").append(txt).attr("data-val", value);
				$("#"+sComboBoxId+" .combo_box_title").attr("data-val", value);
				}
			// если root
			if(d_root!=undefined)
				{
					// если есть отмеченные потомки
				if($("#"+sComboBoxId+" input[type=checkbox][data-parent="+d_root+"]:checked").length>0)
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
					title_value = $("#"+sComboBoxId+" .combo_box_title").attr("data-val");
					value = $(this).attr('value');
					dp = $(this).attr('data-parent');
					value = make_val(title_value, value, dp);
					var ind = $("#"+sComboBoxId+" input[type=checkbox][data-parent="+d_parent+"").index(this);
					if(ind==$("#"+sComboBoxId+" input[type=checkbox][data-parent="+d_parent+"").length-1 && d_parent==before_root){
						txt+=")";
					}

					$("#"+sComboBoxId+" .combo_box_title").append(txt).attr("data-val", value);
				}
			});

			if($("#"+sComboBoxId+" .combo_box_title").html()=='')
				$("#"+sComboBoxId+" .combo_box_title").html(src.closest(".combo_box").attr('data-text'));

		/*/
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
		/**/

		// bg /
		return false;
	}

	function deselectAllCards() {
		$(".spellCard").removeClass("selected");
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
			updateHash();
			filterSpells();
		}, nTimerSeconds);
	});
	$("body").on('keyup', "#NameInput input", function(){
		clearTimeout(oTimer);
		oTimer = setTimeout(function(){
			updateHash();
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
			updateHash();
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
			updateHash();
		}, nTimerSeconds);
	});
	// sub sub class select
	$("body").on('focusout', "#SubSubClassSelect", function(){
		clearTimeout(oTimer);

		oTimer = setTimeout(function(){
			updateHash();
			filterSpells();
		}, nTimerSeconds);
	});

	// level select
	$("body").on('focusout', "#LevelStart", function(){
		clearTimeout(oTimer);
		oTimer = setTimeout(function(){
			updateHash();
			filterSpells();
		}, nTimerSeconds);
	});
	$("body").on('focusout', "#LevelEnd", function(){
		clearTimeout(oTimer);
		oTimer = setTimeout(function(){
			updateHash();
			filterSpells();
		}, nTimerSeconds);
	});
	// school combobox
	$("body").on('click', "#SchoolCombobox label", function(){
		clearTimeout(oTimer);
		oTimer = setTimeout(function(){
			updateHash();
			filterSpells();
		}, nTimerSeconds);
	});
	$("body").on('click', "#SchoolCombobox .combo_box_title, #SchoolCombobox .combo_box_arrow", function(){
		setConfig("schoolOpen", $("#SchoolCombobox").attr("data-content-open"));
	});

	// source combobox
	$("body").on('click', "#SourceCombobox label", function(){
		clearTimeout(oTimer);
		oTimer = setTimeout(function(){
			updateHash();
			filterSpells();
		}, nTimerSeconds);
	});
	$("body").on('click', "#SourceCombobox .combo_box_title, #SourceCombobox .combo_box_arrow", function(){
		setConfig("sourceOpen", $("#SourceCombobox").attr("data-content-open"));
	});

	// lang select
	$("body").on('focusout', "#LangSelect", function(){
		clearTimeout(oTimer);
		oTimer = setTimeout(function(){
			updateHash();
			filterSpells();
		}, nTimerSeconds);
	});

	// show all spells
	$("body").on('click', "#showAllSpells", function(){
		setConfig("infoIsShown", true);
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


	//hide spells
	$("body").on('click', ".bHideSpell", function(){
		var sName, sNameRu;

		var nSelectedCards = $(".spellCard.selected").length;
		if(nSelectedCards > 0) {
			var oButtonLock = $(this);
			$(".spellCard.selected").each(function() {
				sName = $(this).closest(".cardContainer").attr("data-name");
				sNameRu = $(this).closest(".cardContainer").attr("data-name-ru");

				oButtonLock.hide();
				// update hidden spells array
				aHiddenSpells.push({en: sName, ru: sNameRu});
			});
		} else {
			sName = $(this).closest(".cardContainer").attr("data-name");
			sNameRu = $(this).closest(".cardContainer").attr("data-name-ru");

			$(this).hide();
			// update hidden spells array
			aHiddenSpells.push({en: sName, ru: sNameRu});
		}

		// show list of hidden spells
		createHiddenSpellsList();

		// show spells without hidden
		filterSpells({fHidden: true});
	})
	// unhide spells
	$("body").on('click', ".bUnhideSpell", function(){
		var sName = $(this).attr("data-name")
		// update hidden spells array
		aHiddenSpells.splice(aHiddenSpells.map(function(el){return el.en}).indexOf(sName), 1);

		// show list of hidden spells
		createHiddenSpellsList();

		// show spells without hidden
		filterSpells({fHidden: true});

		return false;
	})
	$("body").on("click", ".bReturnUnvisible", function() {
		aHiddenSpells = [];// show list of hidden spells
		createHiddenSpellsList();

		// show spells without hidden
		filterSpells({fHidden: true});

		return false;
	});

	// lock spells
	$("body").on('click', ".bLockSpell", function(){
		var sName, sNameRu, sLang, sClass;

		var nSelectedCards = $(".spellCard.selected").length;
		if(nSelectedCards > 0) {
			$(".spellCard.selected").each(function() {
				sName = $(this).closest(".cardContainer").attr("data-name");
				sNameRu = $(this).closest(".cardContainer").attr("data-name-ru");
				sLang = $(this).closest(".cardContainer").attr("data-lang");
				sClass= $(this).closest(".cardContainer").attr("data-class");

				aLockedSpells[sName] = {
					ru: sNameRu,
					lang: sLang,
					class: sClass
					};
			});
		} else {
			sName = $(this).closest(".cardContainer").attr("data-name");
			sNameRu = $(this).closest(".cardContainer").attr("data-name-ru");
			sLang = $(this).closest(".cardContainer").attr("data-lang");
			sClass= $(this).closest(".cardContainer").attr("data-class");


			aLockedSpells[sName] = {
				ru: sNameRu,
				lang: sLang,
				class: sClass
				};
		}

		// show locked
		createLockedSpellsArea();
		deselectAllCards();
	})

	// unlock spells
	$("body").on('click', ".bUnlockSpell", function(){
		var sName;

		var nSelectedCards = $(".spellCard.selected").length;
		if(nSelectedCards > 0) {
			$(".spellCard.selected").each(function() {
				sName = $(this).closest(".cardContainer").attr("data-name");
				delete aLockedSpells[sName];
			});
		} else {
			sName = $(this).closest(".cardContainer").attr("data-name");
			delete aLockedSpells[sName];
		}

		// show locked
		createLockedSpellsArea();
		deselectAllCards();
	})
	$("body").on('click', "#lockedSpellsArea .topHeader", function(){
		$(this).next(".content").slideToggle();
		$(this).next(".content").next(".bottomHeader").fadeToggle();
	});
	$("body").on('click', ".bUnlockAll", function(){
		aLockedSpells = [];
		// show locked
		createLockedSpellsArea();
	});

	$("body").on('click', "#bPrint", function(){
		window.print();

		return false;
	});

	// text size
	$("body").on('click', ".textMin", function() {
		var f_s=$(this).parent().parent().find(".text").css("font-size");
		f_s=f_s.substring(0, f_s.length - 1);
		f_s=f_s.substring(0, f_s.length - 1);
		//console.log(f_s);

		if(f_s>6)
		 f_s--;
		//console.log(f_s);
		var sFontSize = f_s+"px";
		var sLineHeight = f_s-1+"px";
	    $(this).parent().parent().find(".text").css({"font-size": sFontSize, "line-height": sLineHeight});

		$(".spellCard.selected").each(function() {
			$(this).find(".text").css({"font-size": sFontSize, "line-height": sLineHeight});
		});

		return false;
	});
	$("body").on('click', ".textMax", function() {
		var f_s=$(this).parent().parent().find(".text").css("font-size");
		f_s=f_s.substring(0, f_s.length - 1);
		f_s=f_s.substring(0, f_s.length - 1);
		if(f_s<20)
		 f_s++;
		//console.log(f_s);
		var sFontSize = f_s+"px";
		var sLineHeight = f_s-1+"px";
	    $(this).parent().parent().find(".text").css({"font-size": sFontSize, "line-height": sLineHeight});

		$(".spellCard.selected").each(function() {
			$(this).find(".text").css({"font-size": sFontSize, "line-height": sLineHeight});
		});
		return false;
	});

	// card width
	$("body").on("click", ".cardWidthMin", function() {
		var width;
		var nSelectedCards = $(".spellCard.selected").length;
		if(nSelectedCards > 0) {
			$(".spellCard.selected").each(function() {
				width = $(this).parent().width();
				width = width-20+"px";
				$(this).parent().width(width);
			});
		} else{
			width = $(".cardContainer").eq(0).width();
			width = width-20+"px";
			$('.cardContainer').width(width);
			setConfig("cardWidth", width);
		}

	});
	$("body").on("click", ".cardWidthMax", function() {
		var width;
		var nSelectedCards = $(".spellCard.selected").length;
		if(nSelectedCards > 0) {
			$(".spellCard.selected").each(function() {
				width = $(this).parent().width();
				width = (width+20)+"px";
				$(this).parent().width(width);
			});
		} else {
			width = $(".cardContainer").eq(0).width();
			width = (width+20)+"px";
			$('.cardContainer').width(width);
			setConfig("cardWidth", width);
		}
	});
	$("body").on("click", ".cardWidthNorm", function() {
		var width = "2.5in";
		var nSelectedCards = $(".spellCard.selected").length;
		if(nSelectedCards > 0) {
			$(".spellCard.selected").each(function() {
				$(this).parent().width(width);
			});
		} else {
			$('.cardContainer').width(width);
			setConfig("cardWidth", width);
		}
	});
  
  // autoszie Text in the cards
	$("body").on("click", ".cardTestAutoSize", function() {
		var nSelectedCards = $(".spellCard.selected").length;
		if(nSelectedCards > 0) {
			$(".spellCard.selected").each(function() {
				var f_s=$(this).find(".text").css("font-size");
				f_s=f_s.substring(0, f_s.length - 2);
				while (f_s > 7 && $(this).find(".text")[0].scrollWidth < $(this).find(".text").innerWidth()) {						
					f_s-=0.3;
					
					var sFontSize = f_s+"px";
					var sLineHeight = f_s-1+"px";			
					$(this).find(".text").css({"font-size": sFontSize, "line-height": sLineHeight});
				}
			});
		} else {
			$(".spellCard").each(function() {
				var f_s=$(this).find(".text").css("font-size");
				f_s=f_s.substring(0, f_s.length - 2);
				while (f_s > 7 && $(this).find(".text")[0].scrollWidth < $(this).find(".text").innerWidth()) {	
					 f_s-=0.3;
					//console.log(f_s);
					var sFontSize = f_s+"px";
					var sLineHeight = f_s-1+"px";			
					$(this).find(".text").css({"font-size": sFontSize, "line-height": sLineHeight});
				}
			});
		}
	});

	$(document).keydown(function(event){
		// CTRL pressed
		if(event.which=="17") {
			fCtrlIsPressed = true;
		}

		// A pressed
		if(event.which=="65" && fCtrlIsPressed) {
			if($(".spellCard.selected").length == $(".spellCard").length) {
				// deselect all
				$(".spellCard").removeClass("selected");
			} else {
				// select all
				$(".spellCard").addClass("selected");
			}
			return false;
		}
	});

	$(document).keyup(function(){
		fCtrlIsPressed = false;
	});

	// card select/deselect
	$("body").on("click", ".spellCard", function() {
		if(fCtrlIsPressed)
			$(this).toggleClass("selected");
	});	
  $("body").on("dblclick", ".spellCard", function() {
		$(this).toggleClass("selected");
		clearSelection();
		return false;
	});
	$("body").on("taphold", ".spellCard", function() {
		$(this).toggleClass("selected");
	});


// url filters
	function updateHash() {
		var sName = $("#NameInput input").val();
		var sClass = $("#ClassSelect .label").attr("data-selected-key");
		var sSubClass = $("#SubClassSelect .label").attr("data-selected-key");
		var sSubSubClass = $("#SubSubClassSelect .label").attr("data-selected-key");
		var nLevelStart = $("#LevelStart .label").attr("data-selected-key");
		var nLevelEnd = $("#LevelEnd .label").attr("data-selected-key");
		var aSchools = $("#SchoolCombobox .combo_box_title").attr("data-val");
			if(aSchools) aSchools = aSchools.split(",").map(function(item){return item.trim()});
		var aSources = $("#SourceCombobox .combo_box_title").attr("data-val");
			if(aSources) aSources = aSources.split(",").map(function(item){return item.trim()});
		var sLang = $("#LangSelect .label").attr("data-selected-key");

		//#q=spell_name&ls=0&le=9
		var aFilters = [];
		if(sName && sName.length>0) {
			aFilters.push("q="+sName.replace(/\s+/g, "_"));
		}
		if(nLevelStart && nLevelStart>0 && nLevelStart<=9) {
			aFilters.push("ls="+nLevelStart);
		}
		if(nLevelEnd && nLevelEnd>=0 && nLevelEnd<9) {
			aFilters.push("le="+nLevelEnd);
		}
		if(sClass && sClass.length > 0 && sClass != "[ALL]") {
			aFilters.push("class="+sClass.replace(/\s+/g, "_"));
		}
		if(sSubClass && sSubClass.length > 0 && sSubClass != "[NONE]") {
			aFilters.push("subclass="+sSubClass.replace(/\s+/g, "_"));
		}
		if(sSubSubClass && sSubSubClass.length > 0 && sSubSubClass != "[NONE]") {
			aFilters.push("subsubclass="+sSubSubClass.replace(/\s+/g, "_"));
		}
		if(aSchools && aSchools.length>0 && aSchools.length<8) {
			aFilters.push("schools="+aSchools.join(","));
		}
		if(aSources && aSources.length>0 && $("#SourceCombobox .combo_box_content input").length > aSources.length) {
			aFilters.push("sources="+aSources.join(","));
		}
		if(sLang && sLang.length > 0 && sLang != "ru") {
			aFilters.push("lang="+sLang.replace(/\s+/g, "_"));
		}

		if(aFilters.length>0) {

			var sHash = aFilters.join("&");
			window.location.hash = sHash;
		} else {
			removeHash();
		}
	}
  function getHash(){
    $('html, body').animate({scrollTop:0}, 'fast');

    var sHash = window.location.hash.slice(1); // /archive#q=spell_name
    if(sHash && !/[^А-Яа-яЁё\w\d\/&\[\]?|,_=-]/.test(sHash)) {
      var sName = sHash.match(/\bq=([А-Яа-яЁё\/\w\d_]+)/);
      var sClass = sHash.match(/\bclass=([\[\]А-Яа-яЁё\/\w\d_]+)/);
      var sSubClass = sHash.match(/\bsubclass=([\[\]А-Яа-яЁё\/\w\d_]+)/);
      var sSubSubClass = sHash.match(/\bsubsubclass=([\[\]А-Яа-яЁё\/\w\d_]+)/);
      var nLevelStart = sHash.match(/\bls=([\d]+)/);
      var nLevelEnd = sHash.match(/\ble=([\d]+)/);
      var sLang = sHash.match(/\blang=([\w]+)/);
      var sSchools = sHash.match(/\bschools=([\w,]+)/);
      var sSources = sHash.match(/\bsources=([\w,_]+)/);

      if(sName && sName[1]) {
      	$("#NameInput input").val(sName[1].replace(/[_]+/g," "));
      }
      if(sClass && sClass[1]) {
      	$("#ClassSelect .label").attr("data-selected-key", sClass[1]).html($("#ClassSelect li[data-key='"+sClass[1]+"']").html().replace("<br>", " | "));
      	var sClass = $("#ClassSelect .label").attr("data-selected-key");
				createSubClassSelect(sClass);
      }
      if(sSubClass && sSubClass[1]) {
      	$("#SubClassSelect .label").attr("data-selected-key", sSubClass[1]).html($("#SubClassSelect li[data-key='"+sSubClass[1]+"']").html().replace("<br>", " | "));
      	var sSubClass = $("#SubClassSelect .label").attr("data-selected-key");
				createSubSubClassSelect(sClass, sSubClass);
      }
      if(sSubSubClass && sSubSubClass[1]) {
      	$("#SubSubClassSelect .label").attr("data-selected-key", sSubSubClass[1]).html($("#SubSubClassSelect li[data-key='"+sSubSubClass[1]+"']").html().replace("<br>", " | "));
      }
      if(nLevelStart && nLevelStart[1]) {
      	$("#LevelStart .label").attr("data-selected-key", nLevelStart[1]).text(nLevelStart[1]);
      }
      if(nLevelEnd && nLevelEnd[1]) {
      	$("#LevelEnd .label").attr("data-selected-key", nLevelEnd[1]).text(nLevelEnd[1]);
      }
      if(sLang && sLang[1]) {
      	$("#LangSelect .label").attr("data-selected-key", sLang[1]).html($("#LangSelect li[data-key='"+sLang[1]+"']").html().replace("<br>", " | "));
      }
      if(sSchools && sSchools[1]) {
      	var aSchools = sSchools[1].split(",");

      	$("#SchoolCombobox .combo_box_content input[type='checkbox']").each(function(){
      		if(aSchools.indexOf($(this).val())>-1) {
      			$(this).prop('checked', true);
      		} else {
      			$(this).prop('checked', false);
      		}
      	});
      	$("#SchoolCombobox .combo_box_title").attr("data-val", sSchools[1])

      }
      if(sSources && sSources[1]) {
      	var aSources = sSources[1].split(",");

      	$("#SourceCombobox .combo_box_content input[type='checkbox']").each(function(){
      		if(aSources.indexOf($(this).val())>-1) {
      			$(this).prop('checked', true);
      		} else {
      			$(this).prop('checked', false);
      		}
      	});
      	$("#SourceCombobox .combo_box_title").attr("data-val", sSchools[1])

      }
    } else {
      removeHash();
      //hideClerFilter();
    }
    //$("body").css("border-top", "1px solid red");
    filterSpells();
  }

  function removeHash() {
    history.pushState("", document.title, window.location.pathname + window.location.search);
    return false;
  }
  //window.onhashchange = getHash;

// /url filters


	$.when(createSidebar()).done(
		function(){
      //$("body").css("border-top", "1px solid blue");
			$("#showAllSpells").slideDown();
			if(getViewPortSize("width") > 600){
				if(getConfig("infoIsShown")==true)
					getHash();
					//filterSpells();
			} else{
        //setTimeout(getHash, 1000);
        getHash();
      }
		}
	);
};

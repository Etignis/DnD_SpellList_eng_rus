$(window).load(function(){
	function createSelect(src, params) {
		var options = "";
		var selected_key = params.selected_key;
		var id = params.id? "id='"+params.id+"'" : "";
		var atr_class = params.class? params.class : "";
		var width = params.width? "; width: "+ params.width: "";
		var lableText;
		var min_width = 0;
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
		min_width = ~~(min_width*0.9);

		var list = "<ul class='list'>" + options + "</ul>";

		var selectedKey = selected_key; 
		var label="<div class='label "+atr_class+"' data-selected-key='" + selectedKey + "' style='min-width:"+min_width+"em "+width+"'>" + lableText + "</div>";
		var select = "<button " + id + " class='customSelect' style='min-width:"+min_width+"em "+width+"'>" + label + list + "</button>"

		return select;
	}	
	
	function createComboBox(src, param) {
		var ARR_DOWN = '<i class="fa fa-arrow-down"></i>';
		var ARR_UP = '<i class="fa fa-arrow-up"></i>';
		var ret = '';
		var id =  param.id? "id='"+param.id+"'": "";
		var title = param.title? param.title: "Выберите";
		var checked = param.checkAll? "checked": "";
		var arrow="<div class='combo_box_arrow'><span class='arr_down' style='display:none'>"+ARR_DOWN+"</span><span class='arr_up'>"+ARR_UP+"</span></div>"; 
		for (var i =0; i < src.length; i++) {
			var type = src[i];
			ret+="<input "+checked+" type='checkbox' value='"+type.en+"' id='ch_"+type.en+"'><label for='ch_"+type.en+"' data-hierarchy='root'>"+type.en+"<br>"+type.ru+"</label>";
			
		}
		ret = "<div "+id+" class='combo_box' data-text='"+title+"'><div class='combo_box_title'>"+title+"</div><div class='combo_box_content'>"+ret+"</div>"+arrow+"</div>";
		return ret;
	}
	
	function createInput(params){
		var id = params.id? "id='"+params.id+"'" : "";
		return "<div "+id+" class='input'><input type='text'><span class='cross'></span></div>";
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
	
	function createCard(spell, lang, sClass) {
		if (spell[lang] || (lang="en" && spell[lang])) {
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
			
			ret = '<div class="cardContainer" data-level="' + spell.en.level + '" data-school="' + spell.en.school + '">'+
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
	function showFiltered(sName, sClass, nLevelStart, nLevelEnd, aSchools, sLang) {
		$(".spellContainer").empty();
		var spells = "";
		var filteredSpells = [];
		
		
		//class
		if(sClass) {
			if(classSpells[sClass]) {
				classSpells[sClass].spells.forEach(function(spellName){
					for (var i = 0; i<allSpells.length; i++){	
						if(allSpells[i].en.name == spellName) {
							filteredSpells.push(allSpells[i]);
							break;
						}
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
		
		console.log("Spell not found: ");
		for (var i in filteredSpells) {
			if(filteredSpells[i]) {
				var tmp = createCard(filteredSpells[i], sLang)
				if (tmp)
					spells += tmp;
			} else {
				console.log(i);
			}
		}
		console.log("---");
		$(".spellContainer").html(spells);
		$("#before_spells").hide();
		$("#info_text").hide();
	}
	
	function filterSpells(){
		var sName = $("#NameInput").val();
		var sClass = $("#ClassSelect .label").attr("data-selected-key");
		var nLevelStart = $("#LevelStart .label").attr("data-selected-key");
		var nLevelEnd = $("#LevelEnd .label").attr("data-selected-key");
		var aSchools = $("#SchoolCombobox .combo_box_title").attr("data-val");
			if(aSchools) aSchools = aSchools.split(",").map(function(item){return item.trim()});
		var sLang = $("#LangSelect .label").attr("data-selected-key");
		
		showFiltered(sName, sClass, nLevelStart, nLevelEnd, aSchools, sLang);
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
		
		$(".p_side").append(label + classSelect);		
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
		$(".p_side").append(label+str);	
	}
	function createSchoolCombobox() {		
		var s1=createComboBox(schoolList, {id: "SchoolCombobox", title: "Школа", checkAll: true});
		$(".p_side").append(s1);
	}
	function createNameFilter() {
		var ret=createInput({id: "NameInput"});
		var label = createLabel("Название");
		$(".p_side").append(label +ret);		
	}
	function createLangSelect() {
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
		var classSelect = createSelect(src, {id: "LangSelect", selected_key: "en", width: "100%"});
		var label = createLabel("Язык");
		$(".p_side").append(label+classSelect);	
	}
	
	function createSidebar() {
		createNameFilter();
		createClassSelect();
		createLevelSelect();
		createSchoolCombobox();
		createLangSelect();
		
		$(".p_side").fadeIn();	
	}
	

	/// handlers
	
	// hide DBG
	$("body").on("click", "#dbg", function() {
		$(this).fadeOut();
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
	});
	
	// custom Combobox
	$("body").on('click', ".combo_box_title, .combo_box_arrow", function(){
		var el = $(this).closest(".combo_box").find(".combo_box_content");
		if(el.is(":visible"))
		{
			el.slideUp();
			el.next(".combo_box_arrow").find(".arr_down").show();
			el.next(".combo_box_arrow").find(".arr_up").hide();
		}
		else
		{
			el.slideDown();
			el.next(".combo_box_arrow").find(".arr_down").hide();
			el.next(".combo_box_arrow").find(".arr_up").show();
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
	
	// lang select
	$("body").on('focusout', "#LangSelect", function(){
		filterSpells();
	});
	// class select
	$("body").on('focusout', "#ClassSelect", function(){
		filterSpells();
	});
	
	
	//createSpellsIndex();
	showFiltered(null, null, null, null, null, "ru");
	createSidebar();
}); 
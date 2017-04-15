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
		var select = "<div " + id + " class='customSelect'>" + label + list + "</div>"

		return select;
	}	
	
	var ARR_DOWN = '<i class="fa fa-arrow-down"></i>';
	var ARR_UP = '<i class="fa fa-arrow-up"></i>';
	function createComboBox(src, param) {
		var ret = '';
		var id =  param.id? "id='"+param.id+"'": "";
		var title = param.title? param.title: "Выберите";
		var arrow="<div class='combo_box_arrow'>"+ARR_UP+"</div>";
		for (var i =0; i < src.length; i++) {
			var type = src[i];
			ret+="<input type='checkbox' value='"+type.en+"' id='ch_"+type.en+"'><label for='ch_"+type.en+"' data-hierarchy='root'>"+type.en+"<br>"+type.ru+"</label>";
			
		}
		ret = "<div "+id+" class='combo_box' data-text='"+title+"'><div class='combo_box_title'>"+title+"</div><div class='combo_box_content'>"+ret+"</div>"+arrow+"</div>";
		return ret;
	}
	
	function createInput(){
		return "<input class='input' type='text'>"
	}
	
	function createCard(o) {
		var s_name = "<span data-lang='en' style='display: none'>" + o.en.name + "</span>"+"<span data-lang='ru'>" + o.ru.name + "</span>";
		var s_ritual = o.en.ritual?"<span data-lang='en' style='display: none'> (Ritual)</span>"+"<span data-lang='ru'> (Ритуал)</span>": "";
		var s_castingTime = "<span data-lang='en' style='display: none'>" + o.en.castingTime + "</span>"+"<span data-lang='ru'>" + o.ru.castingTime + "</span>";
		var s_range = "<span data-lang='en' style='display: none'>" + o.en.range + "</span>"+"<span data-lang='ru'>" + o.ru.range + "</span>";
		var s_components = "<span data-lang='en' style='display: none'>" + o.en.components + "</span>"+"<span data-lang='ru'>" + o.ru.components + "</span>";
		var s_duration = "<span data-lang='en' style='display: none'>" + o.en.duration + "</span>"+"<span data-lang='ru'>" + o.ru.duration + "</span>";
		var s_materials = "<span data-lang='en' style='display: none'>" + o.en.materials + "</span>"+"<span data-lang='ru'>" + o.ru.materials + "</span>";
		var s_text = "<span data-lang='en' style='display: none'>" + o.en.text + "</span>"+"<span data-lang='ru'>" + o.ru.text + "</span>";
		var s_level = "<span data-lang='en' style='display: none'>" + ((o.en.level == 0)? "Cantrip" : o.en.level + " level") + "</span>"+"<span data-lang='ru'>" + ((o.ru.level == 0)? "Трюк" : o.ru.level + " уровень") + "</span>";
		var s_school = "<span data-lang='en' style='display: none'>" + o.en.school + "</span>"+"<span data-lang='ru'>" + o.ru.school + "</span>";
		var s_source = "<span data-lang='en' style='display: none'>" + o.en.source + "</span>"+"<span data-lang='ru'>" + o.ru.source + "</span>";
		
		ret = '<div class="cardContainer" data-level="' + o.en.level + '" data-school="' + o.en.school + '">'+
			'<div class="spellCard">'+
				'<div class="content">'+
					'<h1>' + s_name + s_ritual + '</h1>'+
					'<div class="row">'+
						'<div class="cell castingTime">'+
							'<b><span data-lang="en" style="display: none">CASTING TIME</span><span data-lang="ru">Время накладывания</span></b>'+
							'<span>' + s_castingTime + '</span>'+
						'</div>'+
						'<div class="cell range">'+
							'<b><span data-lang="en" style="display: none">RANGE</span><span data-lang="ru">Дистанция</span></b>'+
							'<span>' + s_range + '</span>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="cell components">'+
							'<b><span data-lang="en" style="display: none">COMPONENTS</span><span data-lang="ru">Компоненты</span></b>'+
							'<span>' + s_components + '</span>'+
						'</div>'+
						'<div class="cell duration">'+
							'<b><span data-lang="en" style="display: none">DURATION</span><span data-lang="ru">Длительность</span></b>'+
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
		var classSelect = createSelect(src, {selected_key: "[ALL]", width: "100%"});
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
		var s1 = createSelect(src, {selected_key: 0, width: "100%"});
		var s2 = createSelect(src, {selected_key: 9, width: "100%"});
		var str = "<div class='row'><div class='cell'>"+s1+"</div><div class='cell'>"+s2+"</div></div>";
		var label = createLabel("Уровень с/по");
		$(".p_side").append(label+str);	
	}
	function createSchoolCombobox() {		
		var s1=createComboBox(schoolList, {id: "schoolCombobox", title: "Школа"});
		$(".p_side").append(s1);
		
		$("#schoolCombobox input").each(function(i, el){
			$(this).click();
		});
	}
	function createNameFilter() {
		var ret=createInput();
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
		var classSelect = createSelect(src, {selected_key: "ru", width: "100%"});
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
	
	createSpellsIndex();
	createSidebar();
	
	
	
	//custom Select
	$("body").on("click", ".customSelect .label", function() {
	  $(this).next(".list").fadeToggle();
	});
	$("body").on("click", ".customSelect .option", function() {
	  var key = $(this).attr("data-key");
	  var text = $(this).html().replace("<br>", " | ");
	  $(this).closest(".customSelect").find(".label").attr("data-selected-key", key).text(text);
	  $(this).parent("ul").fadeOut();
	  
	  //var listName = key;//$("#listSelect option:selected").attr("data-key");
		//make_dict2(name_groups[listName]);
		//var comboBox = makeComboBox(name_groups[listName]);
		//$("#names").html(comboBox);
	});
	
	// custom Combobox
	$("body").on('click', ".combo_box_title, .combo_box_arrow", function(){
		var el = $(this).closest(".combo_box").find(".combo_box_content");
		if(el.is(":visible"))
		{
			el.slideUp();
			el.next(".combo_box_arrow").html(ARR_DOWN);
		}
		else
		{
			el.slideDown();
			el.next(".combo_box_arrow").html(ARR_UP);
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
			txt = $(this).next("label").text();
			title_value = $(".combo_box_title").attr("data-val");
			value = $(this).attr('value');
			dp = $(this).attr('data-parent');
			value = make_val(title_value, value, dp);
			//$(".combo_box_title").append(txt).attr("data-val", value);
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
}); 
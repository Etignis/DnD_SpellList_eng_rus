$(document).ready(function(){
	// перемешивание
	function shuffle(o){
    for(var j, x, k = o.length; k; j = Math.floor(Math.random() * k), x = o[--k], o[k] = o[j], o[j] = x);
    return o;
};
	
	function make_generator(){
		/**/
		var folk="<select id='type'>"+
			"<option value='dark_human'>Пальземия</option>"+
			"<option value='dwarf'>Гномы</option>"+
			"<option value='north'>Север</option>"+
			"<option value='panshur'>Паншуры</option>"+
			"<option value='bald'>Бальды</option>"+
			"<option value='elf'>Эльфы</option>"+
			"<option value='ork'>Орки</option>"+
			"<option value='atlant'>Аталанты</option>"+
			"<option value='human'>Люди</option>"+
		"</select>";
		/*/
		var folk="<select id='type'>"+
			"<option value='dwarf'>Гномы</option>"+
		"</select>";
		/**/
		generator=folk+"<button class='bt' id='go'>Подобрать</button>";
		$("#names").html(generator);
	}
	function names(type)
		{
			var result = "";
			if(type=="dark_human")
				{
				result = d_h_names();
				}
			if(type=="dwarf")
				{
				result = dwarf_names();
				}
			if(type=="north")
				{
				result = north_names();
				}
			if(type=="panshur")
				{
				result = panshur_names();
				}
			if(type=="bald")
				{
				result = bald_names();
				}
			if(type=="elf")
				{
				result = elf_names();
				}
			if(type=="ork")
				{
				result = ork_names();
				}
			if(type=="atlant")
				{
				result = atlant_names();
				}
			if(type=="human")
				{
				result = human_names();
				}
			$("#result").html(result);	
		}
		
	// names
	function fem_names(name)
		{
		
		}
	function d_h_names(){
		var name_line= "Агнешк;Алгбет;Алисий;Алексендж;Алеш;Алик;Алодж;Андель;Амастий;Аделаид;Адриан;Алес;Алот;Амад;Анастар;Аншер;Арност;Арон;Апланий;Аврет;Багрим;Бартам;Барун;Беат;Бедридж;Бердризек;Бендир;Бенедик;Белен;Берт;Биан;Божен;Болат;Борит;Бранк;Бранат;Вавринек;Ваклав;Валис;Вацлав;Вастар;Ветт;Вджер;Вилем;Винк;Виеслав;Виг;Войцех;Вилент;Вилтан;Виес;Вис;Вирн;Влатрим;Вотек;Вослав;"+"Габа;Габрат;Габрел;Габрис;Геновеф;Гавир;Гелит;Гритор;Данут;Дал;Даск;Дейлк;Джаромил;Джарк;Джармил;Джиндриск;Джирин;Джозеф;Джолан;Джохан;Джакуб;Джейрк;Джерадж;Дит;Донет;Дорот;Дорфис;Друджи;Дусан;Дузан;Ерошим;Жулиан;Жулит;Захар;Зивор;Зоф;Ивакон;Иво;Ивон;Илин;Иолант;Иовит;Ирениус;Иренк;Иржи;Йохан;Каетан;Кай;Казимир;Карин;Карон;Касий;Кирим;Клар;Климек;Клементин;Колек;Контак;Констар;Корн;Корнил;Корис;Кувар;Кристин;Ксавар;Леслав;Лех;Лехав;Лешек;Леокад;Леос;Лонгин;Луис;Луцис;Лутас;Людвер;Любош;Малгожат;Марек;Марсин;Мариус;Мартис;Марил;Мазен;Матеуш;Мауриш;Матий;Мерцелин;Миешек;Милад;Милен;Макалин;Милош;Микор;Мистлав;Над;Настас;Натис;Никодем;Павас;Патиг;Пшемек;Пшерит;Радом;Радсав;Радзимиш;Радко;Раимунд;Раслав;Рафал;Ритшар;Рамар;Ростек;Рейдк;Рут;Рузен;Сарк;Свитмир;Севастим;Селезт;Серфан;Сиргуш;Сиврин;Сик;Сильбар;Синор;Собит;Сулис;Счеос;Тадеуш;Тобиас;Тамор;Тимотус;Титус;Тэйтан;Фелециан;Фиренсис;Хаин;Хенрит;Хонорат;Чеслав;Элиглуз;Эмерик;Эустаx;Эгидас;Элигий;Юлек;Юрек;Юстин;Януш;Ярек;Яцек;Яценти";
		var surname_line= "Новак;Каминьский;Шиманьский;Горак;Новотный;Дворжак;Воджтеч;Джиндрич;Дузанек;Зденек;Игнас;Имрич;Каджа;Коломан;Либор;Матуш;Олдрич;Отил;Отакар;Радос;Рейдк;Рехор;Сайонек;Синек;Франтизек;Цдженк;Млинарж";
		
		var surname_line1= "Но;Ка;Ши;Гор;Но;Дво;Водж;Джин;Ду;Зде;Иг;Им;Кад;Ко;Ли;Ма;Олд;О;Ота;Ра;Рей;Ре;Са;Си;Фран;Цдже;Мли";
		var surname_line2= ";минь;мань;;вотй;;;;за;;;;;ло;;;;;;;;;йо;;ти;;";
		var surname_line3= "вак;ьский;ский;ак;ный;ржак;теч;дрич;нек;нек;нас;рич;Кжа;ман;бор;туш;рич;тил;кар;дос;йдк;хор;нек;нек;зек;нк;нарж";
				
		
		var name_start_line= "Аг;Ал;А;Ан;Аде;Ад;Ар;Ап;Ав;Баг;Бар;Бе;Бед;Бер;Бен;Би;Бо;Бра;Вав;Вак;Ва;Вац;Вас;Ве;Вдже;Ви;Виг;Вой;Вил;Вис;Вирт;Вла;Во;Га;Габ;Ге;Ге;Гри;Да;Дал;Даск;Дей;Джа;Джар;Джарк;Джин;Джи;Джо;Дит;До;Дор;Дру;Ду;Еро;Жу;За;Зи;Зоф;И;Иво;Ил;И;Ир;Ио;Ка;Кай;Ки;Клар;Кли;Кле;Ко;Кон;Кор;Ку;Крис;Кса;Ле;Лех;Лео;Лон;Люд;Лю;Мал;Ма;Мар;Мат;Мау;Мер;Ми;Мис;Мист;Над;Нас;Ни;Па;Пше;Ра;Рад;Рит;Ра;Рос;Рей;Рут;Ру;Сар;Свит;Се;Сева;Се;Сер;Сир;Сив;Сик;Силь;Си;Со;Су;Сче;Та;То;Тоби;Та;Ти;Тэй;Фе;Феле;Фи;Фирен;Ха;Хен;Хо;Чес;Э;Элиг;Эмер;Э;Эу;Ю;Юл;Юс;Я";
		var name_mid_line= "не;г;ли;лекс;ло;мас;ла;дела;ри;мад;нас;но;ро;ла;ре;у;ру;дри;не;ри;ле;е;та;раре;ри;но;ви;ли;ха;ва;о;рени;рен;ет;зи;мен;го;це;еш;е;ко;ме;зи;и;му;ва;вас;де;би;мо;ле;леци;ци;рен;но;лиг;иер;с;ги;ли;л;р;ре;ти;цен";
		var name_end_line= "шк;бет;сий;ендж;леш;лик;дж;дель;тий;ид;лаид;ан;мад;тар;шер;ност;ст;н;рон;ний;т;рим;там;ун;ат;ридж;зек;дир;дик;рт;ан;жен;лат;рит;нк;нат;нек;лав;лис;тар;т;р;м;нк;слав;цех;лент;н;ес;трим;тек;слав;ба;рат;т;рел;л;с;рис;вет;вир;лит;тор;нкт;ск;лк;мил;рк;дриск;рин;зеф;дан;хан;;куб;дж;нет;рот;фис;джи;сан;зан;шим;ан;лит;хар;вор;кон;ин;лант;вит;ус;к;жи;хан;ан;й;мир;рин;рон;сий;рим;мек;тин;лек;так;стар;рн;нил;ис;вар;тин;вар;слав;ав;шек;кад;гин;цис;тас;вер;бош;жат;рек;син;иус;тиас;зен;эуш;рин;риш;тий;ий;лин;шек;ек;лад;лен;кор;лав;тлав;тас;тис;дем;вас;тиг;мке;к;рит;дом;слав;миш;ко;мкнд;фал;шар;мар;тек;дк;зен;к;тим;лезт;фан;гуш;рин;бар;нор;бит;лис;ос;уш;биас;ас;мор;тус;тас;тан;циан;лециан;ан;сис;ренсис;ин;рит;рат;лав;луз;ик;стах;тах;гидас;дас;гий;лек;ек;к;ре;рек;ан;нуш;рек;цек;центи";
		
		var names = name_line.split(";");
		var names1 = name_start_line.split(";");
		var names2 = name_mid_line.split(";");
		var names3 = name_end_line.split(";");
		var surnames = surname_line.split(";");
		var surnames1 = surname_line1.split(";");
		var surnames2 = surname_line2.split(";");
		var surnames3 = surname_line3.split(";");
		
		names = shuffle(names);
		names1 = shuffle(names1);
		names2 = shuffle(names2);
		names3 = shuffle(names3);
		surnames = shuffle(surnames);
		
		surnames1 = shuffle(surnames1);
		surnames2 = shuffle(surnames2);
		surnames3 = shuffle(surnames3);
		
		tbl="";
		for(i=0; i<5; i++)
		{
			tbl+="<tr>"+			
				"<td>"+names1[i]+names2[i]+names3[i]+"</td>"+
				"<td>"+names[i]+"</td>"+
				"<td>"+surnames1[i]+surnames2[i]+surnames3[i]+"</td>"+
				"<td>"+surnames[i]+"</td>"+
			"</tr>";
		}
		
		out="<table>"+
			"<tr>"+
				"<th>Имя</th>"+
				"<th>Имя</th>"+
				"<th>Фамилия</th>"+
				"<th>Фамилия</th>"+
			"</tr>"+
			tbl+
		"</table>"
		return out;		
		
	}
	function dwarf_names(){
		var name_start_line= "Тор;Гри;Ур;Вол;Тар;Гур;Хал;Крел;Там;Тил;Клим;Гром;Гро;Тра;Трав;Оль;Тун;Ван;Бур;Вар;Хар;Тут;Гут;Ким;Тев;Хат";
		var name_mid_line= "кор;мэр;дот;лез;ар;лом;вар;лод;лер;мит;гор;дил;гун;тон;ков;веон;кам;рук;кин;;;";
		var name_end_line= "вин;ин;ит;ур;ил;ли;ор;ин;ис;ун;ви;вин;ри;рин;ар;хар;уин;и;ои;оин;ок";
		var surname_line= "Яростных Топоров;Подгорного Огня;Длинноусы;Грозового Утеса;Молотобойцев;Хранители Гор;Глубинных Рун;Первого Горнила;Крушащего Молота";
		
		var names1 = name_start_line.split(";");
		var names2 = name_mid_line.split(";");
		var names3 = name_end_line.split(";");
		var surnames = surname_line.split(";");
		
		names1 = shuffle(names1);
		names2 = shuffle(names2);
		names3 = shuffle(names3);
		
		surnames = shuffle(surnames);
		
		tbl="";
		for(i=0; i<5; i++)
		{
			tbl+="<tr>"+			
				"<td>"+names1[i]+names2[i]+names3[i]+"</td>"+
				"<td>"+surnames[i]+"</td>"+
			"</tr>";
		}
		
		out="<table>"+
			"<tr>"+
				"<th>Имя</th>"+
				"<th>Клан</th>"+
			"</tr>"+
			tbl+
		"</table>"
		return out;		
	}
	function north_names(){
		var name_line1= "Си;Ул;Уль;Ур;Ут;Бри;И;Ка;Кани;Ро;Се;Кти;Да;Хе;Берн;Мел;Нис;Вольф";
		var name_line2= "ги;золь;гун;кса;ве;ли;д;;;";
		var name_line3= "бор;рик;иас;та;д;гунд;гар;на;рин;рик;бор;бор;вик;нар;се";
		var surname_line= ";;;;";
		
		var names1 = name_line1.split(";");
		var names2 = name_line2.split(";");
		var names3 = name_line3.split(";");
		var surnames = surname_line.split(";");
		
		names1 = shuffle(names1);
		names2 = shuffle(names2);
		names3 = shuffle(names3);
		surnames = shuffle(surnames);
		
		tbl="";
		for(i=0; i<5; i++)
		{
			tbl+="<tr>"+			
				"<td>"+names1[i]+names2[i]+names3[i]+"</td>"+
				"<td>"+surnames[i]+"</td>"+
			"</tr>";
		}
		
		out="<table>"+
			"<tr>"+
				"<th>Имя</th>"+
				"<th>Род</th>"+
			"</tr>"+
			tbl+
		"</table>"
		return out;
	}
	function panshur_names(){
		var name_line= "Вяз;Бук;Одуванчик;Ракита;Камыш;Ива;Клен;Ежевика;Кизил;Мак;Календула;Василек;Ирис;Маргаритка;Малина;Гиацинт;Флокс;Пион;Тис;Бузульник;Кобея;Лиатрис;Лаватера;Тигридия;Амарант;Мирабилис;Гелениум;Годеция;Бругмансия;Клематис;Сальвия;Космея;Дицентра;Астильба;Анемона;Фрезия;Крокус;Гербера;Клеома;Целозия;Портулак;Агератум;Ипомея;Цинерация;Мальва;Колеус;Гортензия;Эхинацея;Настурция;Примула;Вербена;Гацания;Антирринум;Циния;Энотера;Эригерон;Пиретрум;Мускари;Купена;Бадан;Бруннера;Хоста;Береника;Медуница;Кариандр";
		var surname_line= "";
		
		var names = name_line.split(";");
		var surnames = surname_line.split(";");
		
		names = shuffle(names);
		surnames = shuffle(surnames);
		
		out="<table>"+
			"<tr>"+
				"<th>Имя</th>"+
				"<th>Прозвище</th>"+
			"</tr>"+
			"<tr>"+			
				"<td>"+names[0]+"</td>"+
				"<td>"+surnames[0]+"</td>"+
			"</tr>"+
			"<tr>"+			
				"<td>"+names[1]+"</td>"+
				"<td>"+surnames[1]+"</td>"+
			"</tr>"+
			"<tr>"+			
				"<td>"+names[2]+"</td>"+
				"<td>"+surnames[2]+"</td>"+
			"</tr>"+
			"<tr>"+			
				"<td>"+names[3]+"</td>"+
				"<td>"+surnames[3]+"</td>"+
			"</tr>"+
			"<tr>"+			
				"<td>"+names[4]+"</td>"+
				"<td>"+surnames[4]+"</td>"+
			"</tr>"+
		"</table>"
		return out;		
	}
	function bald_names(){
		var name_line1= "Мер;Джа;Са;Са;Наль;Хиль;Сол;Лус;Мис;Тем;Ди;Мар;Ма;Юн;Юно;Гес;Сат;Плу;Вен;Вем;Вел;Ур";
		var name_line2= "цел;ни;ле;;;ка;он;ти;ур;;то;ер;ан;";
		var name_line3= "ла;н;мия;ват;тиз;дар;с;ир;ис;им;;;;";
		
		var names1 = name_line1.split(";");
		var names2 = name_line2.split(";");
		var names3 = name_line3.split(";");
		
		names1 = shuffle(names1);
		names2 = shuffle(names2);
		names3 = shuffle(names3);
		
		tbl="";
		for(i=0; i<5; i++)
		{
			tbl+="<tr>"+			
				"<td>"+names1[i]+names2[i]+names3[i]+"</td>"+
				"<td>"+names1[i+4]+names2[i+4]+names3[i+4]+"</td>"+
			"</tr>";
		}
		out="<table>"+
			"<tr>"+
				"<th>Имя</th>"+
				"<th>Второе имя</th>"+
			"</tr>"+
			tbl+
		"</table>"
		return out;		
	}
	function human_names(){
		var name_line1= "Ген;Гил;Ма;Ру;Том;Тиль;Ко;Воль;Баль;Гас;Мал;Гран;Тир;Ли;Ла;Лир;Лин;Фран;Глау;Шаль;Ти;Тэ;Кри";
		var name_line2= "дал;на;ти;ли;мо;та;ти;ха;на;ра;ци;фе;та;ан;о;ор;да;;;;";
		var name_line3= "дор;рет;ас;фус;н;монт;нт;зар;пар;нар;дар;дир;эн;эрт;тон;циск;ск;рус;нар;дор;рин;ин;дарх;;;;";
		var surname_line= ";;;;";
		
		var names1 = name_line1.split(";");
		var names2 = name_line2.split(";");
		var names3 = name_line3.split(";");
		var surnames = surname_line.split(";");
		
		names1 = shuffle(names1);
		names2 = shuffle(names2);
		names3 = shuffle(names3);
		surnames = shuffle(surnames);
		
		tbl="";
		for(i=0; i<5; i++)
		{
			tbl+="<tr>"+			
				"<td>"+names1[i]+names2[i]+names3[i]+"</td>"+
				"<td>"+surnames[i]+"</td>"+
			"</tr>";
		}
		
		out="<table>"+
			"<tr>"+
				"<th>Имя</th>"+
				"<th>Фамилия</th>"+
			"</tr>"+
			tbl+
		"</table>"
		return out;
	}
	function ork_names(){
		var name_line1= "Кри;Гыр;Крат;Нир;Заг";
		var name_line2= "да;на;ту;ма;;;";
		var name_line3= "дарх;рх;тог;нар;р;рет;тар";
		var surname_line= ";;;;";
		
		var names1 = name_line1.split(";");
		var names2 = name_line2.split(";");
		var names3 = name_line3.split(";");
		var surnames = surname_line.split(";");
		
		names1 = shuffle(names1);
		names2 = shuffle(names2);
		names3 = shuffle(names3);
		surnames = shuffle(surnames);
		
		tbl="";
		for(i=0; i<5; i++)
		{
			tbl+="<tr>"+			
				"<td>"+names1[i]+names2[i]+names3[i]+"</td>"+
				"<td>"+surnames[i]+"</td>"+
			"</tr>";
		}
		
		out="<table>"+
			"<tr>"+
				"<th>Имя</th>"+
				"<th>Племяы</th>"+
			"</tr>"+
			tbl+
		"</table>"
		return out;
	}
	function elf_names(){
		var name_line1= "Гал;Ил;Эл;Им;Дар;Дал;Фин;Фе;Ле;Мит;Ми;Аэл;Аэр;Аф;Ама;Анг;Ар;Аза;Баэл;Каэл;Кал;Кас;Кор;Дае;Дре;Эил;Эр;Фера;Фи;Фис;Гаел;Гар;Гил;Ха;Ла;Ка;Кан;Кер;Кет;Кор;Ку;Лам;Лу;Маи;Мал;Мара;Му;На;Наи;Ним;Ну;Рае;Ра;Ру;Руа;Рид;Сае;Сех;Ша;Ше;Си;Сим;Сол;Сум;Сил;Та;Тиа;Тра;Ут;Вер;Вил";
		var name_line2= "ад;ид;рон;ис;ир;гол;гор;ан;и;ли;ран;аел;аер;аиас;ах;ат;ал;ам;ан;ар;ас;авел;дар;ен;ес;ил;им;кас;лоин;лиан;лис;лин;ма;мил;мус;нал;нес;нин;он;ор;от;ра;ро";
		var name_line3= "ри;ае;али;ари;аро;ел;дул;евар;фел;хал;хар;хел;ки;лан;он;куис;сан;сар;сел;спар;тае;тал;тар;ти;ван;вар;ваин;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;";
		var name_line4= "эль;ль;ан;д;сель;дир;дил;ир;вин;";
		var surname_line= ";;;;";
		
		var names1 = name_line1.split(";");
		var names2 = name_line2.split(";");
		var names3 = name_line3.split(";");
		var names4 = name_line4.split(";");
		var surnames = surname_line.split(";");
		
		names1 = shuffle(names1);
		names2 = shuffle(names2);
		names3 = shuffle(names3);
		names4 = shuffle(names4);
		surnames = shuffle(surnames);
		
		tbl="";
		for(i=0; i<5; i++)
		{
			tbl+="<tr>"+			
				"<td>"+names1[i]+names2[i]+names3[i]+names4[i]+"</td>"+
				"<td>"+surnames[i]+"</td>"+
			"</tr>";
		}
		
		out="<table>"+
			"<tr>"+
				"<th>Имя</th>"+
				"<th>Семья</th>"+
			"</tr>"+
			tbl+
		"</table>"
		return out;
	}
	// / names
	
	$("body").on("click", "#go", function(){
		var type=$("#type").val();
		names(type);
	});
	make_generator();
}); 
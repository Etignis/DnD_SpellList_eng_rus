<div class='s_block'>
	<a href="/" class="bt"><i class="fa fa-home"></i></a>
	<a href="/message/?theme=dndspells" class="bt" target='_blanc'>Написать отзыв или предложение</a>
	<a href="#" class="bt" id='info'><i class="fa fa-question-circle"></i></a>
</div>

<div class='s_block'>
	<span class='s_zero'>Класс:</span> <select class='s_class s_sp'>
		<option value="0" selected="">ВСЕ</option>
		<option value="2">Bard</option>
		<option value="3">Cleric</option>
		<option value="4">Druid</option>
		<option value="5">Paladin</option>
		<option value="6">Ranger</option>
		<option value="8">Sorcerer</option>
		<option value="7">Warlock</option>
		<option value="1">Wizard</option>
	</select>
</div>
<div class='s_block'>
	<!--small-->
		<span class='level_zero'>Уровень</span>
		с <select class="s_levfrom">
			<option value="0" selected="">0</option>
			<option value="1">1</option>
			<option value="2">2</option>
			<option value="3">3</option>
			<option value="4">4</option>
			<option value="5">5</option>
			<option value="6">6</option>
			<option value="7">7</option>
			<option value="8">8</option>
			<option value="9">9</option>
		</select> по 
		<select class="s_levto">
			<option value="0">0</option>
			<option value="1">1</option>
			<option value="2">2</option>
			<option value="3">3</option>
			<option value="4">4</option>
			<option value="5">5</option>
			<option value="6">6</option>
			<option value="7">7</option>
			<option value="8">8</option>
			<option value="9" selected="">9</option>
		</select>
	<!--/small-->
</div>
<div class='s_block flt'>
	<span class='n_zero'>Класс:</span>
	<input type='text' class='f_class s_sp'>
</div>
<div class='s_block flt'>
	<span class='n_zero'>Название:</span>
	<input type='text' class='f_name s_sp'>
</div>
<div class='s_block flt'>
	<span class='n_zero'>Уровень:</span>
	<input type='text' class='f_level s_sp'>	
</div>
<div class='s_block flt'>
	<span class='n_zero'>Школа:</span>
	<input type='text' class='f_school s_sp'>	
</div>
<div class='s_block flt'>
	Язык:
	<input type='radio' name='r_lang' id='r_all' data-val='all' checked value='all'><label for='r_all' class='r_'>Все</label>
	<input type='radio' name='r_lang' id='r_en' data-val='en' value='en'><label for='r_en' class='r_en'>Eng</label>
	<input type='radio' name='r_lang' id='r_ru' data-val='ru' value='ru'><label for='r_ru' class='r_ru'>Рус</label>
	<!--button class='btn f_l_all'>ALL</button>
	<button class='btn f_l_en'>EN</button>
	<button class='btn f_l_ru'>RU</button-->
</div>
<div class='s_block flt'>
	<button class='btn f_hide_all inline-block' title='Скрыть все из отображаемых в данный момент заклинаний'>Скрыть все</button>
	<button class='btn f_show_all inline-block' title='Показать все скрытые заклинания'>Показать все</button>
</div>
<div class='s_block flt'>	
	<button class='btn f_card_thin inline-block' title='Сузить карточки'>Уже</button>
	<button class='btn f_card_wide inline-block' title='Расширить карточки'>Шире</button>
	<button class='btn f_card_norm inline-block' title='Ширина по умолчанию'>По умолчанию</button>	
</div>
<div class='s_block flt hidden_spells'>

</div>
<div class='s_block flt block' style='text-align: left; font-size: 95%'>
	
		По умолчанию представленны все заклинания всех классов на двух языках.
	
</div> 
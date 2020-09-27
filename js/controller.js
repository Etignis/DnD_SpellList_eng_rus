var fCtrlIsPressed = false;

function randd(min, max) {
  return Math.floor(arguments.length > 1 ? (max - min + 1) * Math.random() + min : (min + 1) * Math.random());
};

function isDebug(){
	if(window.location.href.toLowerCase().indexOf('debug=true')>-1) {
		return true;
	}
	return false;
}
function isIos(){
	if(window.location.href.toLowerCase().indexOf('ios=true')>-1) {
		return true;
	}
	
	if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
		return true;
	}
	
  var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ];

  if (!!navigator.platform) {
    while (iDevices.length) {
      if (navigator.platform === iDevices.pop()){ return true; }
    }
  }

  return false;
}

Vue.component('modalWin', {
	props: {
		title: {
			type: String,
			default: ""
		},
		content: {
			type: String,
			default: ""
		}
	},
	data: function(){
		return {
			
		};
	},
	methods: {
		close: function(){
			this.$emit('close');
		}
	},
	computed: {
		
	},

	template: `<div class="mod_win_wrapper" style='background: rgba(0, 0, 0, 0.7);' @click="close" @scroll.stop>
	<div class="mod_win">
		<span class="bCloseInfoWin" @click="close">×</span>
		<div class="mod_win_content" v-html="content">
		</div>	
	</div>
</div>`
});

Vue.component('searchfield', {
	props: {
		id: {
			type: String,
			default: ""
		},
		title: {
			type: String,
			default: ""
		},
		value: {
			type: String,
			default: ""
		},
		ios: {
			type: Boolean,
			default: false
		}
	},
	data: function(){
		return {};
	},
	methods: {
		input: function(oEvent){
			this.$emit('input', oEvent.target.value);
		},
		clear: function(){
			this.$emit('input', "");
		},
		random: function(){
			this.$emit('searchrndom');
		}
	},
	computed: {
		innerId: function(){
			return "sf_"+this.id;
		}
	},

	template: `<div :id="id">
	<label class='filterLabel' :for="innerId">{{title}}</label>
	<div style="display: flex">
		<div class="customInput">
			<textarea v-if="ios" :id="innerId"  @input="input" rows=1 style="width:100%; height: 3rem; font-size:110%">{{value}}</textarea>
			<input v-else :id="innerId" type="text" :value='value' @input="input">
			<span class="cross" @click="clear"></span>
		</div>
		<a href="#random" class="bt flexChild" id="bRandom" title="Случайное заклинание" @click.stop="random">🎲</a>
	</div>
</div>`
});

Vue.component('check-button', {
	props: {
		id: {
			type: String,
			default: ""
		},
		title: {
			type: String,
			default: ""
		},
		tooltip: {
			type: String,
			default: ""
		},
		checked: {
			type: Boolean,
			default: false
		}
	},
	data: function(){
		return {};
	},
	methods: {
		press: function(oEvent){
			this.$emit('press');
		}
	},
	computed: {
		innerId: function(){
			return "chb_"+this.id;
		},
		value: function(){
			return this.checked? "checked='checked'" : "";
		}
	},

	template: `<div :id="id" class="customCheckbox" @click.stop="press" :title="tooltip">
	<input type="checkbox" :id="innerId" :checked="checked">
	<span class="label">{{title}}</span>
</div>`
});

Vue.component('hiddenitem', {
	props: {
		id: {
			type: String,
			default: ""
		},
		title: {
			type: String,
			default: ""
		},
		tooltip: {
			type: String,
			default: ""
		}
	},
	data: function(){
		return {};
	},
	methods: {
		unhide: function(oEvent){
			this.$emit('unhide', oEvent);
		}
	},
	computed: {
	
	},

	template: `<a href='#' @click.stop="unhide">{{title}} ({{tooltip}})</a>`
});


Vue.component('comboboxItem', {
	props: {
		val: {
			type: String,
			default: '0'
		},
		title: {
			type: String,
			default: ""
		},
		checked: {
			type: Boolean,
			default: false
		}
	},
	data: function(){
		return {};
	},
	methods: {
		labelClick: function(oEvent){
			this.$emit('lclick', this.val);
		}
	},
	computed: {
		id: function(){
			return "ch_"+this.val;
		}
	},
	created: function(){
		
	},
	template: `<div>
	<input type="checkbox" :value="val" :id="id" :checked="checked">
	<label data-hierarchy="root" v-html="title" @click="labelClick"></label>
</div>`
});

Vue.component('combobox', {
	props: {
		value: {
			type: String,
			default: '0'
		},
		id: {
			type: String,
			default: ""
		},
		title: {
			type: String,
			default: "#7986CB"
		},
		items: {
			type: Array,
			default: []
		},
		opened: {
			type: Boolean,
			default: false
		}
	},
	data: function(){
		return {
			open: null
		};
	},
	computed: {
		isOpen: function(){
			return (this.open!=null)?this.open : this.opened || false;
		}
	},
	methods: {
		toggle: function(oEvent, bStat){
			this.open = (bStat!=undefined)? bStat : !this.open;
			let el = $("#"+this.id).find(".combo_box_content");
			if(this.open) {
				el.slideDown(400, function(){
					this.$emit('opened', true);
				}.bind(this));				
			} else {
				el.slideUp(400, function(){
					this.$emit('opened', false);
				}.bind(this));
			}
		},
		itemclick: function(oEvent){
			this.$emit('iclick', oEvent);
		}
	},
	mounted: function(){
		if(!this.isOpen){
			let el = $("#"+this.id).find(".combo_box_content");
			el.hide();
		}
	},
	template: `<div :id="id" class="combo_box" :data-text="title" >
	<div class="combo_box_title" @click="toggle">{{title}}</div>
		<div class="combo_box_content">
			<comboboxItem v-for="item in items"
				:key="item.key"
				:val="item.key"
				:checked="item.checked"
				:title="item.title"
				@lclick="itemclick"
			>
			</comboboxItem>
		</div>
	<div class="combo_box_arrow" @click="toggle">
		<span class="arr_down" v-show="!isOpen">
			<i class="fa fa-arrow-down"></i>
		</span>
		<span class="arr_up" v-show="isOpen">
			<i class="fa fa-arrow-up"></i>
		</span>
	</div>
</div>`
});

Vue.component('custom-select', {
	props: {
		selected: {
			type: String,
			default: ''
		},
		id: {
			type: String,
			default: ""
		},
		title: {
			type: String,
			default: ""
		},
		items: {
			type: Array,
			default: []
		},
		bOpen: {
			type: Boolean,
			default: false
		}
	},
	data: function(){
		return {
			open: null
		};
	},
	computed: {
		isOpen: function(){
			return (this.open!=null)?this.open : this.bOpen || false;
		}
	},
	methods: {
		toggle: function(){
			this.open = !this.open;
			let el = $("#"+this.id).find(".list");
			if(this.open) {
				el.slideDown(200);
			} else {
				el.slideUp(300);
			}
		},
		itemclick: function(sKey){ 
			this.toggle();
			this.$emit('iclick', sKey);
		}
	},
	mounted: function(){
		if(!this.isOpen){
			let el = $("#"+this.id).find(".combo_box_content");
			el.hide();
		}
	},
	template: `<div :id="id">
	<label class='filterLabel' v-if="title.length>0">{{title}}</label>
	<div  class="customSelect" @click="toggle">
		<div class="label">{{selected}}</div>
		<ul class="list" style="display: none;">
			<li 
				v-for="item in items"
				:key="item.key"
				class="option"
				v-html="item.title" 
				@click.stop="itemclick(item.key)"
				></li>
		</ul>
	</div>
</div>`
});

Vue.component('card', {
	props: {
		name: {
			type: String,
			default: ""
		},
		tooltip: {
			type: String,
			default: ""
		},
		id: {
			type: String,
			default: ""
		},
		castingTimeTitle: {
			type: String,
			default: "Casting time"
		},
		castingTime: {
			type: String,
			default: ""
		},
		rangeTitle: {
			type: String,
			default: "Range"
		},
		range: {
			type: String,
			default: ""
		},
		componentsTitle: {
			type: String,
			default: "Components"
		},
		components: {
			type: String,
			default: ""
		},
		durationTitle: {
			type: String,
			default: "Duration"
		},
		duration: {
			type: String,
			default: ""
		},
		materials: {
			type: String,
			default: ""
		}, 
		text: {
			type: String,
			default: ""
		},
		className: {
			type: String,
			default: ""
		},
		level: {
			type: String,
			default: ""
		},
		school: {
			type: String,
			default: ""
		},
		src: {
			type: String,
			default: ""
		},
		source: {
			type: String,
			default: ""
		},
		ritual: {
			type: String,
			default: ""
		},
		color: {
			type: String,
			default: ""
		},
		view: {
			type: String,
			default: "card"
		},
		selected: {
			type: Boolean,
			default: false
		},
		locked: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			default: ""
		},
		pre: {
			type: String,
			default: ""
		},
		editable: {
			type: Boolean,
			default: false
		}
	},
	data: function(){
		return {
			//mainClass: "cardContainer",
			viewClass: "cardView",
			textSize: "",
			cardWidth: ""
		};
	},
	computed: {
		mainClass: function(){
			return (this.view == "card")? "cardContainer" : "textCardContainer";
		},
		srcTitle: function(){
			return "Источник: "+ this.source;
		},
		materialsLine: function(){
			return this.materials? "("+this.materials+")" : "";
		},
		cardView: function(){
			return (this.view == "card")? true: false;
		},
		typeClass: function(){
			let sClass = this.color.toLowerCase();
			switch(sClass) {
				case "skill proficiency": sClass = "skill"; break;
				case "tool proficiency": sClass = "tool"; break;
				case "world-specific": sClass = "world"; break;
			}
			return sClass;
		},
		selectedClass: function(){
			return this.selected? "selected" : "";
		},
		colorClass: function(){
			return this.color? this.color: "";			
		},
		preparedText: function(){
			return this.text? this.text.split(/<br>/g).map(el=> "<p>"+el+"</p>").join("") : "";
		},
		ItemCard: function(){
			return "spellCard";
		},
		prerequisite: function(){
			return this.pre.length>0? "<span title='Требования необходимые для возможности получения заклинания'>["+this.pre+"]</span>": "";
		},
		ritualMark: function(){
			return this.ritual? "("+this.ritual+") " : "";
		},
		
		textSizeStyle: function(){
			return this.textSize? "font-size: "+this.textSize+"px": "";
		},
		cardWidthStyle: function(){
			return (this.cardWidth>0 && this.cardView) ? "width: "+this.cardWidth+"px": "";
		},
		
		editableButtons: function() {
			return this.editable? "": "display: none";
		}
	},
	mounted: function(){
		let oText = this.$refs.itemText;		
		let styleText = window.getComputedStyle(oText, null).getPropertyValue('font-size');
		this.textSize= parseFloat(styleText); 
		
		
		let oContainer = this.$refs.cardContainer;	
		let styleContainer = window.getComputedStyle(oContainer, null).getPropertyValue('width');
		this.cardWidth= parseFloat(styleContainer); 
	},
	methods: {
		lock: function(oEvent){
			this.$emit('lock', oEvent);
		},
		unlock: function(oEvent){
			this.$emit('unlock', oEvent);
		},
		hide: function(oEvent){
			this.$emit('hide', oEvent);
		},
		select: function(oEvent){
			this.$emit('select', oEvent);
			return false;
		},
		
		onTextMin: function(){
			this.textSize--;
		},
		onTextMax: function(){
			this.textSize++;
		},
		
		onTextCancel: function(){
			this.$emit('cancel', {id: this.id});
		},
		onTextSave: function(oEvent){
			let oEl = this.$refs.itemText;		
			let sText = oEl.innerHTML;
			this.$emit('input', {id: this.id, text: sText});
		},
		
		autosizeText: function() {
			let oEl = this.$refs.itemText;		
			let style = window.getComputedStyle(oEl, null).getPropertyValue('scrollWidth');
			
			if (this.textSize > 7 && oEl.scrollHeight > oEl.offsetHeight) {
				this.textSize-=0.3;
				return true;
			} else {
				return false;
			}
			
		},
		onCardWidthMax: function() {
			this.cardWidth+=10;
		},
		onCardWidthMin: function() {
			this.cardWidth-=10;			
		},
		setCardWidth: function(nWidth) {
			this.cardWidth = nWidth;
		}
	},

	template: `<div :class="[mainClass, viewClass, colorClass]" @click.ctrl="select" v-on:dblclick.stop="select" ref="cardContainer" :style="cardWidthStyle">
				<div :class='[ItemCard, selectedClass]' v-if="cardView" >
					<div class="content">
						<span v-show="locked" class="bUnlockItem" title="Открепить обратно" @click.stop="unlock"><i class="fa fa-unlock-alt" aria-hidden="true"></i></span>
						<span v-show="!locked" class="bLockItem" title="Закорепить заклинание (не будут действовать фильтры)" @click.stop="lock"><i class="fa fa-lock" aria-hidden="true"></i></span>
						<span class="bHideItem" title="Скрыть заклинание (будет внизу панели фильтров)" @click.stop="hide"><i class="fa fa-eye-slash" aria-hidden="true"></i></span>
						<h1 :title="tooltip" :contenteditable="editable">{{name}} {{ritualMark}}</h1>
						<div class="row">
							<div class="cell castingTime" :contenteditable="editable">
								<b>{{castingTimeTitle}}</b>
								<span>{{castingTime}}</span>
							</div>
							<div class="cell range" :contenteditable="editable">
								<b>{{rangeTitle}}</b>
								<span>{{range}}</span>
							</div>
						</div>
						<div class="row">
							<div class="cell components" :contenteditable="editable">
								<b>{{componentsTitle}}</b>
								<span>{{components}}</span>
							</div>
							<div class="cell duration" :contenteditable="editable">
								<b>{{durationTitle}}</b>
								<span>{{duration}}</span>
							</div>
						</div>
						<div class="materials" :contenteditable="editable">{{materials}}</div>
						<div class="text" v-html="preparedText" :style="textSizeStyle" ref="itemText" :contenteditable="editable">
						</div>
						
						<div class="sizeButtonsContainer noprint">
							<span class="textMin itemButton" title="Уменьшить размер текста" @click.stop='onTextMin'>–</span>
							
							<span class="textCancel itemButton" title="Отменить" @click.stop='onTextCancel' :style="editableButtons">✖</span>
							<span class="textSave itemButton" title="Сохранить" @click.stop='onTextSave' :style="editableButtons">✔</span>
							
							<span class="textMax itemButton" title="Увеличить размер текста" @click.stop='onTextMax'>+</span>
						</div>
						<b class="class">{{className}}</b>
						<b class="school">{{level}}, {{school}} <span :title="srcTitle">({{src}})</span></b>
					</div>
				</div>
				
				<div class="inner" v-if="!cardView">
					<span v-show="locked" class="bUnlockItem noprint" title="Открепить обратно" @click.stop="unlock"><i class="fa fa-unlock-alt" aria-hidden="true"></i></span>
					<span v-show="!locked" class="bLockItem noprint" title="Закорепить заклинание (не будут действовать фильтры)" @click.stop="lock"><i class="fa fa-lock" aria-hidden="true"></i></span>
					<span class="bHideItem noprint" title="Скрыть заклинание (будет внизу панели фильтров)" @click.stop="hide"><i class="fa fa-eye-slash" aria-hidden="true"></i></span>
					<div class="flex">
						<div class="flex column primal">
							<h1 :title="tooltip" :contenteditable="editable">{{name}}</h1>          
							<div class="second_name" :contenteditable="editable">[{{tooltip}}]</div>
							<div class="school_level" :contenteditable="editable">{{level}}, {{school}} {{ritualMark}}</div>
						</div>
						<div class="flex secondal">
							<div class="column thirdal">
								<div class="cvasi_row"><div class="subtitle" :contenteditable="editable">{{castingTimeTitle}}</div> <div>{{castingTime}}</div></div>   
								<div class="cvasi_row"><div class="subtitle" :contenteditable="editable">{{rangeTitle}}</div> <div>{{range}}</div></div>           
							</div>
							<div class="column thirdal">              
								<div class="cvasi_row"><div class="subtitle" :contenteditable="editable">{{componentsTitle}}</div> <div>{{components}} {{materials?"*":""}}</div></div> 
								<div class="cvasi_row"><div class="subtitle" :contenteditable="editable">{{durationTitle}}</div> <div>{{duration}}</div></div>       
							</div> 
						</div>
					</div>
					<div class="sizeButtonsContainer noprint">
							
							<span></span>
							<span class="textCancel noprint itemButton" title="Отменить" @click.stop='onTextCancel' :style="editableButtons" >✖</span>
							<span class="textSave noprint itemButton" title="Сохранить" @click.stop='onTextSave' :style="editableButtons" >✔</span>
							<span></span>
					</div>
          <div class="text" v-html="preparedText" :contenteditable="editable" ref="itemText"></div> 
          <div class="material_components" :contenteditable="editable">{{materialsLine}}</div>
					<div class="source" :title="srcTitle">({{src}})</div>
        </div>
			</div>`
});
	
Vue.component('hiddenitem', {
	props: {
		id: {
			type: String,
			default: ""
		},
		title: {
			type: String,
			default: ""
		},
		tooltip: {
			type: String,
			default: ""
		}
	},
	data: function(){
		return {};
	},
	methods: {
		unhide: function(oEvent){
			this.$emit('unhide', oEvent);
		}
	},
	computed: {
	
	},

	template: `<a href='#' @click.stop="unhide">{{title}} ({{tooltip}})</a>`
});	
	
  var app = new Vue({
    el: '#app',
    data: {
			aSources: sourceList,
			aSchools: schoolList,
			aCastingTime: {"1 action":{"checked":false,"visible":true,"text":{"en":{"title":"1 action"},"ru":{"title":"1 действие"}}},"1 minute":{"checked":false,"visible":true,"text":{"en":{"title":"1 minute"},"ru":{"title":"1 минута"}}},"1 bonus action":{"checked":false,"visible":true,"text":{"en":{"title":"1 bonus action"},"ru":{"title":"1 бонусное действие"}}},"1 reaction":{"checked":false,"visible":true,"text":{"en":{"title":"1 reaction"},"ru":{"title":"1 реакция"}}},"1 hour":{"checked":false,"visible":true,"text":{"en":{"title":"1 hour"},"ru":{"title":"1 час"}}},"10 minutes":{"checked":false,"visible":true,"text":{"en":{"title":"10 minutes"},"ru":{"title":"10 минут"}}},"12 hours":{"checked":false,"visible":true,"text":{"en":{"title":"12 hours"},"ru":{"title":"12 hours"}}},"1 action or 8 hours":{"checked":false,"visible":true,"text":{"en":{"title":"1 action or 8 hours"},"ru":{"title":"1 действие или 8 часов"}}},"8 hours":{"checked":false,"visible":true,"text":{"en":{"title":"8 hours"},"ru":{"title":"8 часов"}}},"24 hours":{"checked":false,"visible":true,"text":{"en":{"title":"24 hours"},"ru":{"title":"24 часа"}}},"1 reaction, which you take when a humanoid you can see within 60 feet of you dies":{"checked":false,"visible":true,"text":{"en":{"title":"1 reaction, which you take when a humanoid you can see within 60 feet of you dies"},"ru":{"title":"1 реакция"}}}},
			aLanguages: oLanguages,
			aViews: oView,
			aSort: oSort,
			aItems: allSpells,
			oClassSpells: classSpells,
			sLang: "ru",
			sView: "card",
			sSort: "levelAlpha",
			sClass: "",
			sSubClass: "",
			sSubSubClass: "",
			sSearch: "",
			aLevels: [0,1,2,3,4,5,6,7,8,9],
			sLevelStartSelected: "0",
			sLevelEndSelected: "9",
			nLevelStart: 0,
			nLevelEnd: 9,
			
			aHiddenItems: [],
			aLockedItems: [],
			aSelectedItems: [],
			aSelectedLockedItems: [],
			sTextSizeDefault: "",
			sCardwidth: "",
			sCardWidthDefault: "2.5in",
			
			oConfig: {},
			bSchoolsOpend: false,			
			bSourcesOpend: false,	
			bCastingTimeOpend: false,			
			bCardsAreVisible: false,	
			bAppIsReady: false,	
			bRitualOnly: false,
			bAllClassSpells: false,
			bEditMode: false,
			
			bModalWinShow: false,
			sModalWinCont: "",
			
			bDebug: false,
			
			bIos: false
    },

		computed: {
			sOtherLang: function(){
				return (this.sLang=="ru")? "en": "ru";
			},
			aSrcList: function(){
				let a=[];
				for (var key in this.aSources){
					if(this.aSources[key].visible !== false){
						a.push({
							key: key,
							title: this.aSources[key].text.en.title + "<br>" + this.aSources[key].text.ru.title,
							checked: this.aSources[key].checked
						});
					}
				}
				return a;
			},
			aCastingTimeList: function() {
				// collect Casting Time
				//if(!this.aCastingTime){
				// if(Object.entries(this.aCastingTime).length === 0){
					// this.collectCastingTime();
				// }
				
				let a=[];
				for (var key in this.aCastingTime){
					if(this.aCastingTime[key].visible !== false){
						a.push({
							key: key,
							title: this.aCastingTime[key].text.en.title + "<br>" + this.aCastingTime[key].text.ru.title,
							checked: this.aCastingTime[key].checked
						});
					}
				}
				return a;
				
			},
			
			aSrcSelected: function(){
				let aFiltered = this.aSrcList.filter(item => item.checked);
				return (aFiltered.length>0)? aFiltered.map(item => item.key) : this.aSrcList.map(item => item.key);
			},
			
			aSchoolList: function(){
				let a=[];
				let i=0;
				for (var key in this.aSchools){
					if(this.aSchools[key].visible !== false){
						this.aSchools[key].i = i++;
						a.push({
							key: key,
							title: this.aSchools[key].text.en.title + "<br>" + this.aSchools[key].text.ru.title,
							checked: this.aSchools[key].checked
						});
					}
				}
				return a;
			},
			
			aSchoolSelected: function(){
				let aFiltered = this.aSchoolList.filter(item => item.checked);
				return (aFiltered.length>0)? aFiltered.map(item => item.key.toLowerCase()) : this.aSchoolList.map(item => item.key.toLowerCase());
			},
			
			aCastingTimeSelected: function(){
				let aFiltered = this.aCastingTimeList.filter(item => item.checked);
				return (aFiltered.length>0)? aFiltered.map(item => item.key.toLowerCase()) : [];/*this.aCastingTimeList.map(item => item.key.toLowerCase());*/
			},

			aLanguageList: function(){
				let a=[];
				for (var key in this.aLanguages){
					if(this.aLanguages[key].visible !== false){
						a.push({
							key: key,
							title: this.aLanguages[key].text[this.sLang].title
						});
					}
				}
				return a;
			},
			
			sLangSelected: function(){
				return this.aLanguages[this.sLang].text[this.sLang].title;
			},
			
			aViewList: function(){
				let a=[];
				for (var key in this.aViews){
					if(this.aViews[key].visible !== false){
						a.push({
							key: key,
							title: this.aViews[key].text[this.sLang].title
						});
					}
				}
				return a;
			},
			
			sViewSelected: function(){
				return this.aViews[this.sView].text[this.sLang].title;
			},
			/**/
			aSortList: function(){
				let a=[];
				for (var key in this.aSort){
					if(this.aSort[key].visible !== false){
						a.push({
							key: key,
							title: this.aSort[key].text[this.sLang].title
						});
					}
				}
				return a;
			},
			
			sSortSelected: function(){
				if(!(this.aSort[this.sSort])) {
					this.sSort = Object.keys(this.aSort)[0];
				}
				return this.aSort[this.sSort].text[this.sLang].title;
			},
			/**/
			
			aClassList: function(){
				let aSclasses = [{key: "", title: "[ВСЕ]"}];
				for (let key in this.oClassSpells) {
					let sTitle = (this.oClassSpells[key].title.en.text || this.oClassSpells[key].title.en) + "<br>" + (this.oClassSpells[key].title.ru.text || this.oClassSpells[key].title.ru);
					aSclasses.push({
						key: key,
						title: sTitle
					});
				}
				
				return aSclasses;
			},
			aSubClassList: function(){
				let aSclasses = [{key: "", title: "[ПОДКЛАСС]"}];
				if(this.sClass && this.oClassSpells[this.sClass].subclasses){
					for (let key in this.oClassSpells[this.sClass].subclasses) {
						let sTitle = "";
						if(this.oClassSpells[this.sClass].subclasses[key].title.en.text) {
							sTitle+=this.oClassSpells[this.sClass].subclasses[key].title.en.text;
						} else {
							sTitle+=this.oClassSpells[this.sClass].subclasses[key].title.en;
						}
						if(this.oClassSpells[this.sClass].subclasses[key].title.en.source) {
							sTitle+=" ("+this.oClassSpells[this.sClass].subclasses[key].title.en.source+")";
						}
						sTitle+="<br>";
						
						if(this.oClassSpells[this.sClass].subclasses[key].title.ru.text) {
							sTitle+=this.oClassSpells[this.sClass].subclasses[key].title.ru.text;
						} else {
							sTitle+=this.oClassSpells[this.sClass].subclasses[key].title.ru;
						}

						aSclasses.push({
							key: key,
							title: sTitle//this.oClassSpells[this.sClass].subclasses[key].title.en + "<br>" + this.oClassSpells[this.sClass].subclasses[key].title.ru
						});
					}
				}
				
				return aSclasses;
			},
			
			aSubSubClassList: function(){
				let aSclasses = [{key: "", title: "[ПОДПОДКЛАСС]"}];
				if(this.sClass && this.oClassSpells[this.sClass].subclasses && this.sSubClass && this.oClassSpells[this.sClass].subclasses[this.sSubClass].subclasses){
					for (let key in this.oClassSpells[this.sClass].subclasses[this.sSubClass].subclasses) {
						let sTitle = (this.oClassSpells[this.sClass].subclasses[this.sSubClass].subclasses[key].title.en.text || this.oClassSpells[this.sClass].subclasses[this.sSubClass].subclasses[key].title.en) + "<br>" + (this.oClassSpells[this.sClass].subclasses[this.sSubClass].subclasses[key].title.ru.text || this.oClassSpells[this.sClass].subclasses[this.sSubClass].subclasses[key].title.ru);
					
						aSclasses.push({
							key: key,
							title: sTitle//this.oClassSpells[this.sClass].subclasses[this.sSubClass].subclasses[key].title.en + "<br>" + this.oClassSpells[this.sClass].subclasses[this.sSubClass].subclasses[key].title.ru
						});
					}
				}
				
				return aSclasses;
			},
			
			sClassSelected: function(){
				return this.sClass? this.oClassSpells[this.sClass].title[this.sLang] : "[ВСЕ]";
			},
			sSubClassSelected: function(){
				return this.sSubClass? this.oClassSpells[this.sClass].subclasses[this.sSubClass].title[this.sLang] : "[ПОДКЛАСС]";
			},
			sSubSubClassSelected: function(){
				return (this.sSubClass && this.sSubSubClass)? this.oClassSpells[this.sClass].subclasses[this.sSubClass].subclasses[this.sSubSubClass].title[this.sLang] : "[ПОДПОДКЛАСС]";
			},
			
			aLevelList: function(){
				return this.aLevels.map(item => ({
					key: item,
					title: item
				}))
			},
			
			sNameInput: function(){
				return this.sSearch.toLowerCase();
			},
			
			
			sClassTitle: function(){
				return this.sClass? this.oClassSpells[this.sClass].title[this.sLang]: "";
			},
			
			aClassSpells: function(){
				let aSpells = [];
				if(this.sClass !="") {
					if(this.bAllClassSpells) {
						aSpells = aSpells.concat(this.oClassSpells[this.sClass].spells);
						
						for(let subclass in this.oClassSpells[this.sClass].subclasses) {
							if(this.oClassSpells[this.sClass].subclasses[subclass].spells){
								aSpells = aSpells.concat(this.oClassSpells[this.sClass].subclasses[subclass].spells);
							}
							
							for (let subsubclass in this.oClassSpells[this.sClass].subclasses[subclass].subclasses) {
								if(this.oClassSpells[this.sClass].subclasses[subclass].subclasses[subsubclass].spells){
									aSpells = aSpells.concat(this.oClassSpells[this.sClass].subclasses[subclass].subclasses[subsubclass].spells);
								}
							}
						}
					} else {
						//aClassSpellList = this.oClassSpells.sClass
						aSpells = aSpells.concat(this.oClassSpells[this.sClass].spells);
						if(this.oClassSpells[this.sClass].subclasses && this.sSubClass && this.oClassSpells[this.sClass].subclasses[this.sSubClass]) {
							if(this.oClassSpells[this.sClass].subclasses[this.sSubClass].spells)
								aSpells = aSpells.concat(this.oClassSpells[this.sClass].subclasses[this.sSubClass].spells);
							if(this.oClassSpells[this.sClass].subclasses[this.sSubClass].subclasses && this.sSubSubClass && this.oClassSpells[this.sClass].subclasses[this.sSubClass].subclasses[this.sSubSubClass]) {
								aSpells = aSpells.concat(this.oClassSpells[this.sClass].subclasses[this.sSubClass].subclasses[this.sSubSubClass].spells);
							}
						}
					}	
					aSpells = this.aItems.filter(el => (aSpells.map(el=> el.toLowerCase().replace(/\s+/g, "")).indexOf(el.en.name.toLowerCase().replace(/\s+/g, ""))>-1));
				} else {
					aSpells = this.aItems
				}
				
				return aSpells;
			},
			
			aItemsList: function(){				
				let aFiltered = /*/this.aItems/**/ this.aClassSpells.filter(function(oItem){
					return (
						this.aSrcSelected.filter(value => -1 !== oItem.en.source.split(",").map(item => item.trim()).indexOf(value)).length &&
						//this.aSrcSelected.indexOf(oItem.en.source)>-1 && // old filter for sources
						this.aSchoolSelected.indexOf(oItem.en.school.toLowerCase().trim())>-1 /**/&& 
						(
							this.aCastingTimeSelected.length==0 || 
							this.aCastingTimeSelected.indexOf(oItem.en.castingTime.toLowerCase().trim())>-1 
						)
						&& 
						(
							oItem.en.name.toLowerCase().indexOf(this.sNameInput)>-1 || 
							oItem.ru.name.toLowerCase().indexOf(this.sNameInput)>-1 || 
							oItem.ru.nic && oItem.ru.nic.toLowerCase().indexOf(this.sNameInput)>-1
						)
						&&
						(this.bRitualOnly && oItem.en.ritual || !this.bRitualOnly) &&
						this.aHiddenItems.indexOf(oItem.en.name)<0/**/  &&
						this.nLevelStart <= this.nLevelEnd &&
						this.nLevelStart <= Number(oItem.en.level) &&
						this.nLevelEnd >= Number(oItem.en.level)
					) 
				}.bind(this));
				
				return aFiltered.map(function(oItem){
					let sSrc = oItem.en.source.split(",").map(item => this.aSources[item.trim()].text[this.sLang].title).join(", ");
					let o={
						"id": oItem.en.name,
						"name": oItem[this.sLang].name || oItem.en.name,
						"tooltip": oItem[this.sOtherLang].name || oItem.en.name,
						"text": oItem[this.sLang].text || oItem.en.text,
						"src": oItem[this.sLang].source || oItem.en.source,
						"className": this.sClassTitle,
						"source": sSrc /*this.aSources[oItem.en.source].text[this.sLang].title*/,
						"school": this.aSchools[oItem.en.school.trim()].text[this.sLang].title,
						"level": oLevelsText[oItem.en.level]? oLevelsText[oItem.en.level].text[this.sLang].title : oItem.en.level + " " + oLevelsText.units[this.sLang].title,
						"castingTime": oItem[this.sLang].castingTime || oItem.en.castingTime,
						"range": oItem[this.sLang].range || oItem.en.range,
						"components": oItem[this.sLang].components || oItem.en.components,
						"materials": oItem[this.sLang].materials || oItem.en.materials,
						"duration": oItem[this.sLang].duration || oItem.en.duration,
						"ritual": oItem.en.ritual? oDict.ritual[this.sLang].title: "",		

						"castingTimeTitle": oDict.castingTime[this.sLang].title,
						"durationTitle": oDict.duration[this.sLang].title,
						"rangeTitle": oDict.range[this.sLang].title,
						"componentsTitle": oDict.components[this.sLang].title,
						
						"levelNum": oItem.en.level,
						"color": this.sClass,
						"view": this.sView,
						"locked": this.aLockedItems.indexOf(oItem.en.name)>-1,
						"selected": this.aSelectedItems.indexOf(oItem.en.name)>-1,
						
						"editable": this.bEditMode
					};
					if(oItem[this.sLang].pre || oItem.en.pre) {
						o.pre = oItem[this.sLang].pre || oItem.en.pre;
					}
					return o;
				}.bind(this)).sort(function(a, b){
					if(this.sSort == "alpha") {
						if (a.name.toLowerCase().trim() < b.name.toLowerCase().trim())
							return -1;
						if (a.name.toLowerCase().trim() > b.name.toLowerCase().trim())
							return 1;						
						return 0
					} else {
						if (a.levelNum+a.name.toLowerCase().trim() < b.levelNum+b.name.toLowerCase().trim() )
							return -1;
						if (a.levelNum+a.name.toLowerCase().trim() > b.levelNum+b.name.toLowerCase().trim() )
							return 1;
						return 0
					}
				}.bind(this));
			},
			
			aLockedItemsList: function(){
				let aFiltered = this.aItems.filter(function(oItem){
					return 	this.aLockedItems.indexOf(oItem.en.name)>-1
				}.bind(this));
				return aFiltered.map(function(oItem){
					let sSrc = oItem.en.source.split(",").map(item => this.aSources[item.trim()].text[this.sLang].title).join(", ");
					let o={
						"id": oItem.en.name,
						"name": oItem[this.sLang].name || oItem.en.name,
						"tooltip": oItem[this.sOtherLang].name || oItem.en.name,
						"text": oItem[this.sLang].text || oItem.en.text,
						"src": oItem[this.sLang].source || oItem.en.source,
						"className": this.sClassTitle,
						"source": sSrc /*this.aSources[oItem.en.source].text[this.sLang].title*/,
						"school": this.aSchools[oItem.en.school.trim()].text[this.sLang].title,
						"level": oLevelsText[oItem.en.level]? oLevelsText[oItem.en.level].text[this.sLang].title : oItem.en.level + " " + oLevelsText.units[this.sLang].title,
						"castingTime": oItem[this.sLang].castingTime || oItem.en.castingTime,
						"range": oItem[this.sLang].range || oItem.en.range,
						"components": oItem[this.sLang].components || oItem.en.components,
						"materials": oItem[this.sLang].materials || oItem.en.materials,
						"duration": oItem[this.sLang].duration || oItem.en.duration,
						"ritual": oItem.en.ritual? oDict.ritual[this.sLang].title: "",		

						"castingTimeTitle": oDict.castingTime[this.sLang].title,
						"durationTitle": oDict.duration[this.sLang].title,
						"rangeTitle": oDict.range[this.sLang].title,
						"componentsTitle": oDict.components[this.sLang].title,
						
						"levelNum": oItem.en.level,
						"color": this.sClass,
						"view": this.sView,
						"locked": this.aLockedItems.indexOf(oItem.en.name)>-1,
						"selected": this.aSelectedLockedItems.indexOf(oItem.en.name)>-1
					};
					if(oItem[this.sLang].pre || oItem.en.pre) {
						o.pre = oItem[this.sLang].pre || oItem.en.pre;
					}
					return o;
				}.bind(this));
			},
			
			aHiddenItemsList: function(){
				let aFiltered = this.aItems.filter(function(oItem){
					return 	this.aHiddenItems.indexOf(oItem.en.name)>-1
				}.bind(this)); 
				return aFiltered.map(function(oItem){
					let o={
						"id": oItem.en.name,
						"title": oItem[this.sLang].name || oItem.en.name,
						"tooltip": oItem[this.sOtherLang].name || oItem.en.name						
					};
					return o;
				}.bind(this));
			},
			
		},
		mounted: function() {
			this.loadConfigData();	
			this.collectCastingTime();			
			this.sModalWinCont = $("#info_text").html();
			
			let bInfoIsRead = this.getConfig("infoIsRead");
			if(bInfoIsRead) {
				this.hideInfo();
				this.showCards();
			}
			
			this.getHash();			
			
			this.$refs.SchoolCombobox.toggle(null, this.bSchoolsOpend);
			this.$refs.SourceCombobox.toggle(null, this.bSourcesOpend);
			
			this.updateHash();
			
			this.bAppIsReady = true;
			
			this.bDebug = isDebug();
			this.bIos = isIos();
		},
		methods: {
			collectCastingTime: function(){
				let oTmp ={};
				//this.aCastingTime={};
				this.aItems.forEach(el=>oTmp[el.en.castingTime] = el.ru.castingTime);
				
				for (let key in oTmp) {
					this.aCastingTime[key] = {
						checked: false,
						visible: true,
						text: {
							en: {
								title: key,
							},
							ru: {
								title: oTmp[key],
							},
						}
					}
				}
			},
			// aCastingTimeSelected: function(){
				// let aFiltered = this.aCastingTimeList.filter(item => item.checked);
				// return (aFiltered.length>0)? aFiltered.map(item => item.key.toLowerCase()) : [];/*this.aCastingTimeList.map(item => item.key.toLowerCase());*/
			// },
			onClassChange: function(sKey){
				this.showAllItems();
				
				this.sClass = sKey;
				this.setConfig("class", sKey);
				this.onSubClassChange("");
				this.updateHash();
			},
			onSubClassChange: function(sKey){
				this.showAllItems();
				
				this.sSubClass = sKey;
				this.setConfig("subclass", sKey);
				this.onSubSubClassChange("");
				
				this.updateHash();
			},
			onSubSubClassChange: function(sKey){
				this.showAllItems();
				
				this.sSubSubClass = sKey;
				this.setConfig("subsubclass", sKey);
				
				this.updateHash();
			},
			onLevelStartChange: function(sKey){
				this.showAllItems();
				
				this.sLevelStartSelected = String(this.nLevelStart = sKey);
				this.setConfig("ls", sKey);
				
				this.updateHash();
			},
			onLevelEndChange: function(sKey){
				this.showAllItems();
				
				this.sLevelEndSelected = String(this.nLevelEnd = sKey);
				this.setConfig("le", sKey);
				
				this.updateHash();
			},
			onSourceChange: function(sKey){
				this.showAllItems();
				
				this.aSources[sKey].checked = !this.aSources[sKey].checked; 
				this.updateHash();
			},
			onCastingTimeChange: function(sKey){
				this.showAllItems();
				
				this.aCastingTime[sKey].checked = !this.aCastingTime[sKey].checked; 
				//this.$recompute('aCastingTimeSelected');
				//this.$forceUpdate();
				this.updateHash();
			},
			onSchoolChange: function(sKey){
				this.showAllItems();
				
				this.aSchools[sKey].checked = !this.aSchools[sKey].checked; 
				this.updateHash();
			},
			onLanguageChange: function(sKey){
				this.showAllItems();
				
				this.sLang = sKey;
				this.setConfig("lang", sKey);
				
				this.updateHash();
			},
			onViewChange : function(sKey){
				this.showAllItems();
				
				this.sView = sKey;
				this.setConfig("view", sKey);
				
				this.updateHash();
			},
			onSortChange: function(sKey){
				this.showAllItems();
				
				this.sSort = sKey;
				this.updateHash();
				this.setConfig("sort", sKey);
			},
			onSearchName: function(sValue){
				if(this.bDebug) {
					alert ("Введенное значение: \r\n"+ sValue);
				}
				this.showAllItems();
				
				this.sSearch = sValue.trim();
				this.updateHash();
			},
			getRandomItem: function(){
				this.showAllItems();
				
				this.sSearch = "";
				this.sSearch = this.aItemsList[randd(0, this.aItemsList.length-1)].name;
				this.updateHash();
			},
			onAllClassSpellsPress: function(){
				this.showAllItems();
				
				this.bAllClassSpells = !this.bAllClassSpells;
				this.updateHash();
			},
			onRitualsPress: function(){
				this.showAllItems();
				
				this.bRitualOnly = !this.bRitualOnly;
				this.updateHash();
			},
			
			autosizeAllText: function () {
				var aCards = this.$refs.itemCard;
				let oTimer = setInterval(function(){
					if(aCards.length>0){
						for(let i=0; i<aCards.length; i++) {
							let bResult = aCards[i].autosizeText();
							if(!bResult) {
								aCards.splice(i, 1);
							}
						}
					} else {
						clearInterval(oTimer);
					}
				}.bind(this), 1);
				/*/
				this.$refs.itemCard.forEach(function(oCard){
					oCard.autosizeText();
				});
				/**/
			},
			
			onSchoolsToggled: function(bStat){
					this.setConfig("schoolsOpend", bStat);
			},
			onSourcesToggled: function(bStat){
					this.setConfig("sourcesOpend", bStat);
			},
			onCastingTimeToggled: function(bStat){
					this.setConfig("castingTimeOpend", bStat);
			},
			
			hideInfo(){
				$("#info_text").hide();
			},
			
			lockCard: function(oCard){
				if(this.aSelectedItems.length>0) {
					this.aSelectedItems.forEach(function(sId){
						if(this.aSelectedItems.indexOf(sId)>-1) {
							this.aLockedItems.push(sId);
						}
					}.bind(this));
					this.selectAll(false);
				} else {
					let id = oCard.id;
					if(this.aLockedItems.indexOf(id)<0) {
						this.aLockedItems.push(id);
					}
				}
				this.setConfig("locked", this.aLockedItems);
			},
			unlockCard: function(oCard){
				if(this.aSelectedLockedItems.length>0) {
					this.aSelectedLockedItems.forEach(function(sId){
						let nInd = this.aLockedItems.indexOf(sId);
						if(nInd>-1) {
							this.aLockedItems.splice(nInd, 1);
						}
					}.bind(this));
				} else {
					let id = oCard.id;
					let nInd = this.aLockedItems.indexOf(id);
					if(nInd>-1) {
						this.aLockedItems.splice(nInd, 1);
					}
				}
				this.setConfig("locked", this.aLockedItems);
			},
			hideCard: function(oCard){
				if(this.aSelectedItems.length>0) {
					this.aSelectedItems.forEach(function(sId){
						if(this.aSelectedItems.indexOf(sId)>-1) {
							this.aHiddenItems.push(sId);
						}
					}.bind(this));
					this.selectAll(false);
				} else {
					let id = oCard.id;
					if(this.aHiddenItems.indexOf(id)<0) {
						this.aHiddenItems.push(id);
					}
				}
			},
			unhideCard: function(sId){
				let nInd = this.aHiddenItems.indexOf(sId);
				if(nInd>-1) {
					this.aHiddenItems.splice(nInd, 1);
				}
			},
			unlockAll: function(){
				this.aLockedItems = [];
				this.setConfig("locked", this.aLockedItems);
			},
			unhideAll: function(){
				this.aHiddenItems = [];
			},
			
			selectCard: function(oCard){
				let id = oCard.id;
				let nInd = this.aSelectedItems.indexOf(id);
				if(nInd>-1) {
					this.aSelectedItems.splice(nInd, 1);
				} else {
						this.aSelectedItems.push(id);
				}
			},
			selectLockedCard: function(oCard){
				let id = oCard.id;
				let nInd = this.aSelectedLockedItems.indexOf(id);
				if(nInd>-1) {
					this.aSelectedLockedItems.splice(nInd, 1);
				} else {
					this.aSelectedLockedItems.push(id);
				}
			},
			selectAll: function(bStat){
				if(this.aSelectedItems.length>0 || bStat===false) {
					this.aSelectedItems = [];
					this.aSelectedLockedItems = [];
				} else {
					this.aSelectedItems = this.aItemsList.map(item => item.id);
				}				
			},
			
			makeCardWidthLess: function(){
				var aCards = this.$refs.itemCard;
				if(this.aSelectedLockedItems.length>0 || this.aSelectedItems.length>0) {
					aCards = aCards.filter(el => this.aSelectedLockedItems.indexOf(el.id)>-1 || this.aSelectedItems.indexOf(el.id)>-1)
				}
				// aSelectedLockedItems
				// aSelectedItems
				aCards.forEach(function(oCard){
					oCard.onCardWidthMin();
				}.bind(this));
			},			
			makeCardWidthMore: function(){
				var aCards = this.$refs.itemCard;
				if(this.aSelectedLockedItems.length>0 || this.aSelectedItems.length>0) {
					aCards = aCards.filter(el => this.aSelectedLockedItems.indexOf(el.id)>-1 || this.aSelectedItems.indexOf(el.id)>-1)
				}
				aCards.forEach(function(oCard){
					oCard.onCardWidthMax();
				}.bind(this));
			},			
			makeCardWidthNorm: function(){
				var aCards = this.$refs.itemCard;
				if(this.aSelectedLockedItems.length>0 || this.aSelectedItems.length>0) {
					aCards = aCards.filter(el => this.aSelectedLockedItems.indexOf(el.id)>-1 || this.aSelectedItems.indexOf(el.id)>-1)
				}
				aCards.forEach(function(oCard){
					oCard.setCardWidth(240);
				}.bind(this));
			},
			
			updateHash: function() {
				var aHash = [];
				if(this.sSearch.length>0) {
					aHash.push("q="+this.sSearch.trim());
				}
				
				if(this.aSrcSelected.length != this.aSrcList.length) {
					aHash.push("src="+this.aSrcSelected.join(","));
				}
				if(this.aSchoolSelected.length != this.aSchoolList.length) {
					aHash.push("school="+this.aSchoolSelected.join(","));
				}
				//let aCastingTimeSelected = this.aCastingTimeSelected();
				if(this.aCastingTimeSelected.length != this.aCastingTime.length && this.aCastingTimeSelected.length) {
					aHash.push("castTime="+this.aCastingTimeSelected.join(","));
				}
				if(this.sLang != "ru") {
					aHash.push("lang="+this.sLang);
				}
				if(this.sClass != "") {
					aHash.push("class="+this.sClass);
				}
				if(this.nLevelStart > 0) {
					aHash.push("ls="+this.nLevelStart);
				}
				if(this.nLevelEnd < 9) {
					aHash.push("le="+this.nLevelEnd);
				}
				if(this.sView != "card") {
					aHash.push("view="+this.sView);
				}
				if(this.sSort != "levelAlpha") {
					aHash.push("sort="+this.sSort);
				}
				
				if(this.bRitualOnly) {
					aHash.push("ritual=1");
				}
				if(this.bAllClassSpells) {
					aHash.push("fullclass=1");
				}
				
				if(aHash.length>0) {
					window.location.hash = aHash.join("&").replace(/\s+/g, "_");
				} else {
					this.removeHash();
				}
			},
			removeHash: function(){
				history.pushState("", document.title, window.location.pathname + window.location.search);
				return false;
			},
			getHash(){
				var sHash = window.location.hash.slice(1); // /archive#q=Item_name
				sHash = decodeURIComponent(sHash).replace(/_/g, " ");
				var oHash = {};
				sHash.split("&").forEach(function(sPair){
					aPair = sPair.split("=");
					if(aPair[1]){
						oHash[aPair[0]] = aPair[1].split(",")
					}
				}.bind(this));
				
				if(oHash.src) {					
					for (let key in this.aSources) {
						if(oHash.src.indexOf(key)>-1) {
							this.aSources[key].checked=true;
						} else {
							this.aSources[key].checked=false;
						}
					}
				}
				if(oHash.school) {
					for (let key in this.aSchools) {
						if(oHash.school.indexOf(key)>-1) {
							this.aSchools[key].checked=true;
						} else {
							this.aSchools[key].checked=false;
						}
					}
				}
				if(oHash.castTime) {
					for (let key in this.aCastingTime) {
						if(oHash.castTime.indexOf(key)>-1) {
							this.aCastingTime[key].checked=true;
						} else {
							this.aCastingTime[key].checked=false;
						}
					}
				}
				if(oHash.lang) {
					this.sLang = oHash.lang[0]
				}
				if(oHash.class) {
					this.sClass = oHash.class[0]
				}
				if(oHash.le) {
					this.nLevelEnd = oHash.ls[0]
				}
				if(oHash.le) {
					this.nLevelStart = oHash.ls[0]
				}
				if(oHash.view) {
					this.sView = oHash.view[0]
				}
				if(oHash.sort) {
					this.sSort = oHash.sort[0]
				}
				if(oHash.q) {
					this.sSearch = oHash.q[0];
				}
				if(oHash.ritual) {
					this.bRitualOnly = true;
				}
				if(oHash.fullclass) {
					this.bAllClassSpells = true;
				}
				
			},
			
			showInfo: function(){
				this.bModalWinShow = true;
			},
			closeModWin: function(){
				this.bModalWinShow = false;
			},
			print: function(){
				window.print();
				return false;
			},
			
			showCards: function(){
				this.bCardsAreVisible = true;
			},
			
			showAllItems: function(){
				this.closeModWin();
				this.hideInfo();
				this.showCards();
				this.setConfig("infoIsRead", true);
			},
			
			setConfig: function (prop, val) {
				if(prop && val != undefined && this.oConfig) {
					this.oConfig[prop] = val;
					localStorage.setItem("feat_config", JSON.stringify(this.oConfig));
				}
			},
			getConfig: function (prop) {
				this.oConfig = JSON.parse(localStorage.getItem("feat_config")) || {};
				if(prop!=undefined) {
					return localStorage.getItem("feat_config")? this.oConfig[prop] : null;
				}
				return ""; 
			},
			
			loadConfigData: function(){
				let sTmpLang = this.getConfig("lang");
				if(sTmpLang){
					this.sLang = sTmpLang;					
				}
				
				let sTmpSort = this.getConfig("sort");
				if(sTmpSort){
					this.sSort = sTmpSort;					
				}
				
				let aTmpLocked = this.getConfig("locked");
				if(aTmpLocked) {
					this.aLockedItems = aTmpLocked;
				}
				
				let bTmpSchoolsOpend = this.getConfig("schoolsOpend");
				if(bTmpSchoolsOpend != undefined) {
					this.bSchoolsOpend = bTmpSchoolsOpend
				}
				
				let bTMPSourcesOpend = this.getConfig("sourcesOpend");
				if(bTMPSourcesOpend != undefined) {		
					this.bSourcesOpend = bTMPSourcesOpend;					
				}	
			},
			
			
			downloadDB: function() {
				var oDB = {};
				oDB.sourceList = this.aSources;
				oDB.schoolList = this.aSchools;
				oDB.oLanguages = this.aLanguages;
				oDB.allSpells = this.aItems;
				
				var sData = JSON.stringify(oDB, null, 2);
				var filename = "DnD5e_spells_BD";
				var blob = new Blob([sData], {type: "text/plain;charset=utf-8"});
				saveAs(blob, filename+".dtn");
			},
			uploadDB: function() {
				let oUploader = this.$refs.fileUploader;
				document.getElementById('fileUploader').click();
			},
			fileSelected: function(oEvent){
				this.handleLocalBDSelect(oEvent);
			},
			
			handleLocalBDSelect: function(evt) {
				var files = evt.target.files; // FileList object

				var reader = new FileReader();
				reader.onload = (function(theFile) {
					return function(e) {
						var sText = e.target.result;
						this.parceLocalFile(sText);
					}.bind(this);
				}.bind(this))(files[0]);

				// Read in the image file as a data URL.
				reader.readAsText(files[0]);

			},
			_completeDB: function(oMainDB, oFileDB){
				for(var key in oFileDB) {
					oMainDB[key] = oFileDB[key];
				}
			},
			parceLocalFile: function(sText) {
				try{
					var oDB = JSON.parse(sText);
						
					this._completeDB(this.aSources, oDB.sourceList);
					this._completeDB(this.aSchools, oDB.schoolList);
					this._completeDB(this.aLanguages, oDB.oLanguages);
					//this._completeDB(this.aItems = oDB.allSpells);

					/*/
					this.aSources = oDB.sourceList;
					this.aSchools = oDB.schoolList;
					this.aLanguages = oDB.oLanguages;
					/**/
					this.aItems = oDB.allSpells;
					
					let oUploader = this.$refs.fileUploader;
					document.getElementById('fileUploader').value = "";
					alert("Вроде как загружено");
				} catch (err) {
					document.getElementById('fileUploader').value = "";
					alert ("Ошибка в структуре файла файла. Воспользуйтесь валидатором JSON.\n\n"+err);
				}
			},
			
			
			onEditModePress: function(){
				//this.showAllItems();
				
				this.bEditMode = !this.bEditMode;
				//this.updateHash();
			},
			cancelCard: function(oData){
				let sId = oData.id;
				let oItem = this.aItems.find(el => el.en.name.toLowerCase().replace(/\s+/,"") == sId.toLowerCase().replace(/\s+/,""));
				if(oItem) {
					let sText = oItem[this.sLang].text + "  ";
				
					oItem[this.sLang].text = sText;
				}
				
				return false;
				
			},
			saveCard: function(oData){
				let sId = oData.id;
				let sText = oData.text;
				
				let oItem = this.aItems.find(el => el.en.name.toLowerCase().replace(/\s+/,"") == sId.toLowerCase().replace(/\s+/,""));
				if(oItem) {
					oItem[this.sLang].text = sText;
				}
				
				return false;
			}
		}
  });
	
	$(document).keydown(function(event){
		// CTRL pressed
		if(event.which=="17") {
			fCtrlIsPressed = true;
		}

		// A pressed
		if(event.which=="65" && fCtrlIsPressed) {
			/*/
			if($(".spellCard.selected").length == $(".spellCard").length) {
				// deselect all
				$(".spellCard").removeClass("selected");
			} else {
				// select all
				$(".spellCard").addClass("selected");
			}
			/**/
			app.selectAll();
			return false;
		}
	});

	$(document).keyup(function(){
		fCtrlIsPressed = false;
	});
function randd(min, max) {
  return Math.floor(arguments.length > 1 ? (max - min + 1) * Math.random() + min : (min + 1) * Math.random());
};

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
			<input :id="innerId" type="text" :value='value' @input="input">
			<span class="cross" @click="clear"></span>
		</div>
		<a href="#random" class="bt flexChild" id="bRandom" title="Случайная черта" @click.stop="random">🎲</a>
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

	template: `<div :id="id" class="customCheckbox" @click.stop="press">
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
	<button  class="customSelect" @click="toggle">
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
	</button>
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
		}
	},
	data: function(){
		return {
			//mainClass: "cardContainer",
			viewClass: "cardView"
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
		ItemCard: function(){
			return "spellCard";
		},
		prerequisite: function(){
			return this.pre.length>0? "<span title='Требования необходимые для возможности получения черты'>["+this.pre+"]</span>": "";
		}
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
		}
	},

	template: `<div :class="[mainClass, viewClass]" @click.ctrl="select">
				<div :class='[ItemCard, selectedClass]' v-if="cardView" >
					<div class="content">
						<span v-show="locked" class="bUnlockItem" title="Открепить обратно" @click.stop="unlock"><i class="fa fa-unlock-alt" aria-hidden="true"></i></span>
						<span v-show="!locked" class="bLockItem" title="Закорепить черту (не будут действовать фильтры)" @click.stop="lock"><i class="fa fa-lock" aria-hidden="true"></i></span>
						<span class="bHideItem" title="Скрыть черту (будет внизу панели фильтров)" @click.stop="hide"><i class="fa fa-eye-slash" aria-hidden="true"></i></span>
						<h1 :title="tooltip">{{name}}</h1>
						<div class="row">
							<div class="cell castingTime">
								<b>{{castingTimeTitle}}</b>
								<span>{{castingTime}}</span>
							</div>
							<div class="cell range">
								<b>{{rangeTitle}}</b>
								<span>{{range}}</span>
							</div>
						</div>
						<div class="row">
							<div class="cell components">
								<b>{{componentsTitle}}</b>
								<span>{{components}}</span>
							</div>
							<div class="cell duration">
								<b>{{durationTitle}}</b>
								<span>{{duration}}</span>
							</div>
						</div>
						<div class="materials">{{materials}}</div>
						<div class="text" v-html="text"></div>
						
						<b class="class">{{className}}</b>
						<b class="school">{{level}}, {{school}} <span :title="srcTitle">({{src}})</span></b>
					</div>
				</div>
				
				<div class="inner" v-if="!cardView">
						<span v-show="locked" class="bUnlockItem" title="Открепить обратно" @click.stop="unlock"><i class="fa fa-unlock-alt" aria-hidden="true"></i></span>
						<span v-show="!locked" class="bLockItem" title="Закорепить черту (не будут действовать фильтры)" @click.stop="lock"><i class="fa fa-lock" aria-hidden="true"></i></span>
						<span class="bHideItem" title="Скрыть черту (будет внизу панели фильтров)" @click.stop="hide"><i class="fa fa-eye-slash" aria-hidden="true"></i></span>
            <div class="flex">
              <div class="flex column primal">
                <h1 :title="tooltip">{{name}}</h1>          
                <div class="school_level">{{level}}, {{school}} {{ritual}}</div>
              </div>
              <div class="flex secondal">
                <div class="column thirdal">
                  <div class="cvasi_row"><div class="subtitle">{{castingTimeTitle}}</div> <div>{{castingTime}}</div></div>   
                  <div class="cvasi_row"><div class="subtitle">{{rangeTitle}}</div> <div>{{range}}</div></div>           
                </div>
                <div class="column thirdal">              
                  <div class="cvasi_row"><div class="subtitle">{{componentsTitle}}</div> <div>{{components}} {{materials?"*":""}}</div></div> 
                  <div class="cvasi_row"><div class="subtitle">{{durationTitle}}</div> <div>{{duration}}</div></div>       
                </div> 
            </div>
          </div>
          <div class="text" v-html="text"></div> 
          <div class="material_components">{{materialsLine}}</div>
					<div class="source" :title="srcTitle">({{src}})</div>
        </div>
			</div>`
});
	
  var app = new Vue({
    el: '#app',
    data: {
			aSources: sourceList,
			aSchools: schoolList,
			aLanguages: oLanguages,
			aViews: oView,
			aSort: oSort,
			aItems: allSpells,
			sLang: "ru",
			sView: "card",
			sSort: "levelAlpha",
			sClass: "",
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
			
			oConfig: {},
			bSchoolsOpend: false,			
			bSourcesOpend: false,		
			bCardsAreVisible: false,	
			bAppIsReady: false,	
			bRitualOnly: false,
			
			bModalWinShow: false,
			sModalWinCont: ""
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
				return this.aSort[this.sSort].text[this.sLang].title;
			},
			/**/
			
			aClassList: function(){
				let aSclasses = [];
				for (let key in classSpells) {
					aSclasses.push({
						key: key,
						title: classSpells[key].title.en + "<br>" + classSpells[key].title.ru
					});
				}
				
				return aSclasses;
			},
			sClassSelected: function(){
				return this.sClass? classSpells[this.sClass].title[this.sLang] : "[ВСЕ]";
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
			
			
			
			aItemsList: function(){
				let aFiltered = this.aItems.filter(function(oItem){
					return (
						this.aSrcSelected.filter(value => -1 !== oItem.en.source.split(",").map(item => item.trim()).indexOf(value)).length &&
						//this.aSrcSelected.indexOf(oItem.en.source)>-1 && // old filter for sources
						this.aSchoolSelected.indexOf(oItem.en.school.toLowerCase().trim())>-1 /**/&& 
							(
							oItem.en.name.toLowerCase().indexOf(this.sNameInput)>-1 || 
							oItem.ru.name.toLowerCase().indexOf(this.sNameInput)>-1
							)
						&&
						(this.bRitualOnly && oItem.en.ritual || !this.bRitualOnly) &&
						this.aHiddenItems.indexOf(oItem.en.name)<0/**/
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
						"color": oItem.en.school,
						"view": this.sView,
						"locked": this.aLockedItems.indexOf(oItem.en.name)>-1,
						"selected": this.aSelectedItems.indexOf(oItem.en.name)>-1
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
					let o={
						"id": oItem.en.name,
						"name": oItem[this.sLang].name || oItem.en.name,
						"tooltip": oItem[this.sOtherLang].name || oItem.en.name,
						"text": oItem[this.sLang].text || oItem.en.text,
						"src": oItem[this.sLang].source || oItem.en.source,
						"source": this.aSources[oItem.en.source].text[this.sLang].title,
						"type": this.aSchools[oItem.en.type].text[this.sLang].title,
						"color": oItem.en.type,
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
			this.sModalWinCont = $("#info_text").html();
			
			let bInfoIsRead = this.getConfig("infoIsRead");
			if(bInfoIsRead) {
				this.hideInfo();
				this.showCards();
			}
			
			this.getHash();			
			
			this.$refs.SchoolCombobox.toggle(null, this.bTypesOpend);
			this.$refs.SourceCombobox.toggle(null, this.bSourcesOpend);
			
			this.updateHash();
			
			this.bAppIsReady = true;
		},
		methods: {
			onSourceChange: function(sKey){
				this.aSources[sKey].checked = !this.aSources[sKey].checked; 
				this.updateHash();
			},
			onSchoolChange: function(sKey){
				this.aSchools[sKey].checked = !this.aSchools[sKey].checked; 
				this.updateHash();
			},
			onLanguageChange: function(sKey){
				this.sLang = sKey;
				this.setConfig("lang", sKey);
				
				this.updateHash();
			},
			onViewChange : function(sKey){
				this.sView = sKey;
				this.setConfig("view", sKey);
				
				this.updateHash();
			},
			onSortChange: function(sKey){
				this.sSort = sKey;
				this.updateHash();
				this.setConfig("sort", sKey);
			},
			onSearchName: function(sValue){
				this.sSearch = sValue.trim();
				this.updateHash();
			},
			getRandomItem: function(){
				this.sSearch = "";
				this.sSearch = this.aItemsList[randd(0, this.aItemsList.length-1)].name;
				this.updateHash();
			},
			onRitualsPress: function(){
				this.bRitualOnly = !this.bRitualOnly;
			},
			
			onSchoolsToggled: function(bStat){
					this.setConfig("schoolsOpend", bStat);
			},
			onSourcesToggled: function(bStat){
					this.setConfig("sourcesOpend", bStat);
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
					if(nInd>1) {
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
			
			
			updateHash: function() {
				var aHash = [];
				if(this.sSearch.length>0) {
					aHash.push("q="+this.sSearch.trim());
				}
				
				if(this.aSrcSelected.length != this.aSrcList.length) {
					aHash.push("src="+this.aSrcSelected.join(","));
				}
				if(this.aSchoolSelected.length != this.aSchoolList.length) {
					aHash.push("type="+this.aSchoolSelected.join(","));
				}
				if(this.sLang != "ru") {
					aHash.push("lang="+this.sLang);
				}
				if(this.sView != "card") {
					aHash.push("view="+this.sView);
				}
				if(this.sSort != "levelAlpha") {
					aHash.push("sort="+this.sSort);
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
				if(oHash.type) {
					for (let key in this.aSchools) {
						if(oHash.type.indexOf(key)>-1) {
							this.aSchools[key].checked=true;
						} else {
							this.aSchools[key].checked=false;
						}
					}
				}
				if(oHash.lang) {
					this.sLang = oHash.lang[0]
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
				
			},
			
			showInfo: function(){
				this.bModalWinShow = true;
			},
			closeMosWin: function(){
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
				this.closeMosWin();
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
				
				let bTmpTypesOpend = this.getConfig("typesOpend");
				if(bTmpTypesOpend != undefined) {
					this.bTypesOpend = bTmpTypesOpend
				}
				
				let bTMPSourcesOpend = this.getConfig("sourcesOpend");
				if(bTMPSourcesOpend != undefined) {		
					this.bSourcesOpend = bTMPSourcesOpend;					
				}	
			}
		}
  });
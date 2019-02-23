'use strict';

const fs = require('fs');
const argv = require('yargs').argv;
const cheerio = require('cheerio');
const path = require('path');
const request = require('request');

const INPUT = "source_ru_x.txt";
const OUTPUT = "result_ru_x.js";

let allSpells=[];
let oSpell={};

const aSchools = [
	"Призыв",
	"Ограждение",
	"Некромантия",
	"Проявление",
	"Очарование",
	"Преобразование",
	"Иллюзия",
	"Прорицание",
	"воплощение",
	"вызов"
];

function processFile(inputFile) {
    var fs = require('fs'),
        readline = require('readline'),
        instream = fs.createReadStream(inputFile),
        outstream = new (require('stream'))(),
        rl = readline.createInterface(instream, outstream);
     
    rl.on('line', function (line) {
			var oInfo = true;
        //console.log(line);
				if(line == "###") { // prev spell end
					if(oSpell.name){
						oSpell.text = oSpell.text.replace("<br>", "");
						allSpells.source = "XGTE";
						allSpells.push({"ru": oSpell});
						oSpell={};
					}
				} else {
					// name ?
					if(!oSpell.name) {
						let oName = line.match(/([а-яё\s-]+)\[([\w\s-'’]+)\]/i);
						if(oName && oName[2]) {
							oSpell.origin = oName[2];
						}
						oSpell.name = (oName && oName[1] && oName[1].trim()) || line.trim();
						oInfo = false;
					}
					
					// school / level
					var oSchool = line.match(new RegExp(aSchools.join("|"), "i"));
					if(oSchool) {
						oSpell.school = oSchool[0];
					
						//console.log("---\n"+line+"\n---");
					
						if (/Заговор/i.test(line)) {
							oSpell.level = 0;
						} else {
							var oLevel = line.match(/\d/);
							if (oLevel) {
								oSpell.level = oLevel[0];
							}
						}
						
						if(/ритуал/i.test(line)) {
							oSpell.ritual = "ритуал";
						}
						oInfo = false;
					}
					
					//casting time
					var oCastingTime = line.match(/Время накладывания:([а-яё\d\w\s\,]+)/i);
					if(oCastingTime) {
						oSpell.castingTime = oCastingTime[1].trim();
						oInfo = false;
					}
					
					//range
					var oRange = line.match(/Дистанция:([а-яё\d\w\s\,\(\)]+)/i);
					if(oRange) {
						oSpell.range = oRange[1].trim();
						oInfo = false;
					}
					
					//components
					var oComp = line.match(/Компоненты:([а-яё\w\s\,]+)(\([^\)]+\))?/i);
					if(oComp) {
						oSpell.components = oComp[1].trim();
						if(oComp[2]) {
							oSpell.materials = oComp[2].trim();
						}
						oInfo = false;
					}
					
					//Duration
					var oDuration = line.match(/Длительность:([а-яё\d\w\s\,\(\)]+)/i);
					if(oDuration) {
						oSpell.duration = oDuration[1].trim();
						oInfo = false;
					}
					
					// info
					if(oInfo)  {
						var sLine = line.replace(/[-/-][\r\n]+/, "").replace(/\s*[\r\n]+\s*/, " ").replace(/(^[а-яё\s]+ких уровнях\.)/, "<b>На более высоких уровнях.</b>").replace(/^([А-Я])/, "<br>$1");
						if(!oSpell.text) {
							oSpell.text = "";
						}
						oSpell.text += sLine;
					}
				}
    });
    
    rl.on('close', function (line) {
        //console.log(line);
        //console.log('done reading file.');
				//console.dir(allSpells);
				
			fs.writeFile(OUTPUT, JSON.stringify(allSpells, null, ' '), function(err) {
					if(err) {
							return console.log(err);
					}

					console.log("The file was saved!");
			}); 
    });
}
processFile(INPUT);
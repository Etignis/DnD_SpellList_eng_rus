'use strict';

const fs = require('fs');
const argv = require('yargs').argv;
const cheerio = require('cheerio');
const path = require('path');
const request = require('request');

const INPUT_EN = "result_en_x.js";
const INPUT_RU = "result_ru_x.js";
const OUTPUT = "result_x.js";

let allSpells=[];



var aSpellEn = JSON.parse(fs.readFileSync(INPUT_EN, 'utf8'));
var aSpellRu = JSON.parse(fs.readFileSync(INPUT_RU, 'utf8'));

allSpells = allSpells.concat(aSpellEn);
var nSpells = allSpells.length; 
console.log("английских заклинаний "+nSpells);
aSpellRu.forEach(function(oSpell) {
	// console.dir("\nОбрабатываем "+oSpell.ru.name);
	let fFound = false;
	for(var i=0; i<nSpells; i++) {
		if(!oSpell.ru.origin) {
			// console.log("\nНет ссылки:");
			// console.dir(oSpell.ru.name);
			// console.dir(oSpell.ru.origin);
			continue;
		}
		if(!allSpells[i].en.name) {
			console.log("\nНет имени:");
			console.dir(allSpells[i].en);
			continue;
		}
		try{
			//console.log(oSpell.ru.origin.toLowerCase().replace(/\s+/g, "") +"=="+ allSpells[i].en.name.toLowerCase().replace(/\s+/g, ""));
			if(oSpell.ru.origin.toLowerCase().replace(/\s+/g, "") == allSpells[i].en.name.toLowerCase().replace(/\s+/g, "")) {
				delete oSpell.ru.origin;
				allSpells[i]["ru"] = oSpell.ru;
				console.dir(allSpells[i]);
				fFound=true;
				break;
			}
			
			
		} catch (err) {
			console.log("\n---");
			console.log(err);
		}
	}
	if(!fFound) {			
		delete oSpell.ru.origin;
		allSpells.push({
			"ru": oSpell.ru
		})
	}
});

fs.writeFile(OUTPUT, JSON.stringify(allSpells, null, ' '), function(err) {
		if(err) {
				return console.log(err);
		}

		console.log("The file was saved!");
}); 

//console.dir(aSpellRu[1]);

var oInfo = {
  title: "Новая версия",
  url: "www.tentaculus.ru/spells",
  resume: "Теперь значения фильтров фиксируются в URL",
  details: "",
  date: "26.09.2017",
  version: "2.2.4"
}

function showMessage(oParams) {	
  if(!($("#topMessage").length > 0) && oParams) {

    var sTitle = oParams.title || "Есть свежая версия";
    var sResume = oParams.resume || "";
    var sDetails = '<p>' + oParams.details + '</p>' || "";
    var sDate = '<p>' + oParams.date + '</p>' || "";
    var sVersion = '<p>' + oParams.version + '</p>' || "";
    var sURL = oParams.url || "www.tentaculus.ru";

    var sHeader = "<a href='"+sURL+"' title='Перейти к новой версии'>"+sTitle + " | " + sResume + "</a>";
    var sInfo = "<div class='dDetails'>"+sDetails + sVersion + sDate+"</div>";
    var oButton = "<button class='bHide'>Скрыть</button>";
	
	var oLeft = "<div class='left'>"+sHeader+sInfo+"</div>";
	var oRight = "<div class='right'>"+oButton+"</div>";

    $("body").prepend("<div id='topMessage' style='display: none'>"+oLeft+oRight+"</div>");
  }
  $("#topMessage").slideDown();
}

function hideMessage() {
  $("#topMessage").slideUp();

  return new Date();
}

$('body').on('click', "#topMessage .bHide", function(){
  var fMessageHidded = hideMessage();
  try{
    setConfig("fMessageHidded", fMessageHidded);
  } catch (err) {
    console.log("[ERROR] We can't save message hidding:");
    console.dir(err);
  }
});

function checkForUpdate(sVersion, fMessage) {
	function formatVersion(sVer) {
		if(sVer) {
			return sVer = sVer.split(".");
		}
		return NaN;
	}
	
	function compareVersions(aV1, aV2) {
		for (var i =0; i< Math.max(aV1.length, aV2.length); i++) {
			aV1[i] = aV1[i]?aV1[i]: 0;
			aV2[i] = aV2[i]?aV2[i]: 0;
			
			if(aV1[i] < aV2[i])
				return -1;
			if(aV1[i] > aV2[i])
				return 1;			
		}
		return 0;
	}
  if(sVersion != oInfo.version) {
    if(compareVersions(formatVersion(sVersion), formatVersion(oInfo.version)) < 0) {
      // local version is outdated

      if(fMessage) {
        // it's time to show message

        // show message
        showMessage(oInfo);
      }
    }
  }
}

setTimeout(function(){
  var fMessageHidded = getConfig("fMessageHidded") || ((new Date().getTime()) - (23*60*60*1000));
  var fMessage = (new Date().getTime() - fMessageHidded) > 20*60*60*1000;
  var sVersion = TENTACULUS_APP_VERSION;

  checkForUpdate(sVersion, fMessage);
}, 5000);
var Promise=TrelloPowerUp.Promise,t=TrelloPowerUp.iframe(),DEV_SERVER_URL="https://script.google.com/a/origamistudios.us/macros/s/AKfycbytN_9yWiGWKIKTiKR-2xgU6nEaGavxY4pDiUgCpdc/dev",PROD_SERVER_URL="https://script.google.com/a/origamistudios.us/macros/s/AKfycbxoYQfMrzAmRKJMaNEImAtJvWX1gpyiYdFFMR9yTZ-50JgwWec/exec",estimatedTime=document.getElementById("estimatedTime"),startDate=document.getElementById("startDate"),closePopupWait=2E3,closePopupFlag=1;
t.render(function(){t.get("card","shared","startTime","null").then(function(a){"null"===a?$("#startTimer").show():a.recordTime?($("#startTimer").hide(),$("#stopTimer").show()):($("#startTimer").show(),$("#stopTimer").hide());t.get("board","private","recording","null").then(function(a){a.status&&$("#startTimer").hide()})}).then(function(){t.get("card","shared","startDate","null").then(function(a){"null"!==a&&$("#startDate").val(a)}).then(function(){t.get("card","shared","estimatedTime","null").then(function(a){"null"!==
a&&$("#estimatedTime").val(a)}).then(function(){t.get("card","shared","assignedTo","null").then(function(a){var c=t.arg("members");"null"===a?(a="None",c.members.forEach(function(b){b.fullName.includes("Origami-PowerUp")||$("#assignedTo").append("<option id='"+b.id+"' value='"+b.id+"'>"+b.fullName+"</option>")})):(c.members.forEach(function(b){b.fullName.includes("Origami-PowerUp")||$("#assignedTo").append("<option id='"+b.id+"' value='"+b.id+"'>"+b.fullName+"</option>")}),$("#assignedTo option:selected").text(a),
$("#assignedTo").append("<option id='99' value='99'>None</option>"))});t.sizeTo("#content").done()})})})});
document.getElementById("save").addEventListener("click",function(a){var c=document.getElementById("estimatedTime"),b=document.getElementById("startDate");return t.set("card","shared","startDate",b.value).then(function(){c.value.match(/^[0-9]{2}:[0-9]{2}$/)?t.set("card","shared","estimatedTime",c.value).then(function(){t.get("card","shared","startTime","null").then(function(a){t.card("id","url","due","name").then(function(a){t.member("username","fullName").then(function(e){t.board("name").then(function(g){var d=
$("#assignedTo option:selected").text(),f=$("#assignedTo option:selected").val();t.set("card","shared","assignedTo",d).then(function(){var l=" saved estimated time:"+c.value+", startDate:"+b.value+", assignedTo = "+d;t.get("card","shared","startTime","null").then(function(h){$.post(PROD_SERVER_URL,{id:a.id,estimatedTime:c.value,boardName:g.name,member:e.username,startDate:b.value,text:l,assignedTo:d,assignedToMemberId:f,rData:JSON.stringify({cData:a,mData:e,totalTime:h.previousTime,boardName:g.name})},
function(a){t.closePopup()});closePopupFlag&&setTimeout(function(){t.closePopup()},closePopupWait)})})})})})})}):($("#alertMsg").text("Estimated time should be 00:00 format i.e HH:MM"),$("#alertMsg").css("color","red"),$("#alertMsg").css("font-size","11px"))})});
$("#startTimer").on("click",function(a){return t.get("card","shared","startTime","null").then(function(a){"null"===a||0==a.recordTime?t.get("board","private","recording","null").then(function(b){if("null"===b||0==b.status){var c=0;0<a.previousTime&&(c=a.previousTime);Promise.all([t.card("id","url","due","name"),t.get("card","shared","assignedTo"),t.get("card","shared","estimatedTime"),t.member("username","id","fullName"),t.board("name"),t.get("card","shared","startDate")]).spread(function(a,b,g,d,
k,l){b&&b.includes(d.fullName)?Promise.all([t.set("board","private","recording",{status:!0,cardUrl:a.url}),t.set("card","shared","startTime",{recordTime:!0,startTime:new Date,previousTime:c})]).then(function(){$.post(PROD_SERVER_URL,{id:a.id,startDate:l,assignedTo:b,estimatedTime:g,member:d.username,text:" started timer",rData:JSON.stringify({cData:a,mData:d,totalTime:c,boardName:k.name})},function(a){t.closePopup()});closePopupFlag&&setTimeout(function(){t.closePopup()},closePopupWait)}):$("#alertMsg").css("color",
"red")})}else t.get("card","shared","assignedTo").then(function(a){a&&a.includes("mash3435345353hood")?t.set("board","private","recording",{status:!1,cardUrl:""}).then(function(){b.status&&$("#alertMsg").text("Recording Time at: "+b.cardUrl)}):b.status&&$("#alertMsg").text("Recording Time at: "+b.cardUrl)})}):recording.status&&$("#alertMsg").text("Timer already running at "+recording.cardUrl)})});
$("#stopTimer").on("click",function(){t.get("card","shared","startTime","null").then(function(a){if("null"===a)t.closePopup();else if(a.recordTime){var c=new Date,b=Math.floor((new Date(c)-new Date(a.startTime))/1E3/60)+a.previousTime;Promise.all([t.card("id","name","due","url","idList"),t.member("id","fullName","username"),t.get("card","shared","assignedTo"),t.get("card","shared","estimatedTime"),t.board("name"),t.get("card","shared","startDate")]).spread(function(a,e,f,h,d,k){f&&f.includes(e.fullName)?
Promise.all([t.set("card","shared","startTime",{recordTime:!1,startTime:c,previousTime:b,stopTime:c}),t.set("board","private","recording",{status:!1,cardUrl:a.url})]).then(function(){$.post(PROD_SERVER_URL,{id:a.id,startDate:k,assignedTo:f,estimatedTime:h,member:e.username,text:" stopped timer ",rData:JSON.stringify({cData:a,mData:e,totalTime:b,boardName:d.name})},function(a){t.closePopup()});closePopupFlag&&setTimeout(function(){t.closePopup()},closePopupWait)}):$("#alertMsg").css("color","red")})}})});

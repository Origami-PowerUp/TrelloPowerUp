var t = TrelloPowerUp.iframe();
var boardData = t.arg('boardData');
var recording = t.arg('recording');



var convertMinsToHrsMins = function (minutes) {
                                var h = Math.floor(minutes / 60);
                                var m = minutes % 60;
                                h = h < 10 ? '0' + h : h;
                                m = m < 10 ? '0' + m : m;
                                return h + ':' + m;
                            }
t.render(function(){
    //return t.remove('board','shared',['webhook','boardReports','boardReports:3','boardReports:2','boardReports:1','boardReportsMon Jul 31 2017','boardReports:Mon Jul 31 2017', 'boardReports:31']);
    //return t.remove('card','shared','startTime');
    let todayDate = new Date().getDate();
  //console.log('boardData = ', boardData['boardReports:'+todayDate])
  //console.log('recording on board = ', recording)
  if(recording.status){
    $("#content").append(`<p>You have timer running at <a style="color:green;font-size:20px;" href="${recording.cardUrl}">${recording.cardUrl}</a></p><hr/>`)    
  }else{
    $("#content").append(`<p>You don't have timer running on this board</p><hr/>`)          
  }
  
  let data = boardData['boardReports:'+todayDate]
  if(data){
      Object.keys(data).forEach((member)=>{
      //console.log('member = ', member, ' and totalTime = ', data[member].timeTotal)
      let time = convertMinsToHrsMins(data[member].timeTotal)
      let MemberCards = data[member].totalCards
      let html = `
      <br/>
      <div>
            <p>UserName: <b>${member}</b> time-recorded = <b style="font-size:20px;color:green">${time}</b> </p>
            <div style="overflow:scroll;border:1px solid green; height: 70px; width: 500px;">`
        let cardsHtml = ``
        Object.keys(MemberCards).forEach((card,i)=>{
            cardsHtml += `<p>${i}:<a target="_blank" href="${card}">${card}</a></p>`
        })
            html += cardsHtml +
                        `</div>
    </div>`
          $("#content").append(html)
      }) 
  }
  else{
         $("#content").append("<h2>Stop the running timers to generate reports!</h2>")
  }
  
});

document.addEventListener('click', function(e) {
  if(e.target.tagName == 'BODY') {
    t.closeOverlay().done();
     
  }
});

document.addEventListener('keyup', function(e) {
  if(e.keyCode == 27) {
    t.closeOverlay().done();
  }
});
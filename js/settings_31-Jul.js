/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var estimatedTime = document.getElementById('estimatedTime');
var startDate = document.getElementById('startDate');
  


t.render(function(){
//  return Promise.all([
//    t.get('board', 'shared', 'fruit'),
//    t.get('board', 'shared', 'vegetable')
//  ])
//  .spread(function(savedFruit, savedVegetable){
//    if(savedFruit && /[a-z]+/.test(savedFruit)){
//      fruitSelector.value = savedFruit;
//    }
//    if(savedVegetable && /[a-z]+/.test(savedVegetable)){
//      vegetableSelector.value = savedVegetable;
//    }
//  })
//  .then(function(){
//    t.sizeTo('#content')
//    .done();
//  })

t.get('card', 'shared','startTime', 'null').then(function(time){
   // console.log(' time = ', time)
    if(time === 'null'){
        $('#startTimer').show();    
    }else{
        if(time.recordTime){
            $('#startTimer').hide();    
            $('#stopTimer').show();
        }
        else{
            $('#startTimer').show();    
            $('#stopTimer').hide();
        }
        
    }
}).then(function(){
    t.get('card','shared','startDate','null').then(function(startDate){
        if(startDate === 'null')
        {
            
        }else{
            $('#startDate').val(startDate)
        }
    }).then(function(){
        t.get('card','shared','estimatedTime','null').then(function(estimatedTime){
            if(estimatedTime === 'null'){
              //  console.log('not found  ', estimatedTime)
            }else{
                //console.log('found estimatedTime value from Trello ', estimatedTime)
                $('#estimatedTime').val(estimatedTime)
                //estimatedTime.value = estimatedTime;
            }
        }).then(function(){
//            var openLists = t.arg('openLists');
//            openLists.forEach((list)=>{
//               // console.log('list name = ', list.name)
//                $("#sprint").append("<option>"+list.name+"</option>")
//            })

            t.get('card','shared','assignedTo','null').then(function(assignedTo){
                var boardMembers = t.arg('members');
                if(assignedTo === 'null'){
                    $("#assignedTo").append("<option id='0' value='0'>None</option>");   
                        boardMembers.members.forEach((member)=>{
                            $("#assignedTo").append("<option id='"+member.id+"' value='"+member.id+"'>"+member.fullName+"</option>")
                        })
                        
                }
                else{
                    
                        boardMembers.members.forEach((member)=>{
                            $("#assignedTo").append("<option id='"+member.id+"' value='"+member.id+"'>"+member.fullName+"</option>")
                        })
                    //    console.log('Card is Assigned to ', assignedTo)
                        $("#assignedTo option:selected").text(assignedTo)
                        $("#assignedTo").append("<option id='0' value='0'>None</option>");   
                }
            })
            
            t.sizeTo('#content').done();   
        })
    })
    
})
 
});
document.getElementById('save').addEventListener('click', function(e){
    
var estimatedTime = document.getElementById('estimatedTime');
var startDate = document.getElementById('startDate');

   // if(startDate.value || estimatedTime.value){
        
            return t.set('card','shared','startDate',startDate.value)
            .then(function(){
                if(estimatedTime.value.length < 1){
                    estimatedTime.value = ''
                }
                t.set('card','shared','estimatedTime',estimatedTime.value)            
                .then(function(){
                            t.get('card', 'shared', 'startTime', 'null').then(function (time) {
                                if (time === 'null') {

                                    t.set('card', 'shared', 'startTime', {recordTime: false, startTime: 0, previousTime: 0})
                                            .then(function () {
                                        t.card('id').then(function (cardId) {
                                            //   console.log('cardID = ', cardId)
                                            t.member('username').then(function (member) {
                                                let assignedTo = $("#assignedTo option:selected").text();
                                                let assignedToMemberId = $("#assignedTo option:selected").val();

                                                t.set('card', 'shared', 'assignedTo', assignedTo).then(function () {
                                                    let text = " saved estimated time:" + estimatedTime.value + ", startDate.value:" + startDate.value + ", assignedTo = " + assignedTo
                                                    $.post("https://trello-api.crewlogix.com/commentOnCard", {id: cardId.id, member: member.username, text: text, assignedTo: assignedTo, assignedToMemberId: assignedToMemberId}
                                                    , function () {
                                                        console.log('AssignedTo value = ', assignedTo)
                                                        t.closePopup();
                                                    })
                                                   // t.closePopup();
                                                })
                                            })
                                        })
                                    })
                        }else{
                            t.card('id').then(function(cardId){
                         //   console.log('cardID = ', cardId)
                            t.member('username').then(function(member){
                                
                            let assignedTo = $("#assignedTo option:selected").text();
                            let assignedToMemberId = $("#assignedTo option:selected").val();
                              
                                t.set('card','shared','assignedTo',assignedTo).then(function(){
                                    let text = " saved estimated time:"+estimatedTime.value+", startDate.value:"+startDate.value+", assignedTo = "+assignedTo
                                    $.post("https://trello-api.crewlogix.com/commentOnCard",{id:cardId.id,member:member.username,text:text,assignedTo:assignedTo,assignedToMemberId:assignedToMemberId}
                                    ,function(){
                                            console.log('AssignedTo value = ', assignedTo)  
                                    t.closePopup();
                                    })  
                                      
                                })
                               
                                    })

                                })
                        }
                    })
                })
            })
//    } 
//    else{
//        t.closePopup();
//    }
    
});
document.getElementById('startTimer').addEventListener('click', function(e){
/* switch off the recording to false always.....*/
t.set('board', 'private', 'recording', {status: false, cardUrl: ''}).then(function () {
    console.log('timer cleared')
})


        return t.get('card', 'shared','startTime', 'null')
                .then(function(time){
                    
                    if(time === 'null' || time.recordTime == false){
                  //      console.log('startTime time == null || time.recordTime == false ', time)    
                                    t.get('board','private','recording','null').then(function(recording){
                                       console.log('recording = ', recording)
                                        if(recording === 'null' || recording.status == false){
                                  //          console.log('recording =', recording)
                                            let previousTime = 0;
                                            if(time.previousTime){
                                                previousTime = time.previousTime;
                                            }
                                            else{
                                                previousTime = 0;
                                            }
                                            console.log('setting startTime = ', {recordTime: true, startTime: new Date(), previousTime: previousTime})
                                                t.set('card', 'shared', 'startTime', {recordTime: true, startTime: new Date(), previousTime: previousTime})
                                                .then(function () {
                                           //         console.log('time started')
                                                    t.card('id', 'url').then(function(cardData){
                                            //            console.log('cardData = ', cardData)
                                            
                                                t.set('board', 'private', 'recording', {status: true, cardUrl: cardData.url}).then(function () {

                                                t.member('username').then(function (member) {
                                                    console.log('username with timer problem = ', member)
                                                    $.post("https://trello-api.crewlogix.com/commentOnCard", {id: cardData.id, member: member.username, text: " started timer"},
                                                            function () {
                                                              //  t.closePopup();
                                                            })
                                                        })
                                                    })
                                               })
                                            })
                                        }
                                        
                                        else{
                                            
                                            if(recording.status){                                                
                                                  
                                               alert('Time is already getting recording at '+recording.cardUrl)
                                                        t.closePopup();
                                            }else{
                                                console.log('not recording time anywhere ', recording)
                                            }
                                        }
                                    }) 
                                }       
//                    }else{
//                     //    console.log('startTime time != null || time.recordTime != false ', time)    
//                          t.get('board','private','recording','null').then(function(recording){
//                              console.log('recording = ', recording)
//                               if(recording.status){
//                                       console.log('recording status = ', recording )
//                            //                    
//                                                 t.member('username').then(function (member) {
//                                                   console.log('username with timer on ===== ', member)
//                                                   if(member.username.includes('raonoman') || member.username.includes('hamza412'))
//                                                   {
//                                                       t.set('board', 'private', 'recording', {status: false, cardUrl: ''}).then(function () {
//                                                           console.log('timer reset' )
//                                                           alert('Time is already getting recording at '+recording.cardUrl)
//                                                        t.closePopup();
//                                                       });
//                                                   }
//                                                   
//                                                   
//                                                   })
//                                   
//                               }
//                               else{
//                                   console.log('setting startTime = ', {recordTime: true, startTime: new Date(), previousTime: time.previousTime})
//                                   t.set('card', 'shared', 'startTime', {recordTime: true, startTime: new Date(), previousTime: time.previousTime})
//                        .then(function () {
//                                    t.card('id', 'url').then(function (cardData) {
//                                        t.set('board', 'private', 'recording', {status: true, cardUrl: cardData.url}).then(function () {
//                                            t.member('username').then(function (member) {
//
//                                                $.post("https://trello-api.crewlogix.com/commentOnCard", {id: cardData.id, member: member.username, text: " started timer"},
//                                                        function () {
//                                                            t.closePopup();
//                                                        })
//                                                    //     t.closePopup();
//                                            })
//                                        })
//                                    })
//                                })
//                               }
//                        
//                          });
//                        
//                       
//                    }
                })
})
document.getElementById('stopTimer').addEventListener('click', function(){
    return t.get('card','shared','startTime','null')
            .then(function(timer){
                if(timer === 'null'){
                   // console.log('nothing was recorded', timer)
                    t.closePopup();    
                }
                else{
                 //   console.log('timer object = ', timer)
                    if(timer.recordTime){
                        var stopTime = new Date();
                        var previousTime = Math.floor((((new Date(stopTime) - new Date(timer.startTime)) / 1000) / 60)) + timer.previousTime
                        t.set('card', 'shared', 'startTime', {recordTime: false, startTime: stopTime, previousTime: previousTime, stopTime: stopTime})
                        .then(function () {
                        t.card('id', 'name', 'due', 'url','idList').then(function (cardId) {
                            
                        t.member('id', 'fullName', 'username').then(function (member) {
                     
                     
                     
                        t.get('board','shared','boardReports','null').then(function(boardReports){
                            //console.log('boardReports = ', boardReports)
                            
                               let boardReport = {}
                               let boardCards = {}
                               boardCards[cardId.url] = cardId.url
                            if(boardReports === 'null'){                             
                                boardReport[member.username] = {"date":new Date().toDateString(),"timeTotal":previousTime,"totalCards":boardCards}
                              //  console.log('previousTime logged = ', previousTime, ' and boardReport = ', boardReport )
                                t.set('board','shared','boardReports',boardReport).then(function(){
                                    console.log('boardReports data set for first time = ', boardReport)
                                })
                            }else{
                                let boardReport = boardReports;
                               // console.log('boardReport[member.username].timeTotal = ', boardReport[member.username].timeTotal)
                              //  console.log('previousTime = ', previousTime)
                                previousTime = boardReport[member.username].timeTotal + Math.floor((((new Date(stopTime) - new Date(timer.startTime)) / 1000) / 60))
                                boardReport[member.username] = {"date":new Date().toDateString(),"timeTotal":previousTime,"totalCards":boardCards}                                
                              //  console.log('previousTime logged = ', previousTime, ' and boardReport = ', boardReport )
                                t.set('board','shared','boardReports',boardReport).then(function(){
                                    console.log('boardReports data updated = ', boardReport)
                                })
                                //boardReport[member.username] = 
                                //console.log('board Reports = ')
                            }
                          t.set('board','private','recording',{status:false,cardUrl:''}).then(function(){
                                    $.post("https://trello-api.crewlogix.com/commentOnCard", {id: cardId.id, member: member.username, text: " stopped timer "}, function () {
                                //      t.closePopup();
                                    })
                                })
                            }) // t.get('board')
                            
                        
                            })// t.member
                        })// t.card
                    })
                    }
                }
            })
//    return t.set('card','shared','stopTime',new Date())
//            .then(function(){
//                
//                t.closePopup();
//            })


})
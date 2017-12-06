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
            }else{
                $('#estimatedTime').val(estimatedTime)
            }
        }).then(function(){


            t.get('card','shared','assignedTo','null').then(function(assignedTo){
                var boardMembers = t.arg('members');
                //console.log('boardMembers are = ', boardMembers)
                if(assignedTo === 'null'){
                    assignedTo ='None'
                        boardMembers.members.forEach((member)=>{
                      //      console.log('member = ', member)
                            $("#assignedTo").append("<option id='"+member.id+"' value='"+member.id+"'>"+member.fullName+"</option>")
                        })
                //    $("#assignedTo").append("<option id='-1' value='0'>None</option>");       
                  //  $("#assignedTo option:selected").text(assignedTo)
                }
                else{
                 $("#assignedTo").append("<option id='99' value='99'>None</option>");   
                    boardMembers.members.forEach((member)=>{
                   //         console.log('member = ', member)                  
                        $("#assignedTo").append("<option id='"+member.id+"' value='"+member.id+"'>"+member.fullName+"</option>")
                    })
                  //  $("#assignedTo option:selected").text(assignedTo)
                    $("#assignedTo option:selected").text(assignedTo)
                     $("#assignedTo").append("<option id='99' value='99'>None</option>");   
                    //let pValue = $("#assignedTo option:selected").text(assignedTo).val();
                    
                    
                    //$("#assignedTo option:selected").value()
                    //$("#assignedTo option:selected").value()
                      
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
            return t.set('card','shared','startDate',startDate.value)
            .then(function(){
                if(estimatedTime.value.length < 1){
                    estimatedTime.value = ''
                }
                t.set('card','shared','estimatedTime',estimatedTime.value)            
                .then(function(){
                    t.get('card', 'shared', 'startTime', 'null').then(function (time) {
                    if (time === 'null') 
                    {
                         
                            t.card('id').then(function (cardId) {
                            t.member('username').then(function (member) {
                            let assignedTo = $("#assignedTo option:selected").text();
                            let assignedToMemberId = $("#assignedTo option:selected").val();

                                t.set('card', 'shared', 'assignedTo', assignedTo).then(function () {
                                    let text = " saved estimated time:" + estimatedTime.value + ", startDate:" + startDate.value + ", assignedTo = " + assignedTo
                                    $.post("https://trello-api.crewlogix.com/commentOnCard", {id: cardId.id, member: member.username,startDate:startDate.value ,text: text, assignedTo: assignedTo, assignedToMemberId: assignedToMemberId}
                                    , function () {
              //                          console.log('AssignedTo value = ', assignedTo)
                                        t.closePopup();
                                    })
                                   // t.closePopup();
                                })
                            })
                        })
                    }else{
                        t.card('id').then(function(cardId){
                        t.member('username').then(function(member){
                        let assignedTo = $("#assignedTo option:selected").text();
                        let assignedToMemberId = $("#assignedTo option:selected").val();

                            t.set('card','shared','assignedTo',assignedTo).then(function(){
                                let text = " saved estimated time:"+estimatedTime.value+", startDate:"+startDate.value+", assignedTo = "+assignedTo
                                $.post("https://trello-api.crewlogix.com/commentOnCard",{id:cardId.id,member:member.username,startDate:startDate.value,text:text,assignedTo:assignedTo,assignedToMemberId:assignedToMemberId}
                                ,function(){
         //                               console.log('AssignedTo value = ', assignedTo)  
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
//document.getElementById('startTimer').addEventListener('click', function(e){
///* switch off the recording to false always
// * 
// * .....*/

////////t.set('card','shared','startTime',null)
////return t.remove('card','shared','startTime')
//
//console.log('inside start timer')

$("#startTimer").on('click', function(e){
console.log('inside start timer')

        return t.get('card', 'shared','startTime', 'null')
                .then(function(time){
                    console.log('inside startTime shared with time = ', time)
                    if(time === 'null' || time.recordTime == false){
                  //      console.log('startTime time == null || time.recordTime == false ', time)    
                        t.get('board','private','recording','null').then(function(recording){
                                       console.log('recording = ', recording)
                            if(recording && recording.status == false){
                                            console.log('previousTime  =', time.previousTime)
                                            let previousTime = 0;
                                            if(time.previousTime > 0){
                                                previousTime = time.previousTime;
                                            }
                                                                                       
                                            
//                            t.card('id', 'url').then(function(cardData){
//                                    t.get('card','shared','assignedTo').then(function(assignedTo){
//                                        t.member('username','id','fullName').then(function (member) {
                                            Promise.all([
                                                t.card('id', 'url'),
                                                t.get('card','shared','assignedTo'),
                                                t.member('username','id','fullName'),
                                                t.board('name')
                                            ]).spread((cardData,assignedTo,member,boardName)=>{
                                                        
//                                                        if(assignedTo.includes("hurram")){
//                                                            t.set('board', 'private', 'recording', {status: false, cardUrl: ''}).then(function () {
//                                                                  console.log('timer cleared', assignedTo)
//                                                                  alert('your timer is cleared please inform khurram')
//                                                            })
//                                                        }
//                                                        else{
//                                                            console.log('timer not cleared ', assignedTo)
//                                                        } 
                                            
                                            
                                                if(assignedTo && assignedTo.includes(member.fullName))
                                                {
                                                    Promise.all([
                                                        t.set('board', 'private', 'recording', {status: true, cardUrl: cardData.url}),
                                                        t.set('card', 'shared', 'startTime', {recordTime: true, startTime: new Date(), previousTime: previousTime})
                                                        
                                                    ]).then(function(){
                                                        console.log('saving time')
                                                        let rData = {
                                                            cData: cardData,
                                                            mData: member,
                                                            totalTime: previousTime,
                                                            boardName: boardName.name
                                                        }
                                                        $.post("https://trello-api.crewlogix.com/commentOnCard", {id: cardData.id, member: member.username, text: " started timer", rData: JSON.stringify(rData)},
                                                                        function () {
                                                                            t.closePopup();
                                                                        })
                                                    })
                                                }
                                                else{
                                                    alert("This card is not assigned to you!")
                                                    
                                                }
                                        }) 
                                    }// recording
                                    else{
//                                        t.get('card','shared','assignedTo').then(function(assignedTo){
//                                        if(assignedTo.includes("hurram")){
//                                                t.set('board', 'private', 'recording', {status: false, cardUrl: ''}).then(function () {
//                                                      console.log('timer cleared', assignedTo)
//                                                      alert('your timer is cleared please inform khurram')
//                                                })
//                                            }
//                                            else{
//                                                console.log('timer not cleared ', assignedTo)
//                                                
//                                            }  
//                                            
//                                        })
                                        if (recording.status) {
                                                       alert('Time is already getting recording at ' + recording.cardUrl)
                                                           t.closePopup();
                                                }
                                                else {
                                                    console.log('not recording time anywhere ', recording)
                                                }
                                    }

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
                })       
                
                
                
                
//document.getElementById('stopTimer').addEventListener('click', 
$("#stopTimer").on('click',function(){
     t.get('card','shared','startTime','null')
            .then(function(timer)
            {
                if(timer === 'null')
                {
                   // console.log('nothing was recorded', timer)
                    t.closePopup();    
                }
                else
                {
                    if(timer.recordTime)
                    {
                       // let boardReportsKey = "boardReports"+new Date().getDate()
                        var stopTime = new Date();
                        var previousTime = Math.floor((((new Date(stopTime) - new Date(timer.startTime)) / 1000) / 60)) + timer.previousTime
                        Promise.all([
                              t.card('id', 'name', 'due', 'url','idList'),
                              t.member('id', 'fullName', 'username'),                              
                              t.get('card','shared','assignedTo'),
                              t.board('name'),
                          ]).spread( (cardId,member,assignedTo,boardName)=>{
                          //    console.log('recording.....->',cardId,member,assignedTo)
                              let boardReportingKey = "Reporting"+member.username+":"+new Date().getDate()
                              
                              t.get('board','shared',boardReportingKey).then(function(boardReports){
                            if(assignedTo && assignedTo.includes(member.fullName))
                            {
                                Promise.all([
                                t.set('card', 'shared', 'startTime',
                                {recordTime: false, startTime: stopTime, previousTime: previousTime, stopTime: stopTime}),
                                    t.set('board','private','recording',{status:false,cardUrl:cardId.url})
                                ]).then(function()
                                {
                                    let rData = {
                                        cData: cardId,
                                        mData: member,
                                        totalTime: previousTime,
                                        boardName: boardName.name
                                    }
                                     $.post("https://trello-api.crewlogix.com/commentOnCard",
                                            {id: cardId.id, member: member.username, text: " stopped timer ", rData: JSON.stringify(rData)},
                                            function () {
                                                t.closePopup();
                                            });
                                    
                                        })
                                    
                            }
                            else
                            {
                                alert('This card is not assigned to you!')
                                 t.closePopup();
                            } // assignedTo if
                              })
                              
                          
                        }) //function close
                    }// timer
                }
            })
            
})


/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var estimatedTime = document.getElementById('estimatedTime');
var startDate = document.getElementById('startDate');
t.render(function(){
var closePopupWait = 2000;
    var closePopupFlag = 1;
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
    t.get('board','private','recording','null').then(function(recording){
        if(recording.status){            
            //$('#startTimer').attr('disabled','disabled'); 
            $('#startTimer').hide();    
        }
        else{            
            
        }
    })
    
    
    
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
                      if(member.fullName.includes('Origami-PowerUp'))
                      {
                      //    console.log('fullName = ', member.fullName)
                      }else
                      {
                         
                          $("#assignedTo").append("<option id='"+member.id+"' value='"+member.id+"'>"+member.fullName+"</option>")
                      }
                    })
                }
                else{
                 $("#assignedTo").append("<option id='99' value='99'>None</option>");   
                    boardMembers.members.forEach((member)=>{
                   if(member.fullName.includes('Origami-PowerUp'))
                      {
                          //console.log('fullName = ', member.fullName)
                      }else
                      {
                         
                          $("#assignedTo").append("<option id='"+member.id+"' value='"+member.id+"'>"+member.fullName+"</option>")
                      }
                        //$("#assignedTo").append("<option id='"+member.id+"' value='"+member.id+"'>"+member.fullName+"</option>")
                    })
                    $("#assignedTo option:selected").text(assignedTo)
                     $("#assignedTo").append("<option id='99' value='99'>None</option>");   
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
//                    if (time === 'null') 
//                    {
                         
                            t.card('id','url','due','name').then(function (cardId) {
                            t.member('username','fullName').then(function (member) {
                            t.board('name').then(function(boardName){
                              
                              let assignedTo = $("#assignedTo option:selected").text();
                            let assignedToMemberId = $("#assignedTo option:selected").val();

                                t.set('card', 'shared', 'assignedTo', assignedTo).then(function () {
                                    let text = " saved estimated time:" + estimatedTime.value + ", startDate:" + startDate.value + ", assignedTo = " + assignedTo
                                    t.get('card', 'shared','startTime', 'null').then(function(time){
                                        let rData = {
                                        cData: cardId,
                                        mData: member,
                                        totalTime: time.previousTime,
                                        boardName: boardName.name
                                    };
                                    
//                                    $.post("https://trello-api.crewlogix.com/commentOnCard", {id: cardId.id,estimatedTime:estimatedTime.value,boardName: boardName.name, member: member.username,startDate:startDate.value ,text: text, assignedTo: assignedTo, assignedToMemberId: assignedToMemberId,rData: JSON.stringify(rData)}
//                                    ,function(res){
                                        $.post("https://script.google.com/a/origamistudios.us/macros/s/AKfycbxoYQfMrzAmRKJMaNEImAtJvWX1gpyiYdFFMR9yTZ-50JgwWec/exec", {id: cardId.id,estimatedTime:estimatedTime.value,boardName: boardName.name, member: member.username,startDate:startDate.value ,text: text, assignedTo: assignedTo, assignedToMemberId: assignedToMemberId,rData: JSON.stringify(rData)},function(re){t.closePopup();});
//                                             ,function(res){
//                                                 t.closePopup();    
//                                                 })
                                     //   })
                                        if(closePopupFlag){
                                            setTimeout(function(){
                                                t.closePopup();
                                            },closePopupWait);
                                        }
                                        
                                    })
                                })
                              })
                            })
                        })
                    })
                })
            })
});


$("#startTimer").on('click', function(e){
//console.log('inside start timer')

        return t.get('card', 'shared','startTime', 'null')
                .then(function(time){
               //     console.log('inside startTime shared with time = ', time)
                    if(time === 'null' || time.recordTime == false){
                  //      console.log('startTime time == null || time.recordTime == false ', time)    
                        t.get('board','private','recording','null').then(function(recording){
                                   //    console.log('recording = ', recording)
                            if(recording === 'null' || recording.status == false){
                                            console.log('previousTime  =', time.previousTime)
                                            let previousTime = 0;
                                            if(time.previousTime > 0){
                                                previousTime = time.previousTime;
                                            }
                                
                                            Promise.all([
                                                t.card('id', 'url','due','name'),
                                                t.get('card','shared','assignedTo'),
                                                t.get('card','shared','estimatedTime'),
                                                t.member('username','id','fullName'),
                                                t.board('name'),
                                                t.get('card','shared','startDate')
                                            ]).spread((cardData,assignedTo,estimatedTime,member,boardName,startDate)=>{
                                            
                                                if(assignedTo && assignedTo.includes(member.fullName))
                                                {
                                                    Promise.all([
                                                        t.set('board', 'private', 'recording', {status: true, cardUrl: cardData.url}),
                                                        t.set('card', 'shared', 'startTime', {recordTime: true, startTime: new Date(), previousTime: previousTime})
                                                        
                                                    ]).then(function(){
                               //                         console.log('saving time')
                                                        let rData = {
                                                            cData: cardData,
                                                            mData: member,
                                                            totalTime: previousTime,
                                                            boardName: boardName.name
                                                        }
//                                                        $.post("https://trello-api.crewlogix.com/commentOnCard", {id: cardData.id,startDate:startDate,assignedTo: assignedTo,estimatedTime:estimatedTime,member: member.username, text: " started timer", rData: JSON.stringify(rData)},
//                                                        function (re) {
                                                            
                                                            $.post("https://script.google.com/a/origamistudios.us/macros/s/AKfycbxoYQfMrzAmRKJMaNEImAtJvWX1gpyiYdFFMR9yTZ-50JgwWec/exec", {id: cardData.id,startDate:startDate,assignedTo: assignedTo,estimatedTime:estimatedTime,member: member.username, text: " started timer", rData: JSON.stringify(rData)},function(re){t.closePopup();})
                                                            if(closePopupFlag){
                                            setTimeout(function(){
                                                t.closePopup();
                                            },closePopupWait);
                                        }
                                                      //  })
                                                    })
                                                }
                                                else{
                                                 //   console.log('card not asssigned')
                                                    //alert("This card is not assigned to you!#@@")
                                                    $("#alertMsg").css("color", "red");
                                                    
//                                                    return t.popup({
//                                                                title: 'This card is not assigned to you!',
//                                                                url: './settings.html',
//                                                                //args: {members: boardMembers},
//                                                                height: 184 // we can always resize later, but if we know the size in advance, its good to tell Trello
//                                                            }); 
                                                    
                                                }
                                        }) 
                                    }// recording
                                    else{
                                        console.log('recording  = ', recording)
                                        t.get('card','shared','assignedTo').then(function(assignedTo){
                                            console.log('assgiendTo in else .,, = ', assignedTo)
                                        if(assignedTo && assignedTo.includes("Muhamad3435244Shehzad")){
                                            console.log('user matched......')
                                                t.set('board', 'private', 'recording', {status: false, cardUrl: ''}).then(function () {
                                                    //  console.log('timer cleared', assignedTo)
                                                      //alert('your timer is cleared please inform khurram')
                                                      //$("#alertMsg").text("This card is not for you")
                                                      if (recording.status) {
                                                          $("#alertMsg").text('Recording Time at: ' + recording.cardUrl)
                                                       
                                                       //    t.closePopup();
                                                }
                                                else {
                               //                     console.log('not recording time anywhere ', recording)
                                                }
                                                })
                                            }
                                            else{
                                                
                                                if (recording.status) {
                                                    //   alert('Time is already getting recording at ' + recording.cardUrl)
                                                      //     t.closePopup();
                                                      $("#alertMsg").text('Recording Time at: ' + recording.cardUrl)
                                                }
                                                else {
                               //                     console.log('not recording time anywhere ', recording)
                                                }
                                                
                                            }  
                                            
                                        })
                                        
                                    }

                                })
                            }
                                        
                        else{

                            if(recording.status){                                                
                                $("#alertMsg").text("Timer already running at "+recording.cardUrl)
                               //alert('Time is already getting recording at '+recording.cardUrl)
                                      //  t.closePopup();
                            }else{
                                //console.log('not recording time anywhere ', recording)
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
                              t.get('card','shared','estimatedTime'),
                              t.board('name'),
                              t.get('card','shared','startDate')
                          ]).spread( (cardId,member,assignedTo,estimatedTime,boardName,startDate)=>{
                          //    console.log('recording.....->',cardId,member,assignedTo)
                              
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
//                                        $.post("https://trello-api.crewlogix.com/commentOnCard",
//                                            {id: cardId.id, startDate: startDate,assignedTo: assignedTo,estimatedTime:estimatedTime,member: member.username, text: " stopped timer ", rData: JSON.stringify(rData)},
//                                            function (re) {
                                                
                                            $.post("https://script.google.com/a/origamistudios.us/macros/s/AKfycbxoYQfMrzAmRKJMaNEImAtJvWX1gpyiYdFFMR9yTZ-50JgwWec/exec",
                                                {id: cardId.id, startDate: startDate,assignedTo: assignedTo,estimatedTime:estimatedTime,member: member.username, text: " stopped timer ", rData: JSON.stringify(rData)},function(re){t.closePopup(); })
                                                if(closePopupFlag){
                                            setTimeout(function(){
                                                t.closePopup();
                                            },closePopupWait);
                                        }
                                           // });
                                        })
                            }
                            else
                            {
                                //alert('This card is not assigned to you!!!')
                               $("#alertMsg").css("color", "red");
                                 //t.closePopup();
                            } // assignedTo if
                              })
                    }// timer
                }
            })
            
})


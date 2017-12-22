/*
var Promise=TrelloPowerUp.Promise,randomBadgeColor=function(){return["green","yellow","red","none"][Math.floor(4*Math.random())]},convertMinsToHrsMins=function(b){var c=Math.floor(b/60);b%=60;return(10>c?"0"+c:c)+":"+(10>b?"0"+b:b)},getBackgroundBages=function(b,c){return b.card("name").get("name").then(function(a){return[{dynamic:function(){return b.get("card","shared","startTime","null").then(function(a){if("null"===a||0==a.startTime)return{color:"none",timer:"00:00",title:"Timer"};if(a.recordTime){var b=
a.previousTime;a=Math.floor((new Date-new Date(a.startTime))/1E3/60)+b;return{color:"green",timer:convertMinsToHrsMins(a),title:"Recording Time"}}b=a.previousTime;a=Math.floor((new Date(a.stopTime)-new Date(a.startTime))/1E3/60)+b;return{color:"yellow",timer:convertMinsToHrsMins(a),title:"Timer Stopped"}}).then(function(a){return{title:a.title,text:a.timer,color:a.color,refresh:61}})}},{dynamic:function(){return b.get("card","shared","assignedTo","null").then(function(a){return"null"===a||a.includes("None")?
{title:"Assign To",text:"?",color:"yellow",refresh:10}:{title:"Assigned To",text:a,color:"green",refresh:10}})}},{dynamic:function(){return b.get("card","shared","startDate","null").then(function(a){return"null"===a||2>a.length?{title:"Start Date",text:"?",color:"yellow",refresh:10}:{title:"Start Date",text:a,color:"green",refresh:10}})}}]})},getBadges=function(b){return b.card("name").get("name").then(function(c){return[{dynamic:function(){return b.get("card","shared","startTime","null").then(function(a){if("null"===
a||0==a.startTime)return{color:"none",timer:"0",title:"Timer"};if(a.recordTime){var b=a.previousTime;a=Math.floor((new Date-new Date(a.startTime))/1E3/60)+b;return{color:"green",timer:convertMinsToHrsMins(a),title:"Recording Time"}}b=a.previousTime;a=Math.floor((new Date(a.stopTime)-new Date(a.startTime))/1E3/60)+b;return{color:"none",timer:convertMinsToHrsMins(a),title:"Timer Stopped"}}).then(function(a){return{title:a.title,text:a.timer,color:a.color,refresh:61}})}},{dynamic:function(){return b.get("card",
"shared","estimatedTime","null").then(function(a){return a}).then(function(a){return"null"===a||1>a.length?{title:"Estimated Time",text:"Estimate missing",color:"red",refresh:10}:{title:"Estimated Time",text:a,color:"green",refresh:10}})}},{dynamic:function(){return b.get("card","shared","assignedTo","null").then(function(a){return a}).then(function(a){return"null"===a||a.includes("None")?{title:"Assigned To",text:"Not Assigned",color:"none",refresh:10}:{title:"Assigned To",text:a,color:"green",refresh:10}})}},
{dynamic:function(){return b.get("card","shared","startDate","null").then(function(a){return"null"===a||1>a.length?{title:"Start Date",text:"Not Planned",color:"none",refresh:10}:{title:"Start Date",text:a,color:"green",refresh:10}})}}]})},boardButtonCallback=function(b){return b.popup({title:"Reports",items:[{text:"Today",callback:function(b){b.getAll().then(function(a){b.board("members").then(function(c){console.log("boardInfo = ",a);return b.overlay({url:"./time-reports.html",args:{boardData:a.board.shared,
recording:a.board["private"].recording}}).then(function(){return b.closePopup()})})})}},{text:"Total time logged on this project",callback:function(b){return b.overlay({url:"./overlay.html",args:{rand:(100*Math.random()).toFixed(0)}}).then(function(){return b.closePopup()})}}]})};
TrelloPowerUp.initialize({"board-buttons":function(b,c){return b.get("board","private","recording").then(function(a){return a&&a.status?[{text:"Timer is ON",url:a.cardUrl}]:[{text:"Timer is OFF",url:""}]})},"card-badges":function(b,c){return getBackgroundBages(b,c)},"card-buttons":function(b,c){return[{text:"Origami-PowerUP",callback:function(a){return a.board("members").then(function(b){return a.popup({title:"On-Time Project Management",url:"https://origami-powerup.github.io/TrelloPowerUp/settings.html",
args:{members:b},height:184})})}}]},"card-detail-badges":function(b,c){return getBadges(b)},"show-settings":function(b,c){return b.popup({title:"Origami Power Up",url:"https://origami-powerup.github.io/TrelloPowerUp/powerup.html",height:184})}});
*/
/* global TrelloPowerUp */

// we can access Bluebird Promises as follows
var Promise = TrelloPowerUp.Promise;
//var t = TrelloPowerUp.iframe();


//Trello.post()

/*
Trello Data Access
The following methods show all allowed fields, you only need to include those you want
They all return promises that resolve to an object with the requested fields
Get information about the current board
t.board('id', 'name', 'url', 'shortLink', 'members')
Get information about the current list (only available when a specific list is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.list('id', 'name', 'cards')
Get information about all open lists on the current board
t.lists('id', 'name', 'cards')
Get information about the current card (only available when a specific card is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.card('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')
Get information about all open cards on the current board
t.cards('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')
Get information about the current active Trello member
t.member('id', 'fullName', 'username')
*/

/*
Storing/Retrieving Your Own Data
Your Power-Up is afforded 4096 chars of space per scope/visibility
The following methods return Promises.
Storing data follows the format: t.set('scope', 'visibility', 'key', 'value')
With the scopes, you can only store data at the 'card' scope when a card is in scope
So for example in the context of 'card-badges' or 'attachment-sections', but not 'board-badges' or 'show-settings'
Also keep in mind storing at the 'organization' scope will only work if the active user is a member of the team
Information that is private to the current user, such as tokens should be stored using 'private'
t.set('organization', 'private', 'key', 'value');
t.set('board', 'private', 'key', 'value');
t.set('card', 'private', 'key', 'value');
Information that should be available to all users of the Power-Up should be stored as 'shared'
t.set('organization', 'shared', 'key', 'value');
t.set('board', 'shared', 'key', 'value');
t.set('card', 'shared', 'key', 'value');
If you want to set multiple keys at once you can do that like so
t.set('board', 'shared', { key: value, extra: extraValue });
Reading back your data is as simple as
t.get('organization', 'shared', 'key');
Or want all in scope data at once?
t.getAll();
*/
//
//var HYPERDEV_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Fhyperdev.svg';
//var GRAY_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg';
//var WHITE_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-white.svg';

var randomBadgeColor = function() {
  return ['green', 'yellow', 'red', 'none'][Math.floor(Math.random() * 4)];
};

var convertMinsToHrsMins = function (minutes) {
                                var h = Math.floor(minutes / 60);
                                var m = minutes % 60;
                                h = h < 10 ? '0' + h : h;
                                m = m < 10 ? '0' + m : m;
                                return h + ':' + m;
                            }


var getBackgroundBages = function(t, context){
    return t.card('name')
  .get('name').then(function(cardName){
    return [{
            dynamic: function(){
            return    t.get('card','shared','startTime','null').then(function(time){
                    if(time === 'null' || time.startTime == 0){
                        return {color:'none',timer:'00:00',title:'Timer'}
                    }
                    else{
                            if(time.recordTime){
                                var previousMinutes = time.previousTime;
                                var Minutes = Math.floor((((new Date() - new Date(time.startTime))/1000)/60 )) + previousMinutes 
                                return {color:'green',timer:convertMinsToHrsMins(Minutes), title:'Recording Time'}    
                            }else{
                                var previousMinutes = time.previousTime;
                                var Minutes = Math.floor((((new Date(time.stopTime) - new Date(time.startTime))/1000)/60 )) + previousMinutes ;
                                return {color: 'yellow', timer:convertMinsToHrsMins(Minutes), title:'Timer Stopped'}
                            }    
                    }
                }).then(function(data){
                        return {
                          title: data.title, 
                          text: data.timer,
                          color: data.color,
                          refresh: 61 // in seconds
                        };            
                })
      },
    },
    {
    dynamic: function(){            
         return   t.get('card','shared','assignedTo','null').then(function(assignedTo){
                   if(assignedTo === 'null' || assignedTo.includes('None'))
                   {
                        return {
                          title: 'Assign To',
                          text: '?',
                          //icon: HYPERDEV_ICON, // for card front badges only
                          color: 'yellow',
                          refresh: 10 // in seconds
                        };            
                   }
                   else{
                        return {
                          title: 'Assigned To', // for detail badges only
                          text: assignedTo,
                          //icon: HYPERDEV_ICON, // for card front badges only
                          color: 'green',
                          refresh: 10 // in seconds
                        };            
                   }
                       
                })
        }
    },
    {
    dynamic: function(){            
         return   t.get('card','shared','startDate','null').then(function(startDate){
                   if(startDate === 'null' || startDate.length < 2)
                   {
                        return {
                          title: 'Start Date',
                          text: '?',
                          //icon: HYPERDEV_ICON, // for card front badges only
                          color: 'yellow',
                          refresh: 10 // in seconds
                        };            
                   }
                   else{
                        return {
                          title: 'Start Date', // for detail badges only
                          text: startDate,
                          //icon: HYPERDEV_ICON, // for card front badges only
                          color: 'green',
                          refresh: 10 // in seconds
                        };            
                   }
                       
                })
        }
    }
        
      ]  
  })
    
}





var getBadges = function(t){
  return t.card('name')
  .get('name')
  .then(function(cardName){

    
    return [{
      // dynamic badges can have their function rerun after a set number
      // of seconds defined by refresh. Minimum of 10 seconds.
      dynamic: function(){
                                   
          var timer = 0;
                
            return    t.get('card','shared','startTime','null').then(function(time){
                    //console.log('startTime = ', time)
                    if(time === 'null' || time.startTime == 0){
                       // console.log('time not found ', time)
                        return {color:'none',timer:'0',title:'Timer'}
                    }
                    else{
                            if(time.recordTime){
                                var previousMinutes = time.previousTime;
                                var Minutes = Math.floor((((new Date() - new Date(time.startTime))/1000)/60 )) + previousMinutes 
                                return {color:'green',timer:convertMinsToHrsMins(Minutes), title:'Recording Time'}    
                            }else{
                                var previousMinutes = time.previousTime;
                                var Minutes = Math.floor((((new Date(time.stopTime) - new Date(time.startTime))/1000)/60 )) + previousMinutes ;
                                return {color: 'none', timer:convertMinsToHrsMins(Minutes), title:'Timer Stopped'}
                            }    
                    }
                    //return time;
                }).then(function(data){
                  //  console.log('timer ', data)
                        return {
                          title: data.title, // for detail badges only
                          text: data.timer,
                          //icon: HYPERDEV_ICON, // for card front badges only
                          color: data.color,
                          refresh: 61 // in seconds
                        };            
                })
        // we could also return a Promise that resolves to this as well if we needed to do something async first
        
      }
       
    },
    {
    dynamic: function(){            
         return   t.get('card','shared','estimatedTime','null').then(function(estimated){
                    if(estimated === 'null'){
              //          console.log('estimated = ', estimated)
                        return estimated
                    }else
                    {
                        
                 //       console.log('estimated time= ', estimated)
                        return estimated
                    }
                }).then(function(estimated){
                   if(estimated === 'null' || estimated.length < 1)
                   {
                        return {
                          title: 'Estimated Time', // for detail badges only
                          text: 'Estimate missing',
                          //icon: HYPERDEV_ICON, // for card front badges only
                          color: 'red',
                          refresh: 10 // in seconds
                        };            
                   }
                   else{
                        return {
                          title: 'Estimated Time', // for detail badges only
                          text: estimated,
                          //icon: HYPERDEV_ICON, // for card front badges only
                          color: 'green',
                          refresh: 10 // in seconds
                        };            
                   }
                       
                })
        // we could also return a Promise that resolves to this as well if we needed to do something async first
        
      }
  },{
    dynamic: function(){            
         return   t.get('card','shared','assignedTo','null').then(function(assignedTo){
                    if(assignedTo === 'null'){
              //          console.log('estimated = ', estimated)
                        return assignedTo
                    }else
                    {
                        
                 //       console.log('estimated time= ', estimated)
                        return assignedTo
                    }
                }).then(function(assignedTo){
                   if(assignedTo === 'null' || assignedTo.includes('None'))
                   {
                        return {
                          title: 'Assigned To', // for detail badges only
                          text: 'Not Assigned',
                          //icon: HYPERDEV_ICON, // for card front badges only
                          color: 'none',
                          refresh: 10 // in seconds
                        };            
                   }
                   else{
                        return {
                          title: 'Assigned To', // for detail badges only
                          text: assignedTo,
                          //icon: HYPERDEV_ICON, // for card front badges only
                          color: 'green',
                          refresh: 10 // in seconds
                        };            
                   }
                       
                })
        // we could also return a Promise that resolves to this as well if we needed to do something async first
        
      }
  },
  {
    dynamic: function(){            
         return   t.get('card','shared','startDate','null').then(function(startDate){             
                   if(startDate === 'null' || startDate.length < 1)
                   {
                        return {
                          title: 'Start Date', // for detail badges only
                          text: 'Not Planned',
                          //icon: HYPERDEV_ICON, // for card front badges only
                          color: 'none',
                          refresh: 10 // in seconds
                        };            
                   }
                   else{
                        return {
                          title: 'Start Date', // for detail badges only
                          text: startDate,
                          //icon: HYPERDEV_ICON, // for card front badges only
                          color: 'green',
                          refresh: 10 // in seconds
                        };            
                   }
                       
                })
        // we could also return a Promise that resolves to this as well if we needed to do something async first
        
      }
  },
     
    
   // {
      // card detail badges (those that appear on the back of cards)
      // also support callback functions so that you can open for example
      // open a popup on click
  //    title: 'Origami-PowerUp', // for detail badges only
  //    text: 'Project Management PopUp',
      //icon: 'http://origamistudios.us/beta_1/wp-content/uploads/2015/04/logo2.png', // for card front badges only
  //    callback: function(context) { // function to run on click
          //t.card()
  //           return t.board('members').then(function(boardMembers){
  //              return context.popup({
  //                title: 'On-Time Project Management',
  //                url: './settings.html',
  //                args: {members:boardMembers},
  //                height: 184 // we can always resize later, but if we know the size in advance, its good to tell Trello
  //              });        
  //            })
  //    }
  //  }
  //  , 
//    {
//      // or for simpler use cases you can also provide a url
//      // when the user clicks on the card detail badge they will
//      // go to a new tab at that url
//      title: 'URL Detail Badge', // for detail badges only
//      text: 'URL',
//      icon: HYPERDEV_ICON, // for card front badges only
//      url: 'https://trello.com/home',
//      target: 'Trello Landing Page' // optional target for above url
//    }
    ];
  });
};
//
var boardButtonCallback = function(t){
    
   
    // return t.remove('board','shared',['boardReports', 'boardReports:3']);
    
  return t.popup({
    title: 'Reports',
    items: [
      {
        text: 'Today',
        callback: function(t){
            t.getAll().then(function(boardInfo){
                 t.board('members').then(function (members) {
                 //   console.log('boardInfo = ', boardInfo)
                  //  var t = window.TrelloPowerUp.iframe();
                   
        
                        
                        return t.overlay({
                        url: './time-reports.html',
                        args: {boardData: boardInfo.board.shared, recording: boardInfo.board.private.recording}
                        }).then(()=>{
                         return t.closePopup();
                        })
                 })
            })
        }
      },{
        text: 'Total time logged on this project',
        callback: function(t){
          return t.overlay({
            url: './overlay.html',
            args: { rand: (Math.random() * 100).toFixed(0) }
          })
          .then(function(){
            return t.closePopup();
          });
        }
      },
//      {
//        text: 'Open Board Bar',
//        callback: function(t){
//          return t.boardBar({
//            url: './board-bar.html',
//            height: 200
//          })
//          .then(function(){
//            return t.closePopup();
//          });
//        }
//      }
    ]
  });
};
//
//var cardButtonCallback = function(t){
//  // Trello Power-Up Popups are actually pretty powerful
//  // Searching is a pretty common use case, so why reinvent the wheel
//  
//  var items = ['acad', 'arch', 'badl', 'crla', 'grca', 'yell', 'yose'].map(function(parkCode){
//    var urlForCode = 'http://www.nps.gov/' + parkCode + '/';
//    var nameForCode = '🏞 ' + parkCode.toUpperCase();
//    return {
//      text: nameForCode,
//      url: urlForCode,
//      callback: function(t){
//        // in this case we want to attach that park to the card as an attachment
//        return t.attach({ url: urlForCode, name: nameForCode })
//        .then(function(){
//          // once that has completed we should tidy up and close the popup
//          return t.closePopup();
//        });
//      }
//    };
//  });
//
//  // we could provide a standard iframe popup, but in this case we
//  // will let Trello do the heavy lifting
//  return t.popup({
//    title: 'Popup Search Example',
//    items: items, // Trello will search client side based on the text property of the items
//    search: {
//      count: 5, // how many items to display at a time
//      placeholder: 'Search National Parks',
//      empty: 'No parks found'
//    }
//  });
  
  // in the above case we let Trello do the searching client side
  // but what if we don't have all the information up front?
  // no worries, instead of giving Trello an array of `items` you can give it a function instead
  /*
  return t.popup({
    title: 'Popup Async Search',
    items: function(t, options) {
      // use options.search which is the search text entered so far
      // and return a Promise that resolves to an array of items
      // similar to the items you provided in the client side version above
    },
    search: {
      placeholder: 'Start typing your search',
      empty: 'Huh, nothing there',
      searching: 'Scouring the internet...'
    }
  });
  */
//};

// We need to call initialize to get all of our capability handles set up and registered with Trello
TrelloPowerUp.initialize({
  // NOTE about asynchronous responses
  // If you need to make an asynchronous request or action before you can reply to Trello
  // you can return a Promise (bluebird promises are included at TrelloPowerUp.Promise)
  // The Promise should resolve to the object type that is expected to be returned
//  'attachment-sections': function(t, options){
//    // options.entries is a list of the attachments for this card
//    // you can look through them and 'claim' any that you want to
//    // include in your section.
//
//    // we will just claim urls for Yellowstone
//    var claimed = options.entries.filter(function(attachment){
//      return attachment.url.indexOf('http://www.nps.gov/yell/') === 0;
//    });
//
//    // you can have more than one attachment section on a card
//    // you can group items together into one section, have a section
//    // per attachment, or anything in between.
//    if(claimed && claimed.length > 0){
//      // if the title for your section requires a network call or other
//      // potentially length operation you can provide a function for the title
//      // that returns the section title. If you do so, provide a unique id for
//      // your section
//      return [{
//        id: 'Yellowstone', // optional if you aren't using a function for the title
//        claimed: claimed,
//        icon: HYPERDEV_ICON,
//        title: 'Example Attachment Section: Yellowstone',
//        content: {
//          type: 'iframe',
//          url: t.signUrl('./section.html', { arg: 'you can pass your section args here' }),
//          height: 230
//        }
//      }];
//    } else {
//      return [];
//    }
//  },
//  'attachment-thumbnail': function(t, options){
//    // options.url has the url of the attachment for us
//    // return an object (or a Promise that resolves to it) with some or all of these properties:
//    // url, title, image, openText, modified (Date), created (Date), createdBy, modifiedBy
//    
//    // You should use this if you have useful information about an attached URL
//    // however, it doesn't warrant pulling it out into a section
//    // for example if you just want to show a preview image and give it a better name
//    
//    return {
//      url: options.url,
//      title: '👉 ' + options.url + ' 👈',
//      image: {
//        url: HYPERDEV_ICON,
//        logo: true // false if you are using a thumbnail of the content
//      },
//      openText: 'Open Sesame'
//    };
//    
//    // if we don't actually have any valuable information about the url
//    // we can let Trello know like so:
//    // throw t.NotHandled();
//  },
//  'authorization-status': function(t, options){
//    // return a promise that resolves to the object with
//    // a property 'authorized' being true/false
//    // you can also return the object synchronously if you know the answer synchronously
//    return new TrelloPowerUp.Promise((resolve) => resolve({ authorized: true }));
//  },
  'board-buttons': function(t, options){
//      //console.log('options = ', options)
//      return [
//                    {
//                        text: 'Reports',
//                        callback: boardButtonCallback
//                    }
//      ]
//      t.board('id','name').then(function(board){
//          t.get('board','shared','webhook','null').then(function(webhook){
//              if(webhook === 'null'){
//                    $.post("https://trello-api.crewlogix.com/register/webhook",
//                            {idModel: board.id, description: board.name + '/webhook', owner: 'khurramijaz2'},
//                            function (trelllo) {
//                                t.set('board', 'shared', 'webhook', 'active').then(function () {
//                                    console.log('webhook activated')
//                                })
//                            });
//              }
//          })
//      })
      
       return t.get('board','private','recording').then((recording)=>{
          // console.log('Recording = ', recording)
           
           if(recording && recording.status){
                return [
//                    {
//                        text: 'Reports',
//                        callback: boardButtonCallback
//                    },
                    {
                        text: 'Timer is ON',
                        url: recording.cardUrl,
                       // target: 'Inspiring Boards' // optional target for above url
                    }
                ];
           }else{
               return [
                    {
                        text: 'Timer is OFF',
                        url: '',
                        //target: 'Inspiring Boards' // optional target for above url
                    }
                ];
           }
           
        
       })
      
      
    
  },
  'card-badges': function(t, options){
    return getBackgroundBages(t,options)
  },
  'card-buttons': function(t, options) {
    return [{
//      // usually you will provide a callback function to be run on button click
//      // we recommend that you use a popup on click generally
     // icon: GRAY_ICON, // don't use a colored icon here
      text: 'Origami Manager',
      callback: function(t){
        return t.board('members').then(function(boardMembers){
                return t.popup({
                  title: 'Origami Manager',
                  url: 'https://origami-powerup.github.io/TrelloPowerUp/settings.html',
                  args: {members:boardMembers},
                  height: 184 // we can always resize later, but if we know the size in advance, its good to tell Trello
                });        
              })
      }
//    }, {
//      // but of course, you could also just kick off to a url if that's your thing
//      icon: GRAY_ICON,
//      text: 'Just a URL',
//      url: 'https://developers.trello.com',
//      target: 'Trello Developer Site' // optional target for above url
    }];
  },
  'card-detail-badges': function(t, options) {
    return getBadges(t);
  }
//  'card-from-url': function(t, options) {
//    // options.url has the url in question
//    // if we know cool things about that url we can give Trello a name and desc
//    // to use when creating a card. Trello will also automatically add that url
//    // as an attachment to the created card
//    // As always you can return a Promise that resolves to the card details
//    
//    return new Promise(function(resolve) {
//      resolve({
//        name: '💻 ' + options.url + ' 🤔',
//        desc: 'This Power-Up knows cool things about the attached url'
//      });
//    });
//    
//    // if we don't actually have any valuable information about the url
//    // we can let Trello know like so:
//    // throw t.NotHandled();
//  },
//  'format-url': function(t, options) {
//    // options.url has the url that we are being asked to format
//    // in our response we can include an icon as well as the replacement text
//    
//    return {
//      icon: GRAY_ICON, // don't use a colored icon here
//      text: '👉 ' + options.url + ' 👈' 
//    };
//    
//    // if we don't actually have any valuable information about the url
//    // we can let Trello know like so:
//    // throw t.NotHandled();
//  },
//  ,'show-authorization': function(t, options){
//    // return what to do when a user clicks the 'Authorize Account' link
//    // from the Power-Up gear icon which shows when 'authorization-status'
//    // returns { authorized: false }
//    // in this case we would open a popup
//    return t.popup({
//      title: 'My Auth Popup',
//      url: './powerup.html', // this page doesn't exist in this project but is just a normal page like settings.html
//      height: 140,
//    });
//  },
//  
  ,
  'show-settings': function(t, options){
    // when a user clicks the gear icon by your Power-Up in the Power-Ups menu
    // what should Trello show. We highly recommend the popup in this case as
    // it is the least disruptive, and fits in well with the rest of Trello's UX
    return t.popup({
      title: 'Origami Manager',
      url: 'https://origami-powerup.github.io/TrelloPowerUp/powerup.html',
      height: 184 // we can always resize later, but if we know the size in advance, its good to tell Trello
    });
  }
});

//console.log('Loaded by: ' + document.referrer);

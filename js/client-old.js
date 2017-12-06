/* global TrelloPowerUp */

// we can access Bluebird Promises as follows
var Promise = TrelloPowerUp.Promise;

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

var HYPERDEV_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Fhyperdev.svg';
var GRAY_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg';
var WHITE_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-white.svg';

var randomBadgeColor = function() {
  return ['green', 'yellow', 'red', 'blue'][Math.floor(Math.random() * 4)];
};


var startTimer = false;

var cardNames = {};
var time = 0;
var updateTime = function(t,name){
    
    
// t.get('card','shared','time')
//        .then(function(time){
//            time = new Date(time).getTime() / 1000;
//        })
//    return time;
    
        if(cardNames[name]){            
            //return myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds();            
            
            if(cardNames[name].start){
                    var timeNow = (new Date).getTime();
                    var startTime = cardNames[name].startTime.getTime();
                    var difference = Math.floor( ((timeNow - startTime) / 1000) / 60);
                    if(difference > 1)
                    {
                        return difference + ' minutes'    
                    }else{
                        return ((timeNow - startTime) / 1000) + ' seconds'    
                    }    
            }
            else{
                return 'total time'
            }
        }
        else{
            return "00:00:00";
        }
}

var getBadges = function(t){
  return t.card('name')
  .get('name')
  .then(function(cardName){
    return [{
      dynamic: function(){
          
        return {
          title: 'Timer', // for detail badges only
          text: updateTime(t,cardName),
          color: 'green',
          refresh: 1 // in seconds
        };
      }
    }, 

    {
     
      title: ' ', // for detail badges only
      text: 'Start Timer',
      color: 'green',
      //icon: HYPERDEV_ICON, // for card front badges only
      callback: function(context) { // function to run on click
          
          cardNames[cardName] = {
                start:true,
                startTime:new Date,
                stop:false,
                counter:0
            }
          //  t.set('card', 'shared', 'time', new Date());
      }
    }, 
    {
     
      title: ' ', // for detail badges only
      text: 'Stop Timer',
      color: 'red',
      //icon: HYPERDEV_ICON, // for card front badges only
      callback: function(context) { // function to run on click
          
          cardNames[cardName].start = false;
          cardNames[cardName].endTime = new Date()
          cardNames[cardName].totalSeconds = (cardNames[cardName].endTime.getTime() - cardNames[cardName].startTime.getTime())/1000
          console.log('cardNames[',cardName,'] = ', cardNames[cardName])
         
      }
    },

    ];
  });
};



TrelloPowerUp.initialize({
  'card-detail-badges': function(t, options){
    return getBadges(t);
  },
  'card-badges': function(t, options){
    return getBadges(t);
  },
});

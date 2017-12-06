'use strict'
function sleep(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
          break;
        }
      }
    }

let getBoards = () =>{
    console.log('getBoards...')
    let processBoards = (boardsList)=>{
        return new Promise((res,rej)=>{
            let allPromises = [];
            boardsList.forEach((board)=>{
                sleep(100)
                allPromises.push( new Promise((resolve,reject)=>{
                    Trello.get('/board/'+board.id+'/members/',(members)=>{
                       
                       let boardDivs = `
<div style="border:1px solid green;margin:5px;padding:5px;">
                        <div>
                                <a href="${board.shortUrl}"><b>${board.name}</b></a>
                        <a href=""> Product / Project Reports </a>
                        </div>
                        <div style="border:1px solid blue;margin:5px;padding:5px">
                        <p><b>Members</b></p>
                        
`;
                        
                        members.forEach((member)=>{
                            let membersDiv = `
                                            <p>FullName: <b>${member.fullName}</b> - Username:${member.username}-id:${member.id} <a href=""> get report</a></p>
                                        `;
                            boardDivs += membersDiv
                        });
                        boardDivs += `</div>`;
                       $('#boards-section').append(boardDivs)
                       console.log({board:board,members:members});
                        resolve({board:board,members:members})
                    });
                }));
            })
            Promise.all(allPromises).then((end)=>{
                res(end)
            })
        })
            
    }
    


    let processMembers = (membersList)=>{
        
        return new Promise((res,reject)=>{
        let memberPromises = [];
        Object.keys(membersList).forEach((member)=>{
            sleep(300)
              memberPromises.push(new Promise((resolve,reject)=>{
                 // console.log('getting actions for ', member)
                Trello.get('/members/'+member+'/actions',(actions)=>{
                      //  $('#boards-section').append('<h2> Member Name = '+member+'</h2>')
                   //   console.log('resolving....',member)
                        resolve({member:member,actions:actions})
                    });    
                }));
                
              
          });
          Promise.all(memberPromises).then((actions)=>{
              res(actions)
          })
        });
    }  
        let printMemberActions = (actions) =>{
            actions.forEach((memberAction)=>{
                console.log('memberAction = ', memberAction)
                $('#boards-section').append(`<h2>${memberAction.member}</h2>`)
//                memberAction.actions.forEach((eachAction)=>{
//                    $('#boards-section').append(`<p>${JSON.stringify(eachAction)}</p>`)
//                    $.post('http://107.170.82.21:9990/recordActions',eachAction,(res)=>{
//                        console.log('recorded')
//                    })
//                });
            })
        }      
    var success = function (successMsg) {
        processBoards(successMsg).then((allBoards)=>{
            let allBoardsLength = allBoards.length;
            let allMembers = {};
           // console.log('All boards with members = ', allBoards)
            allBoards.forEach((board)=>{
                    let membersArrayLength = board.members.length;
                    board.members.forEach((member)=>{
                        let mid = member.username;
                        allMembers[mid] = member;
                        membersArrayLength--;
                    })
                    allBoardsLength--;
                })
               // console.log('allBoardsLength = ', allBoardsLength,'AllMembers length= ', allMembers)
                if(allBoardsLength === 0){
                    processMembers(allMembers).then((actions)=>{
                      printMemberActions(actions)
                    })
                }
            })
    };

    var error = function (errorMsg) {        
        console.log('boards Error = ', errorMsg)
    };

Trello.get('/member/me/boards', success, error);
    
}



var authenticationSuccess = function() { console.log('Successful authentication'); getBoards(); };
var authenticationFailure = function() { console.log('Failed authentication'); };
Trello.authorize({
  type: 'popup',
  name: 'Getting Started Application',
  scope: {
    read: 'true',
    write: 'true' },
  expiration: 'never',
  success: authenticationSuccess,
  error: authenticationFailure
});

let db = {
};

let promptDb = [
  "Your prompt one is",
  "Your prompt two is",
  "Your prompt three is",
  "Your prompt four is",
  "Your prompt five is",
  "Your prompt six is",
  "Your prompt seven is",
];

let currCol = 0;
let autoId = 0;
let openedID = null;
let answered = false;
let recorded = false;
let reRecordCount = -1;
let videoData;

var options = {
  controls: true,
  width: 320,
  height: 240,
  fluid: false,
  controlBar: {
      volumePanel: false
  },
  plugins: {
      record: {
          audio: false,
          video: true,
          maxLength: 5,
          debug: true,
      }
  }
};



$(document).ready(function() {
  // Getting localstorage item
  if(localStorage.length > 0) {
    for(let item in localStorage) {
      if(item == 'length') {
        break;
      } else {
        let retrievedData = JSON.parse(localStorage.getItem(item));
        let newCard
        retrievedData.userid = autoId
        db[autoId] = retrievedData;

        if(!retrievedData.finished) {
            newCard = `
                  <div class="card selfie" style="width: 18rem;">
                    <video autoplay muted loop name="Video Name" src="${retrievedData.video}"></video>
                    <div class="card-body">
                      <button class="btn btn-primary gettingUser" data-toggle="modal" data-target="#userModal" id="user${autoId}">Select Portrait</button>
                    </div>
                  </div>
            `;
            switch (currCol) {
              case 0:
                // statements_1
                $('.self-col-1').prepend(newCard);
                currCol++;
                break;
              case 1:
                $('.self-col-2').prepend(newCard);
                currCol++;
                break;
              case 2:
                $('.self-col-3').prepend(newCard);
                currCol = 0;
                break;
              default:
                // statements_def
                break;
            }
        } else {
          newCard = `
                  <div class="card selfie" style="width: 18rem;">
                    <video autoplay muted loop name="Video Name" src="${retrievedData.video}"></video>

                    <div class="card-body">
                      <button class="btn btn-primary" data-target="#userModal" id="user${autoId}" style="background-color: #009d93 !important; opacity: 0.6; border: none; outline: none">Completed</button>
                    </div>
                  </div>
            `;

            switch (currCol) {
              case 0:
                // statements_1
                $('.self-col-1').append(newCard);
                currCol++;
                break;
              case 1:
                $('.self-col-2').append(newCard);
                currCol++;
                break;
              case 2:
                $('.self-col-3').append(newCard);
                currCol = 0;
                break;
              default:
                // statements_def
                break;
            }

                    //             <ul class="list-group list-group-flush">
                    //   <li class="list-group-item">${retrievedData.promp[0].sentence}</li>
                    //   <li class="list-group-item">${retrievedData.promp[1].sentence}</li>
                    //   <li class="list-group-item">${retrievedData.promp[2].sentence}</li>
                    // </ul>
        }




        autoId++;
      }
    }
  }


  var player = videojs('myVideo', options, function() {
      // print version information at startup
      var msg = 'Using video.js ' + videojs.VERSION +
          ' with videojs-record ' + videojs.getPluginVersion('record') +
          ' and recordrtc ' + RecordRTC.version;
      videojs.log(msg);
  });
  // error handling
  player.on('deviceError', function() {
      // console.warn('device error:', player.deviceErrorCode);
  });
  player.on('error', function(element, error) {
      // console.error(error);
  });
  // user clicked the record button and started recording
  player.on('startRecord', function() {
      // console.log('started recording!');
  });
  // user completed recording and stream is available
  player.on('finishRecord', function() {
      // the blob object contains the recorded data that
      // can be downloaded by the user, stored on server etc.
      reRecordCount++;
      recorded = true;
      var serverUrl = 'http://localhost:8080/video';

      var formData = new FormData();
      formData.append('data', JSON.stringify({videoId: autoId}));
      formData.append('file', player.recordedData, player.recordedData.name);
      player.record().saveAs({'video': 'IAMVIDEO' + autoId + '.webm'});

      fetch(serverUrl, {
        method: 'POST',
        body: formData
      }).then(
          success => console.log('upload recording complete.')
      ).catch(
          error => console.error('an upload error occurred!')
      );

      // player.record().saveAs({'video': 'my-video-file-name.webm'});
  });

  $('.newSelfieSummision').on('click', function() {

    // alert("entered");
    let prompts = {};
    let visitorName = "N/A";
    let visitorEmail = "N/A";
    let videoPath;
    if(reRecordCount == 0) {
      videoPath = `file:///Users/leoruan/Downloads/IAMVIDEO${autoId}.webm`
    } else {
      videoPath = `file:///Users/leoruan/Downloads/IAMVIDEO${autoId} (${reRecordCount}).webm`
    }

    let videoEle = "";
    for(let i = 0; i < 5; i++) {
      if(!$('.promptAnswer')[i].value) {
        alert("You did not enter all five the words");
        return
      }
      prompts[i] = {
        myAnswer: $('.promptAnswer')[i].value
      }
    }

    if(!visitorName) {
      alert("Please enter your name");
      return;
    } else if (!recorded) {
      alert("Please record a short video of yourself that might help others to describe you.");
      return;
    }
    // Getting video file

    videoEle = `<video autoplay muted loop name="Video Name" src="${videoPath}"></video>`

    let newInput = {
      userid: autoId,
      username: visitorName,
      usermail: visitorEmail,
      promp: prompts,
      video: videoPath,
      finished: false,
    }



    db[autoId] = newInput;

    // console.log(db);
    localStorage.setItem(autoId, JSON.stringify(newInput));

    autoId++;


    let newCard = `
          <div class="card selfie" style="width: 18rem;">
            ${videoEle}
            <div class="card-body">
              <button class="btn btn-primary gettingUser" data-toggle="modal" data-target="#userModal" id="user${newInput.userid}">Select Portrait</button>
            </div>
          </div>
    `;

    switch (currCol) {
      case 0:
        // statements_1
        $('.self-col-1').prepend(newCard);
        currCol++;
        break;
      case 1:
        $('.self-col-2').prepend(newCard);
        currCol++;
        break;
      case 2:
        $('.self-col-3').prepend(newCard);
        currCol = 0;
        break;
      default:
        // statements_def
        break;
    }

    $('#exampleModal').modal('hide');
    // $(".addNewCard").removeAttr('data-toggle');
    answered = false;
    recorded = false;
    reRecordCount = -1;

  })


  $('.image_area').on('click', 'button.gettingUser', function() {
    let user = db[this.id.slice(4)];

    // $('.user_name')[0].innerHTML = user.username;

    // Getting video file
    let video = `<video autoplay muted loop name="Video Name" src="${user.video}" class="userVideo"></video>`
    $('.user_bottom').append(video);
    // reader.readAsDataURL(user.video);

    openedID = user.userid

  });

  $('.submitPrompt').on('click', function() {
    // console.log(visitorAnswer);
    let user = db[openedID];
    for(let i = 0; i < 5; i++) {
      if($('.visitorAnswer')[i].value == '') {
        alert("Please answer the all the words.");
        return;
      }
      user.promp[i]['yourAnswer'] = $('.visitorAnswer')[i].value;
    }
    db[openedID].finished = true;

    localStorage.removeItem(user.userid);
    localStorage.setItem(user.userid, JSON.stringify(user));

    $('#user' + user.userid).css({
      "background-color": "#009d93",
      "opacity": "0.6",
      "border": "none",
    });

    $('#user' + user.userid)[0].innerHTML = "Completed";
    $('#user' + user.userid).removeClass('gettingUser');
    $('#user' + user.userid).removeAttr('data-toggle');

    answered = true;
    // $(".addNewCard").attr({
    //   "data-toggle": "modal"
    // });


    // let videofile = File.createFromFileName(user.video);
    console.log(JSON.parse(JSON.stringify(user)));


    // Sending data
    $.ajax({
      url: 'http://localhost:8080/upload',
      type: 'POST',
      processData: false,
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(user),
    })
    .done(function() {
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });


    $('#userModal').modal('hide');
    $("#exampleModal").modal({
      backdrop: 'static',
      keyboard: false
    });
  });


  $('#exampleModal').on('hidden.bs.modal', function () {
    // do something…
    $('#myForm')[0].reset();
    player.record().reset();
  });

  $('#userModal').on('hidden.bs.modal', function () {
    // do something…
    $('.user_bottom').children()[0].remove();
    for(let i = 0; i < 5; i++) {
      $('.visitorAnswer')[i].value = "";
    }
  });


})

function getRandom(anInt) {
  return Math.floor(Math.random() * Math.floor(anInt));
}



// IMPORTANT
// BEFORE ADDING DEFAULT INPUTS, REMEMBER TO CHANGE IN IP ADDRESS CONST FROM interface.js

// To disable/enable add new card
// Step 1: Remove/Add back data modal on index.html line 35
// Step 2: Comment out/Uncomment line 214 - 227
// Step 3: Comment out/Uncomment line 258 - 261
// Step 4: Comment out/Uncomment line 362 - 3563










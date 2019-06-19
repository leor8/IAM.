const IPAddress = "192.168.1.66"

$(document).ready(function() {
    $.get(`http://${IPAddress}:8080/allData`, function(data) {
      /*optional stuff to do after success */
      console.log("retrieved", data);
      for(let each in data) {

        if(data[each].final) {
          console.log(data[each]);
          let user = data[each].final;
          const arrayBuffer = data[each].videoObj.data
          var video = new Blob([new Uint8Array(arrayBuffer)], { type: "video/webm" });
          var videoObj = URL.createObjectURL(video);
          // $('.testVideo').attr('src', `${URL.createObjectURL(video)}`);

          let newInput = `
              <div style="border: 1px solid black;" id="${user.userid}">
                <h4>${user.username}</h4>
                <ol>
                  <li><b>I am</b> ${user.promp[0]["myAnswer"]}. <b>You are</b> ${user.promp[0]["yourAnswer"]} </li>
                  <li><b>I am</b> ${user.promp[1]["myAnswer"]}. <b>You are</b> ${user.promp[1]["yourAnswer"]} </li>
                  <li><b>I am</b> ${user.promp[2]["myAnswer"]}. <b>You are</b> ${user.promp[2]["yourAnswer"]} </li>
                  <li><b>I am</b> ${user.promp[3]["myAnswer"]}. <b>You are</b> ${user.promp[3]["yourAnswer"]} </li>
                  <li><b>I am</b> ${user.promp[4]["myAnswer"]}. <b>You are</b> ${user.promp[4]["yourAnswer"]} </li>
                </ol>
                <!-- A video here -->
                <video autoplay muted loop class="testVideo" type="video/webm" style="width: 200px; height: 200px" src="${videoObj}">
                </video>
                <button class="isdone" onclick="deleteUser(${user.userid})">Finish</button>
              </div>
          `

          $('body').append(newInput);
        }
      }
    }).fail(function(err){ console.log(err) });


  // $('body').on('click', 'button.isdone', function() {

  //   let deleteUserId = $('.isdone')[0].id;
  //   let user = {user: deleteUserId}
  //   if(confirm('Delete?')) {
  //     $('.isdone')[0].parent().remove();
  //     // Sending data
  //     $.ajax({
  //       url: `http://${IPAddress}:8080/deleteId`,
  //       type: 'POST',
  //       processData: false,
  //       contentType: 'application/json',
  //       dataType: 'json',
  //       data: JSON.stringify(user),
  //     })
  //     .done(function() {
  //       console.log("success");
  //     })
  //     .fail(function() {
  //       console.log("error");
  //     })
  //     .always(function() {
  //       console.log("complete");
  //     });
  //   } else {
  //     return;
  //   }

  // });

})

function deleteUser(userid) {
  let user = {user: userid}

  if(confirm('Delete?')) {
    let elem = $('#' + userid)[0];
    elem.parentNode.removeChild(elem);

    // Sending data
    $.ajax({
      url: `http://${IPAddress}:8080/deleteId`,
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
  } else {
    return;
  }

}









function getVideoInfo() {
  const url = $("#url-input").val();
  if (!url) {
    console.log("empty");
    $("#url-error-msg").text("Field can't be empty.");
    $("#url-error-msg").css({ display: "block" });
  }
  const url_regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
  if (url_regex.test(url)) {
    let loader = `<div class="d-flex justify-content-center">
            <div
              id="loader"
              class="spinner-border text-primary center"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>`;
    $("#video-card-container").html(loader);
    $("#url-error-msg").text("");
    $("#url-error-msg").css({ display: "none" });
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/getVideoInfo",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        video_id: url,
      }),
      success: function (res) {
        $("#loader").css({ display: "none" });
        if (res.status === "fail") {
          const toastLiveExample = document.getElementById("liveToast");
          $("#toastHeading").text("Error!");
          $("#toastBody").text("Something went wrong! Try again");
          const toastBootstrap =
            bootstrap.Toast.getOrCreateInstance(toastLiveExample);
          toastBootstrap.show();
          return;
        }
        const allowedAudioFormats = res.allowedAudioFormats;
        const allowedVideoFormats = res.allowedVideoFormats;
        let audioElement = '<p class="p-0 m-0">Sorry! Not Found.</p>';
        let videoElement = '<p class="p-0 m-0">Sorry! Not Found.</p>';
        let audioOptions = "";
        allowedAudioFormats.forEach((elem) => {
          audioOptions += `<div class="form-check">
                                <input class="form-check-input" data-container="${elem.container}" value="${elem.itag}" type="radio" name="format" id="audio" value="audio">
                                <label class="form-check-label" for="audio" style="font-weight: 600">${elem.size}(${elem.container})</label>
                            </div>`;
        });
        if (audioOptions != "") {
          audioElement = audioOptions;
        }

        let videoOptions = "";
        allowedVideoFormats.forEach((elem) => {
          videoOptions += `<div class="form-check">
                                <input class="form-check-input" data-container="${elem.container}" value="${elem.itag}" type="radio" name="format" id="audio" value="audio">
                                <label class="form-check-label" for="audio" style="font-weight: 600">${elem.size}(${elem.container})</label>
                            </div>`;
        });
        if (videoOptions != "") {
          videoElement = videoOptions;
        }
        let downloadButton =
          "<button class='btn btn-outline-primary' type='button' id='download' onclick='downloadContent()'>Download</button>";
        if (!audioElement || !videoElement) {
          downloadButton =
            "<button class='btn btn-outline-primary' disabled id='download'>Download</button>";
        }
        let videoCard = `<div class="card">
                <img class="card-img-top" src="${res.thumbnail.url}" alt="${res.title}" />
                <div class="card-body">
                <h5 id="videoTitle" class="card-title">${res.title}</h5>
                <div class="">
                    <p class="p-0 m-0" style="font-weight: bold">What format you want to download?</p>
                    <div class='row'>
                        <div class='col-4'>
                            <p class="p-0 m-0" style="font-weight: bold">Audio</p>
                            ${audioElement}
                        </div>
                        <div class='col-4'>
                            <p class="p-0 m-0" style="font-weight: bold">Video</p>
                            ${videoElement}
                        </div>
                        <div class='col-4' id="button_container" style="display:flex; justify-content:center;align-items:center">
                            ${downloadButton}
                        </div>

                    </div>
                </div>
                </div>
            </div>`;
        $("#video-card-container").html(videoCard);
      },
    });
  } else {
    $("#url-error-msg").text("Enter correct youtube URL.");
    $("#url-error-msg").css({ display: "block" });
  }
}

function downloadContent() {
  const selectedItag = $('input[name="format"]:checked');
  const container = selectedItag.attr("data-container");
  const itagValue = selectedItag.val();
  const URL = $("#url-input").val();
  let videoTitle = $("#videoTitle").text();
  videoTitle = videoTitle.substring(0, 15);
  let loader = `<div class="d-flex justify-content-center">
            <div
              id="loader"
              class="spinner-border text-primary center"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>`;
  $("#button_container").html(loader);
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/downloadContent",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      container,
      itagValue,
      videoTitle,
      URL,
    }),
    success: function (data) {
      const path = data.path;
      let downloadableLink = `<a href="${path}" download>Click To Save</a>`;
      $("#button_container").html(downloadableLink);
    },
  });
}

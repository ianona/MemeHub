$(document).ready(function () {
    $("#status").val("public")
    $("#public-button").css('background-color', '#c76d00');
    $("div#share_field").css('display','none')

    $("#private-button").click(function () {
        $(this).css('background-color', '#c76d00');
        $("#public-button").css('background-color', '#e89c23')
        $("div#share_field").css('display','block')

        $("#status").val("private")
    });

    $("#public-button").click(function () {
        $(this).css('background-color', '#c76d00');
        $("#private-button").css('background-color', '#e89c23')
        $("div#share_field").css('display','none')

        $("ul#upload_share").tagit("removeAll");
        $("#status").val("public")
    });

    $("#share-button").click(uploadMeme)
    var options = {
        beforeSubmit: showRequest,  // pre-submit callback
        success: showResponse  // post-submit callback
    };

    // bind to the form's submit event
    $('#frmUploader').submit(function () {
        $(this).ajaxSubmit(options);
        return false;
    });

    $("#upload").click(prepareUpload)

    $("i.share").click(prepareShare)
    $("div#share").click(shareMeme)

    //$(".chosen_users").chosen();
    $("ul#share_users").tagit();
    $("ul#upload_share").tagit();
    $("ul#upload_tags").tagit();

    prepareFile()
})

function prepareUpload() {
    let username = $("span.username").attr("data-name")
    $("ul#upload_share").tagit("removeAll");
    $.ajax({
        url: '../user/getUsers',
        method: 'GET',
        data: { username },
        success: function (res) {
            users = []
            for (i = 0; i < res.users.length; i++)
                users.push(res.users[i].username)
            $("ul#upload_share").tagit({
                showAutocompleteOnFocus: true,
                availableTags: users,
                beforeTagAdded: function (event, ui) {
                    if ($.inArray(ui.tagLabel, users) == -1) {
                        return false;
                    }
                }
            });
        }
    })
    $(".upload_modal").modal('show')
}

function prepareShare() {
    if (!$(this).hasClass("disabled")) {
        let username = $("span.username").attr("data-name")
        //$("ul#share_users li").remove()
        $("ul#share_users").tagit("removeAll");
        $.ajax({
            url: '../user/getUsers',
            method: 'GET',
            data: { username },
            success: function (res) {
                users = []
                for (i = 0; i < res.users.length; i++)
                    users.push(res.users[i].username)
                $("ul#share_users").tagit({
                    availableTags: users,
                    beforeTagAdded: function (event, ui) {
                        if ($.inArray(ui.tagLabel, users) == -1) {
                            return false;
                        }
                    }
                });
            }
        })
    
        let id = $(this).attr('data-id')
        $.post(
            '../meme/viewMeme',
            { id },
            function (data, status) {
                if (status === 'success') {
                    for (i = 0; i < data.meme.shared_users.length; i++) {
                        $('ul#share_users').tagit('createTag', data.meme.shared_users[i]);
                    }
                }
            })
        
        $("form#shareMeme").attr("data-id", id)
        $(".share_modal").modal('show')
    }
    
}

function shareMeme() {
    let shared_users = $("ul#share_users").tagit("assignedTags");
    if (shared_users == null || shared_users.length == 0)
        shared_users = []
    let id = $("form#shareMeme").attr("data-id")

    $.ajax({
        url: '../meme/updateSharedUsers',
        method: 'GET',
        data: { id, shared_users },
        success: function (res) {
            $(".share_modal").modal('hide')
        }
    })
}

function prepareFile() {
    const realFileBtn = document.getElementById("real-file");
    const customBtn = document.getElementById("custom-button");
    
    customBtn.addEventListener("click", function () {
        realFileBtn.click();
    })

    realFileBtn.addEventListener('change', readURL, false);

    var dropbox;
    dropbox = document.getElementById("uploader");
    dropbox.addEventListener("dragenter", dragenter, false);
    dropbox.addEventListener("dragover", dragover, false);
    dropbox.addEventListener("drop", drop, false);
}

function showRequest(formData, jqForm, options) {
    // alert('Uploading is starting.');
    return true;
}

// post-submit callback
function showResponse(responseText, statusText, xhr, $form) {
    if (statusText === "success") {
        let tagArray = $("ul#upload_tags").tagit("assignedTags");
        for (i = 0; i < tagArray.length; i++) {
            let cur = $("input[name=tags_upload]").val()
            $("input[name=tags_upload]").val(cur + " " + tagArray[i])
        }

        if ($("#status").val() == "private"){
            let shareArray = $("ul#upload_share").tagit("assignedTags");
            for (i = 0; i < shareArray.length; i++) {
                let cur = $("input[name=share_upload]").val()
                $("input[name=share_upload]").val(cur + " " + shareArray[i])
            }
        } else {
            $("ul#upload_share").tagit("removeAll");
        }

        $("#uploadForm").submit()
    }
    //alert('status: ' + statusText + '\n\nresponseText: \n' + responseText );
}

function uploadMeme() {
    $('#frmUploader').submit()
}

function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
}

function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    var dt = e.dataTransfer;
    var files = dt.files;
    var imageLoader = document.getElementById('real-file');

    imageLoader.files = files;
}

function readURL(input) {
    const realFileBtn = document.getElementById("real-file");
    const customTxt = document.getElementById("custom-text");
    if (realFileBtn.value) { //if a file is chosen
        let filename = realFileBtn.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1]
        customTxt.innerHTML = filename;
        let date = Date.now()
        $("#hiddenFile").val(date+"_"+filename)
        $("#hiddenFile2").val(date+"_"+filename)
    } else
        customTxt.innerHTML = "No meme chosen yet";

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#preview')
                .attr('src', e.target.result);
        };

        $("div.preview").css("display", "block")
        $("img#preview").css("display", "block")

        reader.readAsDataURL(input.files[0]);
    }
}
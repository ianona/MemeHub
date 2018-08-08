$(document).ready(function(){
    //shared users
    $('#tags').keypress(tags_tagMeme)
    $("#status").val("public")
    $("#public-button").css('background-color', '#c76d00');

    $("#private-button").click(function(){
        $(this).css('background-color', '#c76d00');
        $("#public-button").css('background-color', '#e89c23')

        $("#status").val("private")
    });

    $("#public-button").click(function(){
        $(this).css('background-color', '#c76d00');
        $("#private-button").css('background-color', '#e89c23')

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
    
    $("span.share").click(prepareShare)
    $("div#share").click(shareMeme)
    
    //$(".chosen_users").chosen();

    prepareFile()
})

function prepareUpload(){
    let username = $("span.username").attr("data-name")
    $.ajax({
        url:'getUsers',
        method: 'GET',
        data: {username},
        success: function(res){
            $('.chosen_users').empty()
            for (i = 0; i<res.users.length;i++){
                $('.chosen_users').append($('<option>', {
                    value: res.users[i].username,
                    text: res.users[i].username
                }));
                //$(".chosen_users").trigger("chosen:updated");
            }
        }
    })
    $(".upload_modal").modal('show')
}

function prepareShare(){
    let username = $("span.username").attr("data-name")
    $.ajax({
        url:'getUsers',
        method: 'GET',
        data: {username},
        success: function(res){
            $('.chosen_users').empty()
            for (i = 0; i<res.users.length;i++){
                $('.chosen_users').append($('<option>', {
                    value: res.users[i].username,
                    text: res.users[i].username
                }));
            }
        }
    })
    
    let id = $(this).attr('data-id')
    $.post(
        'viewMeme',
        {id},
        function(data,status){
            if (status === 'success') {
                for (i = 0; i < data.meme.shared_users.length; i++) { 
                    $('.chosen_users option[value=' + data.meme.shared_users[i] + ']').attr('selected', true);
                }
            }
        })
    
    $("form#shareMeme").attr("data-id", id)
    $(".share_modal").modal('show')
}

function shareMeme(){
    let shared_users2 = $("select#share_users").val()
    let id = $("form#shareMeme").attr("data-id")
    console.log($("select#share_users").val())
    
    $.ajax({
        url:'updateSharedUsers',
        method: 'POST',
        data: {id, shared_users2},
        success: function(res){
            $(".share_modal").modal('hide')
        }
    })
}

function prepareFile(){
    const realFileBtn = document.getElementById("real-file");
    const customBtn = document.getElementById("custom-button");
    const customTxt = document.getElementById("custom-text");

    customBtn.addEventListener("click", function() {
        realFileBtn.click();
    })

    realFileBtn.addEventListener("change", function(){
        if(realFileBtn.value){ //if a file is chosen
            let filename=realFileBtn.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1]
            customTxt.innerHTML = filename;
            $("#hiddenFile").val(filename)
            console.log($("#hiddenFile").val())
        } else
            customTxt.innerHTML = "No meme chosen yet";
    })
}

function showRequest(formData, jqForm, options) {
    // alert('Uploading is starting.');
    return true;
}

// post-submit callback
function showResponse(responseText, statusText, xhr, $form) {
    if (statusText === "success") {
        for (i=0;i<tagArray.length;i++){
            let cur = $("input[name=tags]").val()
            $("input[name=tags]").val(cur+" "+tagArray[i])
        }
        $("#uploadForm").submit()
    }
    //alert('status: ' + statusText + '\n\nresponseText: \n' + responseText );
}

function uploadMeme(){
    $('#frmUploader').submit()
}

var tagArray = [];

function remove_tagMeme(){
    var input = $(this).attr('data-tag-name');

    for (i=0; i<=tagArray.length; i++) {
        if(tagArray[i] == input) {
            delete tagArray[i];
        }
    }

    $("a").remove("#" + input);
}

function tags_tagMeme(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    var repeat = 0;

    if(keycode == '13'){
        var input = $("#tags").val();
        input = $("#tags").val();

        input = input.split(' ').join('-');

        $("#tags").val("");

        for (i=0; i<=tagArray.length; i++) {
            if(tagArray[i] == input) {
                repeat = 1;
            }
        }

        var inputTag = document.createElement('a');
        var deleteTag = document.createElement('i');
        inputTag.className = "ui label";
        deleteTag.className = "delete icon";

        $(inputTag).attr('id', input);
        $(deleteTag).attr('data-tag-name', input);
        $(deleteTag).click(remove_tagMeme);

        $(inputTag).text("#" + input);
        $(inputTag).append(deleteTag);

        if (input!="" && repeat!=1)
        {
            tagArray.push(input);
            $("#textarea").append(inputTag);
        }

    }
}
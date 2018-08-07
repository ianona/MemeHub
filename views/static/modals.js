// JS for modal functions
$(document).ready(function(){
    $("#login").click(function(){
        $(".login").modal('show');
        $(".red.message").css("display","none");
        showLogin()
    });

    $(".login").modal({
        closable: true
    });

    $("#login2").click(function(){
        $(".login").modal('show');
        $(".red.message").css("display","none");
        showLogin()
    });

    $("#logout").click(function(){
        $(".logout").modal('show');
    });

    $("#cancel").click(function(){
        $(".logout").modal('hide');
    });

    $("#upload").click(function(){
        $(".upload_modal").modal('show');
    });

    $("#share-button").click(uploadMeme);

    $("span.username.clickable").click(function(){
        $(".view_profile1").modal('show');
    });

    $(".upload_modal").modal({
        closable: true
    });

    $(".view_modal").modal({
        closable: true
    });

    $(".logout").modal({
        closable: true
    });

    $(".share_modal").modal({
        closable: true
    });

    $(".ui.avatar").click(changeAvatarChoice)
    $(".meme_container img").click(viewMeme)

    $('.chosen').append($('<option>', {
        value: 1,
        text: 'My option'
    }));

    $(".chosen").chosen({
        disable_search:true,
        max_shown_results:0
    });

    $('.chosen').append($('<option>', {
        value: 2,
        text: 'PORK'
    }));

    $(".chosen").trigger("chosen:updated");

    let container = $(".chosen").data("chosen").container
    container.bind("keypress", updateSearch);

})

$(".chosen").chosen().keydown(function(e) {
    if (e.which == 13) {
        console.log("ENTER")
    }
});

function updateSearch(event){
    console.log("HELLO")
    if (event.which == '13') {
        console.log("ENTER")
    }
}

function changeAvatarChoice() {
    $(".ui.avatar").removeClass("selected")
    $(this).addClass("selected")
    let a = $(this).attr("src")
    $("input#hidden_avatar").val(a)
}

function showSignup(){
    $("#login_form").css("display","none")
    $(".logo_small").css("display","none")
    $("#signup_form").css("display","flex")
    $(".header.signup").text("Sign-up")
}

function showLogin(){
    $("#signup_form").css("display","none")
    $("#login_form").css("display","flex")
    $(".logo_small").css("display","inline-block")
    $(".header.signup").text("Login")  
    $(".red.message").css("display","none")
}

function viewMeme(){
    let id = $(this).attr('data-id')
    $.post(
        'viewMeme',
        {id},
        function(data,status){
            if (status === 'success') {
                console.log(data.meme.img_path)
                $("#view_meme_title").text(data.meme.title);
                $("#view_meme_info").text("by " + data.meme.user);
                $("div.ui.longer.modal.view_modal div.view_meme img").attr("src", data.meme.img_path)

                $("div.ui.longer.modal.view_modal div.tag_holder").html('');
                for (i = 0; i < data.meme.tags.length; i++) { 
                    var tagname = data.meme.tags[i];
                    var newtag = document.createElement("div");
                    newtag.className = "ui label";
                    $(newtag).text("#"+tagname)
                    $("div.ui.longer.modal.view_modal div.tag_holder").append(newtag);
                }

                $(".view_modal").modal('setting', 'transition', 'horizontal flip')
                $(".view_modal").modal('show');
            }
        })
}

/*

$(document).ready(function () {
    var options = {
        beforeSubmit: showRequest,  // pre-submit callback
        success: showResponse  // post-submit callback
    };

    // bind to the form's submit event
    $('#frmUploader').submit(function () {
        $(this).ajaxSubmit(options);
        // always return false to prevent standard browser submit and page navigation
        return false;
    });
});

// pre-submit callback
function showRequest(formData, jqForm, options) {
    alert('Uploading is starting.');
    return true;
}

// post-submit callback
function showResponse(responseText, statusText, xhr, $form) {
    alert('status: ' + statusText + '\n\nresponseText: \n' + responseText );
}
*/


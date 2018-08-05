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

    $("#share-button").click(function(){
        $(".uploadSuccess_modal").modal('show');
    });

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
})

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
    var source = memes[id].link;
    var title = memes[id].title;
    var content ="by " + memes[id].owner

    $("#view_meme_title").text(title);
    $("div.ui.longer.modal.view_modal div.view_meme img").attr("src",source)

    /*
    if (memes[id].owner=="admin") {
        $("#view_meme_info").click(function(){
            window.location.replace("profile1b.html");
        })
    } else {
        $("#view_meme_info").click(function(){
            window.location.replace("profile2b.html");
        })
    }

    $("#view_meme_info").text(content);

    $(".view_modal").modal('setting', 'transition', 'horizontal flip')
    $(".view_modal").modal('show');
    */
}
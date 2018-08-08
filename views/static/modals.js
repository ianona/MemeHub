// JS for modal functions
$(document).ready(function(){
    $("#login").click(function(){
        $(".login").modal('show');
        $(".red.message").css("display","none");
        showLogin()
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

    $(".ui.avatar").click(changeAvatarChoice)

    $(".chosen").chosen({
        max_shown_results:0
    })
    
    $("div.ui.small.borderless.sticky a.item").click(sort)

    let container = $(".chosen").data("chosen").container
    container.bind("keypress", updateSearch);
})

function changeAvatarChoice() {
    $(".ui.avatar").removeClass("selected")
    $(this).addClass("selected")
    let a = $(this).attr("src")
    $("input#hidden_avatar").val(a)
}

function sort(){
    let type= $(this).text()
    $("input[name=sort_type]").val(type.toLowerCase())
    
    console.log($("input[name=sort_type]").val())
    $("div.ui.small.borderless.sticky a.item").removeClass("active")
    $(this).addClass("active")
    $("form#sort").submit()
}
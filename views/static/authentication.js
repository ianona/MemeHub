// JS for authentication functions (login/signup)
$(document).ready(function(){
    $("#goto_signup").click(showSignup)
    $("#goto_login").click(showLogin)
    $("#signup_btn").click(signup)
    $("#login_btn").click(login)

    $("input[name=signup_email]").keypress(checkFields)
    $("input[name=signup_username]").keypress(checkFields)
    $("input[name=signup_password]").keypress(checkFields)
    $("input[name=signup_day]").keypress(checkFields)
    $("input[name=signup_year]").keypress(checkFields)
    $("input[name=signup_check]").click(checkFields)
})

function isValidEmail(email){
    return true
}

function clearFields(){
    $("input").val("")
}

function signup(){
    //$(".registerSuccess").modal('show')
    $("form#signup_form").submit()
    clearFields()
    $(".login").modal('hide');
    showLogin()
}

function login(){
    let username = $("#username").val()
    let password = $("#password").val()
    $.ajax({
        url:'login',
        method: 'POST',
        data: { username, password },
        success: function(res){
            if (res.result === 'error') {
                $(".red.message").css("display","flex")
            }
            else {
                $("input#hidden_username").val(username)
                $("input#hidden_password").val(password)
                $("form#hidden_login_form").submit()
            }
        }

    })

}

function checkFields() {
    let email = $("input[name=signup_email]").val()
    let username = $("input[name=signup_username]").val()
    let pass = $("input[name=signup_password]").val()
    let day = $("input[name=signup_day]").val()
    let year = $("input[name=signup_year]").val()
    let terms = $("input[name=signup_check]").is(":checked")

    if (terms && !isNaN(year) && !isNaN(day) && email != "" && username != "" && pass != "" && day != "" && year != "") {
        if (isValidEmail(email) && parseInt(day,10) > 0 && parseInt(day,10) <= 31 && parseInt(year,10) > 0)
            $("#signup_btn").removeClass("disabled")
    } else {
        if (!$("#signup_btn").hasClass("disabled"))
            $("#signup_btn").addClass("disabled")
    }
}

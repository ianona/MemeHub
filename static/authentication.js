// JS for authentication functions (login/signup)
$(document).ready(function () {
    $("#goto_signup").click(showSignup)
    $("#goto_login").click(showLogin)
    $("#signup_btn").click(signup)
    $("#login_btn").click(login)

    $("input[name=signup_email]").keyup(checkFields)
    $("input[name=signup_username]").keyup(checkFields)
    $("input[name=signup_password]").keyup(checkFields)
    $("input[name=signup_day]").keyup(checkFields)
    $("input[name=signup_year]").keyup(checkFields)
    $("input[name=signup_check]").click(checkFields)

    $("input[name=signup_email]").focusout(checkEmail)
    $("input[name=signup_username]").focusout(checkUser)
    $("input[name=signup_password]").focusout(checkPass)
})

function showSignup() {
    $("#login_form").css("display", "none")
    $(".logo_small").css("display", "none")
    $("#signup_form").css("display", "flex")
    //$(".header.signup").text("Sign-up")
}

function showLogin() {
    $("#signup_form").css("display", "none")
    $("#login_form").css("display", "flex")
    $(".logo_small").css("display", "inline-block")
    //$(".header.signup").text("Login")  
    $(".red.message").css("display", "none")
}

function isValidEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //regular expression is used to check email AUTOMAT INTENSIFIES
    return re.test(email);
}

function checkEmail() {
    if (!isValidEmail($("input[name=signup_email]").val()))
        $("div#emailErr").css("display", "block")
    else
        $("div#emailErr").css("display", "none")
}

function checkUser() {
    if ($("input[name=signup_username]").val().length < 4)
        $("div#userErr").css("display", "block")
    else
        $("div#userErr").css("display", "none")
}

function isValidPass(password) {
    if(password.length < 6)
        return false

    var hasSmall = false
    var hasBig = false
    var hasNum = false
    if (password.match(/[a-z]/)) {
        hasSmall = true
    }
    if (password.match(/[A-Z]/)) {
        hasBig = true
    }
    if (password.match(/[0-9]/)) {
        hasNum = true
    }
    if (hasBig && hasSmall && hasNum && password.length >= 6) {
        return true
    } 

    return false
}

function checkPass() {
    if (!isValidPass($("input[name=signup_password]").val()))
        $("div#passErr").css("display", "block")
    else
        $("div#passErr").css("display", "none")
}

function clearFields() {
    $("input").val("")
}

function signup() {
    $("form#signup_form").submit()
    clearFields()
    $(".login").modal('hide');
    showLogin()
}

function login() {
    let username = $("#username").val()
    let password = $("#password").val()
    $.ajax({
        url: '../user/login',
        method: 'POST',
        data: { username, password },
        success: function (res) {
            if (res.result === 'error') {
                $(".red.message").css("display", "flex")
            }
            else {
                //$("input#hidden_username").val(username)
                //$("input#hidden_password").val(password)
                $("form#hidden_login_form").submit()
            }
        }

    })
}

function checkFields() {
    let creds = {
        email: $("input[name=signup_email]").val(),
        username: $("input[name=signup_username]").val(),
        pass: $("input[name=signup_password]").val(),
        day: $("input[name=signup_day]").val(),
        year: $("input[name=signup_year]").val(),
        terms: $("input[name=signup_check]").is(":checked")
    }
    if (creds.terms && !isNaN(creds.year) && !isNaN(creds.day) && creds.username.length > 3 && isValidPass(creds.pass) && creds.day != "" && creds.year != "") {
        if (isValidEmail(creds.email) && parseInt(creds.day, 10) > 0 && parseInt(creds.day, 10) <= 31 && parseInt(creds.year, 10) > 0)
            $("#signup_btn").removeClass("disabled")
        else{
            if (!$("#signup_btn").hasClass("disabled"))
                $("#signup_btn").addClass("disabled")
        }
    } else {
        if (!$("#signup_btn").hasClass("disabled"))
            $("#signup_btn").addClass("disabled")
    }
}

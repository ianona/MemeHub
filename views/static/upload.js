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
})

function uploadMeme(){
    $("form#frmUploader").submit()
}

var tagArray = [];
var tagArray2 = [];
var tagArray3 = [];

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

        for (i=0; i<=tagArray2.length; i++) {
            if(tagArray2[i] == input) {
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
            tagArray2.push(input);
            $("#textarea").append(inputTag);
        }

    }
}
// JS for modal functions
$(document).ready(function(){
    $(".meme_container img").click(viewMeme)
    $(".meme_container span.meme_details").click(viewUser)
    $("span.username").click(viewUser)
    $("span.goto_profile").click(goto_Profile)

    $("span.upvote").click(vote)
    $("span.downvote").click(vote)
    $('.chosen').on('change', updateSearch);

    updateTags()
    updatePopularTags()
    updateSort()
})

function updateSearch(){
    $.ajax({
        url:'search',
        method: 'GET',
        data: {tags:$('.chosen').val()},
        success: function(res){
            $('.container.right').empty()
            for (i=0;i<res.memes.length;i++){
                insertMeme(res.memes[i])
            }
        }
    })
}

function insertMeme(meme){
    let memeContainer = document.createElement("div")
    memeContainer.className = "meme_container"

    let title = document.createElement("span")
    title.className = "meme_title"
    $(title).text(meme.title)
    let details = document.createElement("span")
    details.className = "meme_details"
    $(details).text("by "+meme.user)
    $(details).attr("data-name",meme.user)

    let privateLbl = document.createElement("div")
    privateLbl.className = "ui label private"
    $(privateLbl).text("Private")

    if (meme.privacy=="private")
        $(title).append(privateLbl)
    $(memeContainer).append(title)
    $(memeContainer).append(details)

    let memeImgContainer = document.createElement("div")
    memeImgContainer.className = "meme"
    let memeImg = document.createElement("img")
    $(memeImg).attr("src",meme.img_path)
    $(memeImg).attr("data-id",meme._id)
    $(memeImgContainer).append(memeImg)
    $(memeContainer).append(memeImgContainer)

    let memeStats = document.createElement("div")
    memeStats.className = "meme_stats"

    let span1 = document.createElement("span")
    let icon1 = document.createElement("i")
    span1.className = "upvote"
    $(span1).attr("data-id",meme._id)
    icon1.className = "chevron circle up icon"
    $(span1).text(meme.upvotes)
    $(span1).append(icon1)

    let span2 = document.createElement("span")
    let icon2 = document.createElement("i")
    span2.className = "downvote"
    $(span2).attr("data-id",meme._id)
    icon2.className = "chevron circle down icon"
    $(span2).text(meme.down)
    $(span2).append(icon2)

    let span3 = document.createElement("span")
    let icon3 = document.createElement("i")
    icon3.className = "share icon"
    span3.className = "share"
    $(span3).attr("data-id",meme._id)
    $(span3).append(icon3)

    $(memeStats).append(span1)
    $(memeStats).append(span2)
    if (meme.user == "{{user.username}}")
        $(memeStats).append(span3)
    $(memeContainer).append(memeStats)

    $(memeImg).click(viewMeme)
    $(details).click(viewUser)

    $(span1).click(vote)
    $(span2).click(vote)

    $(".wrapper .container.right").append(memeContainer)
}

function updateSort(){
    $.ajax({
        url:'getSort',
        method: 'GET',
        data: {},
        success: function(res){
            $("div.ui.small.borderless.sticky a.item").removeClass("active")
            switch(res.result){
                case "top":
                    $("a[data-type=top]").addClass("active")
                    break
                    case "hot":
                    $("a[data-type=hot]").addClass("active")
                    break
                    case "trending":
                    $("a[data-type=trending]").addClass("active")
                    break
            }
        }
    })
}

function vote(){
    let id = $(this).attr('data-id')
    let up = $("span.upvote[data-id="+id+"]").text()
    let down = $("span.downvote[data-id="+id+"]").text()

    if ($(this).hasClass("upvote"))
        up = parseInt(up) + 1
    else
        down = parseInt(down) + 1

    $.ajax({
        url:'updateVotes',
        method: 'POST',
        data: {
            id:id,
            upvotes:up,
            downvotes:down
        },
        success: function(res){
            $("span.upvote[data-id="+id+"]").html(res.up + "<i class='chevron circle up icon'></i>")
            $("span.downvote[data-id="+id+"]").html(res.down + "<i class='chevron circle down icon'></i>")
        }
    })
}

function updateTags(){
    $.ajax({
        url:'getTags',
        method: 'GET',
        data: {},
        success: function(res){
            for (i = 0; i<res.tags.length;i++){
                $('.chosen').append($('<option>', {
                    value: res.tags[i].name,
                    text: res.tags[i].name
                }));
                $(".chosen").trigger("chosen:updated");
            }
        }
    })
}

function updatePopularTags(){
    $.ajax({
        url:'getPopularTags',
        method: 'GET',
        data: {},
        success: function(res){
            for (i = 0; i<res.top5.length;i++){
                let a = document.createElement("a")
                $(a).addClass("ui")
                $(a).addClass("label")
                $(a).text("#"+res.top5[i].name)
                $(a).click(addSearch)
                $("div#popular_tags").append(a)
            }
        }
    })
}

function addSearch(){
    let value = $(this).text().replace('#','')
    $(".chosen option[value="+value+"]").attr("selected",true)
    $(".chosen").val(value)
    $(".chosen").trigger("chosen:updated");
    updateSearch()
}

function viewMeme(){
    let id = $(this).attr('data-id')
    $.post(
        'viewMeme',
        {id},
        function(data,status){
            if (status === 'success') {
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

                let editIcon = document.createElement("i")
                editIcon.className = "edit outline icon"
                let delIcon = document.createElement("i")
                delIcon.className = "trash icon"
                let saveIcon = document.createElement("i")
                saveIcon.className = "save icon hidden"
                $(delIcon).attr('data-id', data.meme._id)
                $(delIcon).click(deleteMeme)
                $(editIcon).attr('data-id', data.meme._id)
                $(editIcon).click(prepareEdit)
                $(saveIcon).attr('data-id', data.meme._id)
                $(saveIcon).click(editMeme)

                $("div.view_modal div.header").empty()
                $("div.view_modal div.header").text("View meme")

                if (data.meme.user === $("span.username").attr("data-name") || data.meme.user === $("div.username").attr("data-name")){
                    $("div.view_modal div.header").append(delIcon)
                    $("div.view_modal div.header").append(editIcon)
                    $("div.view_modal div.header").append(saveIcon)
                }

                $(".view_modal").modal('setting', 'transition', 'horizontal flip')
                $(".view_modal").modal('show')
            }
        })
}

function viewUser(){
    let name = $(this).attr('data-name')
    $.ajax({
        url:'viewUser',
        method: 'GET',
        data: {name},
        success: function(data){
            $(".view_profile .header").text(data.user.username);
            $(".view_profile .display_photo img").attr("src",data.user.avatar);
            $(".view_profile span.joined").text(data.user.join_date)
            $(".view_profile span.meme_count").text(data.user.memes.length)

            let counter=0
            for (i=0;i<data.user.memes.length;i++){
                if (counter > 3)
                    break
                    var img = document.createElement("img")
                $(img).attr("src",data.user.memes[i].img_path)
                if (data.user.memes[i].privacy == "public"){
                    counter+=1
                    $(".view_profile div.tiny.images").append(img)
                }
            }

            $("input#profileInput").val(data.user._id)
            $(".view_profile").modal('show');
        }
    })
}

function goto_Profile(){
    $("form#profile").submit()
}

function deleteMeme(){
    let id = $(this).attr('data-id')
    if (confirm("Are you sure you want to delete this meme?")){
        $("input[name=id]").val(id)
        $("form[action=deleteMeme]").submit()
    }
}

function prepareEdit(){
    $(this).addClass('hidden')
    $("i.save.icon").removeClass('hidden')
    $("input[name=tag_holder]").removeClass('hidden')
    $("#view_meme_title").attr('contentEditable',true)
    $("#view_meme_title").focus()

    let tags = $("div.ui.longer.modal.view_modal div.tag_holder").text().split('#')
    $("input[name=tag_holder]").val("")

    for (i=0;i<tags.length;i++){
        $("input[name=tag_holder]").val($("input[name=tag_holder]").val() + tags[i] + " ");
    }
}

function editMeme(){
    $("input[name=tag_holder]").addClass('hidden')
    $(this).addClass('hidden')
    $("i.edit.icon").removeClass('hidden')
    $("#view_meme_title").attr('contentEditable',false)

    let tags = $("input[name=tag_holder]").val().split(' ').filter(Boolean)

    $("div.ui.longer.modal.view_modal div.tag_holder").html('');
    for (i = 0; i < tags.length; i++) { 
        var tagname = tags[i];
        var newtag = document.createElement("div");
        newtag.className = "ui label";
        $(newtag).text("#"+tagname)
        $("div.ui.longer.modal.view_modal div.tag_holder").append(newtag);
    }

    let id = $(this).attr("data-id")
    let new_title = $("#view_meme_title").text()
    let new_tags = $("div.ui.longer.modal.view_modal div.tag_holder").text().split('#').filter(Boolean)

    $.ajax({
        url:'editMeme',
        method: 'GET',
        data: {id,new_title,new_tags},
        success: function(data){

        }
    })
}

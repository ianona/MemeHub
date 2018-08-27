// JS for modal functions
$(document).ready(function () {
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
    
    $("ul#view_tags").tagit({
        readOnly:true
    });
    
})

function updateSearch() {
    $.ajax({
        url: '../meme/search',
        method: 'GET',
        data: { tags: $('.chosen').val() },
        success: function (res) {
            $('.container.right').empty()
            for (i = 0; i < res.memes.length; i++) {
                insertMeme(res.memes[i])
            }

            if (res.memes.length == 0) {
                let msg = document.createElement("div")
                msg.className = "ui big orange message"
                $(msg).text("No memes loaded")
                $(".wrapper .container.right").append(msg)
            }

        }
    })
}

function insertMeme(meme) {
    let memeContainer = document.createElement("div")
    memeContainer.className = "meme_container"

    let title = document.createElement("span")
    title.className = "meme_title"
    $(title).text(meme.title)
    let details = document.createElement("span")
    details.className = "meme_details"
    $(details).text("by " + meme.user)
    $(details).attr("data-name", meme.user)

    let privateLbl = document.createElement("div")
    privateLbl.className = "ui label private"
    $(privateLbl).text("Private")

    if (meme.privacy == "private")
        $(title).append(privateLbl)
    $(memeContainer).append(title)
    $(memeContainer).append(details)

    let memeImgContainer = document.createElement("div")
    memeImgContainer.className = "meme"
    let memeImg = document.createElement("img")
    $(memeImg).attr("src", "../meme/photo/" + meme._id)
    $(memeImg).attr("data-id", meme._id)
    $(memeImgContainer).append(memeImg)
    $(memeContainer).append(memeImgContainer)

    let memeStats = document.createElement("div")
    memeStats.className = "meme_stats"

    let span1 = document.createElement("span")
    let icon1 = document.createElement("i")
    span1.className = "upvote"
    $(span1).attr("data-id", meme._id)
    icon1.className = "chevron circle up icon"
    $(span1).text(meme.upvotes)
    $(span1).append(icon1)

    let span2 = document.createElement("span")
    let icon2 = document.createElement("i")
    span2.className = "downvote"
    $(span2).attr("data-id", meme._id)
    icon2.className = "chevron circle down icon"
    $(span2).text(meme.down)
    $(span2).append(icon2)

    let span3 = document.createElement("span")
    let icon3 = document.createElement("i")
    icon3.className = "share icon"
    span3.className = "share"
    $(span3).attr("data-id", meme._id)
    $(span3).append(icon3)

    //$(memeStats).append(span1)
    //$(memeStats).append(span2)
    if (meme.privacy == "private")
        $(icon3).addClass("disabled")
    if (meme.user == $("span.username").attr("data-name"))
        $(memeStats).append(span3)
    $(memeContainer).append(memeStats)

    $(memeImg).click(viewMeme)
    $(details).click(viewUser)

    $(span1).click(vote) 
    $(span2).click(vote)

    $(".wrapper .container.right").append(memeContainer)
}

function updateSort() {
    $.ajax({
        url: '../getSort',
        method: 'GET',
        data: {},
        success: function (res) {
            $("div.ui.small.borderless.sticky a.item").removeClass("active")
            switch (res.result) {
                case "recent":
                    $("a[data-type=recent]").addClass("active")
                    break
                /*
                case "hot":
                    $("a[data-type=hot]").addClass("active")
                    break
                */
                case "trending":
                    $("a[data-type=trending]").addClass("active")
                    break
            }
        }
    })
}

function vote() {
    let id = $(this).attr('data-id')
    let up = $("span.upvote[data-id=" + id + "]").text()
    let down = $("span.downvote[data-id=" + id + "]").text()

    if ($(this).hasClass("upvote"))
        up = parseInt(up) + 1
    else
        down = parseInt(down) + 1

    $.ajax({
        url: 'updateVotes',
        method: 'POST',
        data: {
            id: id,
            upvotes: up,
            downvotes: down
        },
        success: function (res) {
            $("span.upvote[data-id=" + id + "]").html(res.up + "<i class='chevron circle up icon'></i>")
            $("span.downvote[data-id=" + id + "]").html(res.down + "<i class='chevron circle down icon'></i>")
        }
    })
}

function updateTags() {
    $.ajax({
        url: '../tag/getTags',
        method: 'GET',
        data: {},
        success: function (res) {
            $('.chosen').val('').trigger('chosen:updated');
            for (i = 0; i < res.tags.length; i++) {
                $('.chosen').append($('<option>', {
                    value: res.tags[i].name,
                    text: res.tags[i].name
                }));
                $(".chosen").trigger("chosen:updated");
            }
        }
    })
}

function updatePopularTags() {
    $.ajax({
        url: '../tag/getPopularTags',
        method: 'GET',
        data: {},
        success: function (res) {
            let tags = res.tags
            for (i = 0; i < tags.length; i++) {
                let a = document.createElement("a")
                $(a).addClass("ui")
                $(a).addClass("label")
                $(a).text("#" + tags[i].name)
                $(a).click(addSearch)
                $("div#popular_tags").append(a)
            }
        }
    })
}

function addSearch() {
    let value = $(this).text().replace('#', '')
    $(".chosen option[value=" + value + "]").attr("selected", true)
    //$(".chosen").val(value)
    $(".chosen").trigger("chosen:updated");
    updateSearch()
}

function viewMeme() {
    let id = $(this).attr('data-id')
    $.post(
        '../meme/viewMeme',
        { id },
        function (data, status) {
            if (status === 'success') {
                $("#view_meme_title").text(data.meme.title);
                $("#view_meme_info").text("by " + data.meme.user);
                $("div.ui.longer.modal.view_modal div.view_meme img").attr("src", "../meme/photo/" + data.meme._id)

                $("ul#view_tags").tagit("removeAll");
                let tags = data.meme.tags
                if (tags==null)
                    tags=[]
                for (i = 0; i < tags.length; i++) {
                    $('ul#view_tags').tagit('createTag',tags[i]);
                }


                let editIcon = document.createElement("i")
                editIcon.className = "large edit outline icon"
                let delIcon = document.createElement("i")
                delIcon.className = "large trash icon"
                let saveIcon = document.createElement("i")
                saveIcon.className = "large check circle icon hidden"
                $(delIcon).attr('data-id', data.meme._id)
                $(delIcon).click(deleteMeme)
                $(editIcon).attr('data-id', data.meme._id)
                $(editIcon).click(prepareEdit)
                $(saveIcon).attr('data-id', data.meme._id)
                $(saveIcon).click(editMeme)

                $("div.view_modal div.header").empty()
                $("div.view_modal div.header").text("View meme")

                if (data.meme.user === $("span.username").attr("data-name") || data.meme.user === $("div.username").attr("data-name")) {
                    $("#view_meme_info").append(delIcon)
                    $("#view_meme_info").append(editIcon)
                    $("#view_meme_info").append(saveIcon)
                }

                $(".view_modal").modal('setting', 'transition', 'horizontal flip')
                $(".view_modal").modal('show')
            }
        })
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function viewUser() {
    let name = $(this).attr('data-name')
    $.ajax({
        url: '../user/viewUser',
        method: 'GET',
        data: { name },
        success: function (data) {
            $(".view_profile .header").text(data.user.username);
            $(".view_profile .display_photo img").attr("src", "../"+data.user.avatar);

            var d = new Date(data.user.join_date);

            $(".view_profile span.joined").text(monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear())
            $(".view_profile span.meme_count").text(data.user.memes.length)
            $(".view_profile div.tiny.images").empty()
            let counter = 0
            for (i = 0; i < data.user.memes.length; i++) {
                if (counter > 3)
                    break
                var img = document.createElement("img")
                $(img).attr("src", "../meme/photo/" + data.user.memes[i]._id)
                if (data.user.memes[i].privacy == "public") {
                    counter += 1
                    $(".view_profile div.tiny.images").append(img)
                }
            }

            $("input#profileInput").val(data.user._id)
            $(".view_profile").modal('show');
        }
    })
}

function goto_Profile() {
    $("form#profile").submit()
}

function deleteMeme() {
    let id = $(this).attr('data-id')
    if (confirm("Are you sure you want to delete this meme?")) {
        $("input[name=id]").val(id)
        $("form#deleteMemeForm").submit()
    }
}

function prepareEdit() {
    $(this).addClass('hidden')
    $("i.check.circle.icon").removeClass('hidden')
    $("#view_meme_title").attr('contentEditable', true)
    $("#view_meme_title").focus()
    $("ul#view_tags").tagit({
        readOnly:false
    });
    let tags = $('ul#view_tags').tagit("assignedTags");
    $('ul#view_tags').tagit("removeAll");
    for (i = 0; i < tags.length; i++) {
        $('ul#view_tags').tagit('createTag', tags[i]);
    }
    $("input.ui-widget-content.ui-autocomplete-input").removeAttr("disabled")
}

function editMeme() {
    $(this).addClass('hidden')
    $("i.edit.icon").removeClass('hidden')
    $("#view_meme_title").attr('contentEditable', false)
    $("ul#view_tags").tagit({
        readOnly:true
    });
    let tags = $('ul#view_tags').tagit("assignedTags");
    $('ul#view_tags').tagit("removeAll");
    for (i = 0; i < tags.length; i++) {
        $('ul#view_tags').tagit('createTag', tags[i]);
    }
    $("input.ui-widget-content.ui-autocomplete-input").attr("disabled","disabled")

    var id = $(this).attr("data-id")
    var new_title = $("#view_meme_title").text()
    var new_tags = $("ul#view_tags").tagit("assignedTags");

    $.ajax({
        url: '../meme/editMeme',
        method: 'GET',
        data: { id, new_title, new_tags },
        success: function (data) {
            updateTags()
            console.log(data.updatedDoc)
            $("span.meme_title[data-id="+id+"]").text(new_title)
        }
    })
   
}

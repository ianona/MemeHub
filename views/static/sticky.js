// LEFT-RAIL STICKY
$(window).scroll(function(e) {
    // Get the position of the location where the scroller starts.
    var scroller_anchor = $(".scroller_anchor").offset().top;

    // Check if the user has scrolled and the current position is after the scroller start location and if its not already fixed at the top
    if ($(this).scrollTop() >= scroller_anchor && $('.left-rail').css('position') != 'fixed') {
        // Change the CSS of the scroller to hilight it and fix it at the top of the screen.
        $('.left-rail').css({
            'position': 'fixed',
            'top':'100px'
        });
        // Changing the height of the scroller anchor to that of scroller so that there is no change in the overall height of the page.
        /*
                    $('.scroller_anchor').css('height', '50px');
                    */
    } else if ($(this).scrollTop() < scroller_anchor && $('.left-rail').css('position') != 'relative') {
        // If the user has scrolled back to the location above the scroller anchor place it back into the content.
        // Change the height of the scroller anchor to 0 and now we will be adding the scroller back to the content.
        $('.scroller_anchor').css('height', '0px');
        // Change the CSS and put it back to its original position.
        $('.left-rail').css({
            'position': 'relative',
            'top':'0px'
        });
    }
});

$(window).scroll(function(e) {
    // Get the position of the location where the scroller starts.
    var scroller_anchor = $(".scroller_anchor2").offset().top;

    // Check if the user has scrolled and the current position is after the scroller start location and if its not already fixed at the top
    if ($(this).scrollTop() >= scroller_anchor +20) {
        $('.logo_tiny').css({
            'visibility':'visible'
        });
    } else if ($(this).scrollTop() < scroller_anchor) {
        $('.scroller_anchor2').css('height', '0px');
        $('.logo_tiny').css({
            'visibility':'hidden'
        });
    }
});
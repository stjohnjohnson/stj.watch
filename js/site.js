
$.extend($.easing,
{
    def: 'easeOutQuad',
    easeInOutExpo: function (x, t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
});

(function( $ ) {

    var settings;
    var disableScrollFn = false;
    var navItems;
    var navs = {}, sections = {};

    $.fn.navScroller = function(options) {
        settings = $.extend({
            scrollToOffset: 170,
            scrollSpeed: 800,
            activateParentNode: true,
        }, options );
        navItems = this;

        //attatch click listeners
        navItems.on('click', function(event){
            event.preventDefault();
            var navID = $(this).attr("href").substring(1);
            disableScrollFn = true;
            activateNav(navID);
            populateDestinations(); //recalculate these!
            $('html,body').animate({scrollTop: sections[navID] - settings.scrollToOffset + 5},
                settings.scrollSpeed, "easeInOutExpo", function() {
                    disableScrollFn = false;
                }
            );
        });

        //populate lookup of clicable elements and destination sections
        populateDestinations(); //should also be run on browser resize, btw

        // setup scroll listener
        $(document).scroll(function(){
            if (disableScrollFn) { return; }
            var page_height = $(window).height();
            var pos = $(this).scrollTop();
            var selectedNav = 0;
            for (i in sections) {
                if ((pos + settings.scrollToOffset >= sections[i]) && sections[i] < pos + page_height){
                    selectedNav = i;
                }
            }

            activateNav(selectedNav);
        });
    };

    function populateDestinations() {
        navItems.each(function(){
            var scrollID = $(this).attr('href').substring(1);
            navs[scrollID] = (settings.activateParentNode)? this.parentNode : this;
            sections[scrollID] = $(document.getElementById(scrollID)).offset().top;
        });
    }

    function activateNav(navID) {
        for (nav in navs) { $(navs[nav]).removeClass('active'); }
        $(navs[navID]).addClass('active');
        history.replaceState(null, null, '#' + navID);

    }
})( jQuery );


$(document).ready(function (){

    $('nav li a').navScroller();

    // section divider icon click gently scrolls to reveal the section
    $(".sectiondivider").on('click', function(event) {
        $('html,body').animate({scrollTop: $(event.target.parentNode).offset().top - 50}, 400, "linear");
    });

    // links going to other sections nicely scroll
    $(".container a").each(function(){
        if ($(this).attr("href").charAt(0) == '#'){
            $(this).on('click', function(event) {
                event.preventDefault();
                var target = $(event.target).closest("a");
                var targetHight =  $(target.attr("href")).offset().top
                $('html,body').animate({scrollTop: targetHight - 170}, 800, "easeInOutExpo");
            });
        }
    });

    // Countdown to November 4th @ 9:30AM PT 2023
    $('div#countdown').countdown(1699115400000)
        .on('update.countdown', function (event) {
            $(this).html(event.strftime('<h4 class="text-white">Starting in %-D day%!D %-H hour%!H %-M minute%!M %-S second%!S</h4>'));
        })
        .on('finish.countdown', function (event) {
            $(this).html('');

            // Show the twitch stream
            new Twitch.Embed("twitch-embed", {
                channel: "stjohnjohnson",
                layout: "video"
            });

            $(".twitch-window").show();
        });

    // load donation bar
    $('div#donation-bar').donateGoal(509289);
    $('div#raised-top').currentRaised(509289);
});

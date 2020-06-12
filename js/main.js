function isChrome() {
    // Chrome's unsolved bug
    // http://code.google.com/p/chromium/issues/detail?id=128488

    return navigator.userAgent.indexOf('Chrome') != -1;

}

var html5_audiotypes = {
    //define list of audio file extensions
    "mp3": "audio/mpeg",
    "ogg": "audio/ogg",
    "wav": "audio/wav",
}
var isLoad = true;

function createsoundbite(sound) {
    var html5audio = document.createElement('audio')
    if (html5audio.canPlayType) {
        //check support for HTML5 audio
        for (var i = 0; i < arguments.length; i++) {
            var sourceel = document.createElement('source')
            sourceel.setAttribute('src', arguments[i])
            if (arguments[i].match(/.(\w+)$/i))
                sourceel.setAttribute('type', html5_audiotypes[RegExp.$1])
            html5audio.appendChild(sourceel)
        }
        html5audio.load()
        html5audio.playclip = function () {
            html5audio.pause();
            html5audio.currentTime = 0;
            if (!isLoad) {
                html5audio.play();
            }
        }
        return html5audio
    } else {
        return {
            playclip: function () {
                throw new Error("Your browser doesn't support HTML5 audio unfortunately")
            }
        }
    }
}



//Initialize sound clips:

var flip = createsoundbite("assets/sample.wav");

function loadApp() {
    document.getElementById('help-arrow').scrollIntoView(false);
    $('.flipbook').addClass('visible');


    var flipbook = $('.flipbook');

    // Check if the CSS was already loaded
    if (flipbook.width() == 0 || flipbook.height() == 0) {
        setTimeout(loadApp, 10);
        return;
    }




    // URIs

    Hash.on('^([0-9]*)$', {
        yep: function (path, parts) {

            var page = parts[1];
            if (page !== undefined && !isNaN(page) && page > 1) {
                if ($('.flipbook').turn('is')) {
                    $('.flipbook').turn('page', page);
                }
            } else {
                isLoad = false;
                setTimeout(function () {
                    $('#help-arrow').addClass('visible');
                }, 600);

                setTimeout(function () {
                    $(".flipbook").turn("peel", "br");
                }, 800);

            }

        },
        nop: function (path) {
            isLoad = false;
            setTimeout(function () {
                $('#help-arrow').addClass('visible');
            }, 600);

            setTimeout(function () {
                $(".flipbook").turn("peel", "br");
            }, 800);

        }
    });




    // Create the flipbook
    $('.flipbook').turn({
        // Elevation
        elevation: 50,
        // Enable gradients
        gradients: true,
        duration: 1000,
        // Auto center this flipbook
        autoCenter: false,
        acceleration: !isChrome(),
        when: {
            turning: function (e, page, view) {
                flip.playclip();
                $('#help-arrow').addClass('done');
                Hash.go('' + page).update();
                isLoad = false;
            }
        }
    });
}


/* Arrow Keys Navigation */

$(document).keydown(function (e) {

    var previous = 37,
        next = 39,
        esc = 27;

    switch (e.keyCode) {
        case previous:

            // left arrow
            $('.flipbook').turn('previous');
            e.preventDefault();

            break;
        case next:

            //right arrow
            $('.flipbook').turn('next');
            e.preventDefault();

            break;
    }
});


$(document).ready(function () {

    // Load the HTML4 version if there's not CSS transform

    yepnope({
        test: Modernizr.csstransforms,
        yep: ['js/lib/turn.js?v=1.0.4'],
        nope: ['js/lib/turn.html4.min.js'],
        complete: loadApp
    });

})
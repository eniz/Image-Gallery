
/*
* @author Eniz Gülek

* @version 1.0

* @licence MIT Licen

*/



$.ba = $.ba || {}; // create the namespace

var baImageGallery = {

    options: {

        open: false,

        index: 0,

        slideshow: false,

        interval: 3000

    },

    _init: function () {

        var base = this;

        var elm = base.element;

        var o = base.options;

        elm.show();

        var $thumbsContainer = $("#thumbsContainer");

        var $thumbs = $("#thumbsContainer > img");



        //Navigation

        var next = $(".next", elm);

        next.click(function () {

            o.index++;

            $thumbsContainer.children().eq(o.index).trigger("click");

        });

        var prev = $(".prev", elm);

        prev.click(function () {

            o.index--;

            $thumbsContainer.children().eq(o.index).trigger("click");

        });

        var close = $(".close", elm);

        close.click(function () {

            elm.hide();

        });

        //Mousewheel support 

        $(".preview", elm).live('mousewheel', function (event, delta) {

            if (delta > 0) {

                o.index--;

                $thumbsContainer.children("li").eq(o.index).trigger("click");

            }

            else {

                o.index++;

                $thumbsContainer.children("li").eq(o.index).trigger("click");

            }

            return false;

        });

        //Keyboard support

        $(window).keyup(function (event) {

            if (event.keyCode == 37) { //left arrow key

                o.index--;

                $thumbsContainer.children().eq(o.index).trigger("click");

            }

            else if (event.keyCode == 39) { //right arrow key

                o.index++;

                $thumbsContainer.children().eq(o.index).trigger("click");

            }

            else if (event.keyCode == 27) { //esc key

                elm.hide();

            }

        });



        $thumbs.on('click', function () {

            //zero index based

            o.index = $thumbs.index($(this));

            var ln = $thumbs.length;

            $(".image_info").text(o.index + 1 + "/" + ln);

            if (o.index == 0) $(".prev", elm).hide(); else $(".prev", elm).show();

            if (o.index == ln - 1) { $(".next", elm).hide(); $(".play", elm).hide(); } else { $(".next", elm).show(); $(".play", elm).show(); }

            $("#loading").show();

            $("<img />", {

                // Get source of image to load

                class: 'preview',

                alt: $thumbsContainer.children().eq(o.index).attr("alt"),

                src: $thumbsContainer.children().eq(o.index).attr("src")

            }).css({ height: '500px' }).load(function () {

                $("#loading").fadeOut();

                $("#imageWrapper").find("img:first").css({ position: 'absolute' }).stop().animate({

                    'opacity': '0',

                    '-moz-transition': 'opacity 5s ease',

                    'margin-left': '-' + ($("#imageWrapper").find("img:first").width() + 250) + 'px'

                }, 1000, function () {

                    $(this).remove();

                });

                //Append new image to preview div

                $("#imageWrapper").append($(this));

                //Show the description

                $("#description").html($(this).attr('alt'));

            });

        });

        $thumbs.on('mouseover', function () {

            $(this).animate({ 'opacity': '1.0' }, 200); 

        }).on('mouseout', function () {

            $(this).animate({ 'opacity': '0.4' }, 200); 

        });



        //SlideShow Start/Stop 

        $(".icon-play").click(function () {

            $(this).toggleClass("icon-play icon-pause");

        });

        $("#slideshow").toggle(function () {

            base.startSlideShow();

        }, function () {

            base.stopSlideShow();

        });



        base.baScrollable($("#thumbsWrapper"), $thumbsContainer, 15);

    },



    startSlideShow: function () {

        var base = this;

        var elm = base.element;

        var o = base.options;

        if (o.slideshow == false) {

            this._slideshow = window.setInterval(function () {

                if ($("#thumbsContainer > img").length == o.index) return;

                o.index++;

                $("#thumbsContainer").children().eq(o.index).trigger("click");

            }, o.interval);

            o.slideshow = true;

        }

    },

    stopSlideShow: function () {

        var base = this;

        var o = base.options;

        window.clearInterval(this._slideshow);

        o.slideshow = false;

    },

    baScrollable: function (wrapper, container, contPadding) {

        //Get menu width

        var divWidth = wrapper.width();

        //Remove scrollbars

        wrapper.css({ overflow: "hidden" });

        //Find last image container

        var lastLi = container.find("img:last-child");

        wrapper.scrollLeft(0);

        //When user move mouse over menu

        wrapper.unbind("mousemove").bind("mousemove", function (e) {

            //As images are loaded ul width increases,

            //so we recalculate it each time

            var ulWidth = lastLi[0].offsetLeft + lastLi.outerWidth() + contPadding;

            var left = (e.pageX - wrapper.offset().left) * (ulWidth - divWidth) / divWidth;

            wrapper.scrollLeft(left);

        });

    }

};

$.widget('ba.baImageGallery', baImageGallery); // create the widget

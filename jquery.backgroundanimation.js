/**
 * jQuery BackgorundImage animation
 *
 * Copyright (c) 2009 Alexander Simonov
 *
 * Released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Version: 0.1 - 28/09/2009
 */

// Offering a Custom Alias suport - More info: http://docs.jquery.com/Plugins/Authoring#Custom_Alias
(function($) {
    /**
     * $ is an alias to jQuery object
     *
     */
    $.fn.backgroundAnimation = function(settings) {
        // Settings to configure the jQuery lightBox plugin how you like
        var settings = jQuery.extend({
            // Configuration related to overlay
            speed:          500, //Speed of animation
            axis:           "Y", // Axis of animation
            scrollSize:     100, // Scrolling size
            prevIdSuffix:   "left-capt", // Suffix of next object id
            nextIdSuffix:   "right-capt", // Suffix of right object id
            slideShow:      1,
            slideInterval:  5000
        },settings);

        var var_index = 1;
        var style_string = 'backgroundPositionY';

        if (settings.axis == "X" ) {
            var_index = 0;
            style_string = 'backgroundPositionX';
        }

        var isAnimate = 0;

        this.each(function(i,e) {
            var $this = jQuery(e);
            var objectId = $this.attr('id');
            var _nextObj = $('#' + objectId + settings.nextIdSuffix)
            var _prevObj = $('#' + objectId + settings.prevIdSuffix)
            _nextObj.bind("click",function() { nextImage($this,_nextObj); return false; } );
            _prevObj.bind("click",function() { prevImage($this,_prevObj); return false; } );
            if ( settings.slideShow ) {
                $this.everyTime( settings.slideInterval,function() { 
                    nextSlide($this); 
                });
            }
        });

        function nextSlide($this,_prevObj,_nextObj) {
            isAnimate = 1;
            var positions = $this.css(style_string) || $this.css('backgroundPosition');
            str = new Object();
            if ($this.css(style_string)) {
                current = parseInt(positions) + parseInt(settings.scrollSize);
                str["" + style_string + ""] = current + "px";
            }
            else {
                coords = calculate_axes(positions);
                coords[var_index] = parseInt(coords[var_index]) + parseInt(settings.scrollSize);
                str["backgroundPosition"] = coords[0] + "px " + coords[1] + "px";
            }
            $this.animate(str,500,"linear",function() { isAnimate = 0;  });
            return false;
        }

        function scrollImage($this,navobject,symbol) {
            if ( isAnimate) return false;
            if ( settings.slideShow ) {
                $this.stopTime();
            }
            navobject.unbind();
            var positions = $this.css(style_string) || $this.css('backgroundPosition');
            str = new Object();
            if ($this.css(style_string)) {
                current = eval("parseInt(positions) " + symbol + " parseInt(settings.scrollSize)");
                str["" + style_string + ""] = current + "px";
            }
            else {
                coords = calculate_axes(positions);
                coords[var_index] = eval("parseInt(coords[var_index]) " + symbol + " parseInt(settings.scrollSize)");
                str["backgroundPosition"] = coords[0] + "px " + coords[1] + "px";
            }
            $this.animate(str,500,"linear",function(){
                if (symbol == "+")
                    navobject.bind("click",function() { nextImage($this,navobject); return false; } );
                else
                    navobject.bind("click",function() { prevImage($this,navobject); return false; } );
                if ( settings.slideShow ) {
                    $this.everyTime( settings.slideInterval,function() { nextSlide($this); });
                }
            });

        }

        function prevImage($this,_prevObj) {
            scrollImage($this,_prevObj,"-");
        }

        function nextImage($this,_nextObj) {
            scrollImage($this,_nextObj,"+");
        }

        function calculate_axes(positions) {
            coords = positions.split(" ");
            var x = coords[0].replace("px","");
            var y = coords[1].replace("px","");
            return new Array(x,y);
        }

        return this;

    }
})(jQuery); // Call and execute the function immediately passing the jQuery object

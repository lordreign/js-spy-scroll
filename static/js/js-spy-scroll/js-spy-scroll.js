(function (factory) {
    'use strict';
    // AMD
    if(typeof define === 'function' && define.amd) {
        define(['jquery', 'jquery.ellipsis.min', 'modernizr-latest'], factory);
    }
    // CommonJS
    else if(typeof exports === 'object') {
        module.exports = factory(require('jquery'), require('jquery.ellipsis.min'), require('modernizr-latest'));
    }
    // Browser globals
    else {
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    var pluginInfo = {
        name: 'jsSpyScroll',
        version: '1.0.0'
    };

    function jsSpyScroll(element, options) {
        this._pluginInfo = pluginInfo;

        this.defaults = {
            scrollSpeed: 300,
            top: {
                text: 'TOP',
                enable: true,
                topHref: '#header',
                class: 'js-page-navi-top'
            },
            lastSectionClass: 'jspn-last-section'
        };

        this.$element = element;
        $.extend(true, this.defaults, options);
        this.options = this.defaults;
        this.$window = $(window);

        return this.init();
    };

    jsSpyScroll.prototype.init = function() {

        this._replaceHTML();
        this._event();

        return this.$element;
    };

    jsSpyScroll.prototype._replaceHTML = function() {
        var topInfo = this.options.top;
        if(topInfo.enable) {
            var $lastElement = this.$element.find('a').last();
            $lastElement.after('<a class="' + topInfo.class + '" href="' + topInfo.topHref + '">' + topInfo.text + '</a>');
            this.options.top.$element = $('.'+topInfo.class);
            this.options.top.$element.hide();
        }
    };

    jsSpyScroll.prototype._event = function() {
        var that = this;
        var naviTop = that.$element.offset().top;
        var topInfo = that.options.top;
        var naviHeight = that.$element.height();
        var $document = $(document);
        var $body = $('body');

        var $naviItems = that.$element.find('a');
        var $scrollItems = $naviItems.map(function() {
            var $that = $(this);
            if(!$that.hasClass('js-page-navi-external')) {
                var $item = $($(this).attr('href'));
                if($item.length) {
                    return $item;
                }
            }
        });

        var lastId = $('.'+this.options.lastSectionClass).attr('id');
        if(typeof lastId === 'undefined') {
            lastId = null;
        }

        this.$window.scroll(function() {
            //if the current top is upper than naviTop
            if ($(this).scrollTop() >= naviTop) {
                if(topInfo.enable) {
                    topInfo.$element.show();    
                }
                
                that.$element.addClass('fixed');
                
                $body.css({
                    'padding-top': naviHeight+'px'
                });
            } else {
                if(topInfo.enable) {
                    topInfo.$element.hide();    
                }
                
                $body.css({
                    'padding-top': '0px'
                });
                
                that.$element.removeClass('fixed');
            }

            // set On
            var fromTop = $(this).scrollTop() + that.$element.height() + naviHeight;
            var $current = $scrollItems.map(function() {
                if ($(this).offset().top < fromTop) {
                    return this;
                }
            });
            
            if(topInfo.enable) {
                $current = $current[$current.length-2];    
            } else {
                $current = $current[$current.length-1];
            }
            
            var id = $current.attr('id');
            // 마지막 체크
            if((that.$window.scrollTop() + that.$window.height()) === $document.height()){
                if(lastId === null) {
                    id = that.$element.parent().children().last().attr('id');    
                } else {
                    id = lastId;
                }
            }

            $naviItems.removeClass('on').filter('[href="#' + id + '"]').addClass('on');
        });

        that._setButton();
    };

    jsSpyScroll.prototype._setButton = function() {
        var that = this;
        var $html = $('html, body');
        var naviHeight = that.$element.height();

        this.$element.find('a').on('click', function() {
            if($(this).hasClass('js-page-navi-external')) {
                return true;
            }

            var href = $(this).attr('href');
            $html.animate({scrollTop: $(href).offset().top - naviHeight}, that.options.scrollSpeed);
        });
    };

    $.fn.jsSpyScroll = function(options) {
        return new jsSpyScroll($(this), options);
    };

}));
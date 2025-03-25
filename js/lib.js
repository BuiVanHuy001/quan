(function ($) {

    $.tools = $.tools || {
        version: '1.2.6'
    };

    $.tools.tabs = {

        conf: {
            tabs: 'a',
            current: 'current',
            onBeforeClick: null,
            onClick: null,
            effect: 'default',
            initialIndex: 0,
            event: 'click',
            rotate: false,

            // slide effect
            slideUpSpeed: 400,
            slideDownSpeed: 400,

            // 1.2
            history: false,
            currentClose: false,
            anotherClose: true
        },

        addEffect: function (name, fn) {
            effects[name] = fn;
        }
    };
})(jQuery);
jQuery(window).load(function () {
    "use strict";
    if (window.location.hash === '#portfolio') {
        jQuery('#portfolio .section_header .section_title a').trigger('click');
    }
});

jQuery(document).ready(function () {
    $QRname = jQuery('#profile_data .name .td').html();
    $QRbirth = jQuery('#profile_data .birth .td').html();
    $QRphone = jQuery('#profile_data .phone .td').html();
    $QRemail = jQuery('#profile_data .email .td').html();
    $QRsite = jQuery('#profile_data .website .td').html();
    $QRsiteClean = jQuery('#profile_data .website .td a').attr("href");
    $QRadress = jQuery('#profile_data .address .td').html()

    if( $QRname != null && $QRname != "" ) {  jQuery('#profile_data .name').slideDown() }
    if( $QRbirth != null && $QRbirth != "" ) { jQuery('#profile_data .birth').slideDown() }
    if( $QRadress != null && $QRadress != "" ) { jQuery('#profile_data .address').slideDown() }
    if( $QRphone != null && $QRphone != "" ) { jQuery('#profile_data .phone').slideDown() }
    if( $QRemail != null && $QRemail != "" ) { jQuery('#profile_data .email').slideDown() }
    if( $QRsite != null && $QRsite != "" ) { jQuery('#profile_data .website').slideDown() }
    jQuery('#mainpage_accordion_area').tabs('section > .section_body', {
        tabs: 'section > .section_header > .section_title',
        effect: 'slide',
        slideUpSpeed: 600,
        slideDownSpeed: 600,
        onClick: function (e, tabIndex) {
            var tabs = jQuery('#mainpage_accordion_area section > .section_header > .section_title');
            var tab = tabs.eq(tabIndex);
            if (tab.hasClass('resume_section_title')) {					// Resume
                jQuery('.widget_skills .skills_row').each(function () {
                    var wd = jQuery(this).find('.progress').attr('data-process');
                    if (jQuery(this).find('.progress').width() === 0) {
                        jQuery(this).find('.progress').animate({'width': wd}, 700);
                    }
                    jQuery('.svg').addClass('vis');
                });
                if (jQuery('#resume .section_body').css('display') === 'none') {
                    jQuery('#resume .section_body').parent().removeClass('open');
                } else {
                    jQuery('#resume .section_body').parent().addClass('open');
                }
            } else if (tab.hasClass('portfolio_section_title')) {		// Portfolio

                if (jQuery('.portfolio_items.isotope').length > 0 && jQuery('.portfolio_items.isotope:hidden').length === 0) {
                    jQuery('.portfolio_items').isotope({filter: getIsotopeFilter()});
                }
            }
            return false;
        },
        currentClose: true,
        anotherClose: false,
        initialIndex: -1
    });


    jQuery('#mainpage_accordion_area h2.section_title').click(function () {
        var ofs = jQuery(this).offset().top;
        jQuery('html, body').animate({'scrollTop': ofs - 50});
    });
});

$(document).ready(() => {

    if (window.innerWidth < 1100) {
        let navigation = $('.az-navbar');
        if (!navigation.hasClass('closed'))
            navigation.addClass('closed');
    }

    $('')

    doParentsSelected();

    $('.nav-mobile-button').on('click', function () {
        let navigation = $('.az-navbar');
        if (navigation.hasClass('closed'))
            navigation.removeClass('closed');
        else
            navigation.addClass('closed');
    });


    $(window).resize(function () {
        if (window.innerWidth < 1100) {
            let navigation = $('.az-navbar');
            if (!navigation.hasClass('closed'))
                navigation.addClass('closed');
        }
    });

})

function closeAllOpenSubItems() {
    /* Close All open sub items */
    $('.nav-link-item-parent-link').each(function (i, v) {
        let parent = $(v).parent();
        parent.removeClass("nav-active");
        parent.children("ul").eq(0).css("display", 'none');
    });
}

function closeAllOpenMainItems() {
    /* Close All open main items */
    $('.nav-link').each(function (i, v) {
        let parent = $(v).parent();
        parent.removeClass("nav-active");
        parent.children("ul").eq(0).css("display", 'none');
    });
}


function doParentsSelected() {

    $('.stellarnav li').not(':first').filter('.active').removeClass('active');

    $('.stellarnav li .active').parents('li').addClass('active');

}

$('body').on('click', '.nav-link', function (event) {

    closeAllOpenSubItems();

    closeAllOpenMainItems();

    /* Toggle self */
    let parent = $(event.target).parent();
    let currentCss = parent.children("ul").eq(0).css('display');
    parent.children("ul").eq(0).css("display", currentCss == 'block' ? 'none' : 'block');
    parent.addClass("nav-active");

    doParentsSelected();

})

$('body').on('click', '.nav-item', function (event) {

    doParentsSelected();

});

$('body').on('click', '.nav-link-item-parent-link', function (event) {

    /* Close All open sub items */
    closeAllOpenSubItems();

    let parent = $(event.target).parent();
    parent.children("ul").eq(0).css("display", 'block');
    parent.addClass("nav-active");

    doParentsSelected();

});

$('body').on('click', '.nav-link-item-link', function (event) {

    /* Close All open sub items */
    closeAllOpenSubItems();

    /* Close All Open Main ITems */
    closeAllOpenMainItems();

    doParentsSelected();

});

$(document).on('click', (e) => {
    if (window.innerWidth < 1100) {
        if (e.pageX > 300) {
            let navigation = $('.az-navbar');
            if (!navigation.hasClass('closed'))
                navigation.addClass('closed');
        }
    }
});

/* Close Item Outside of the column helper and open area */
$(document).on('click', (e) => {
    if ($(e.target).closest(".nav-link").length === 0 &&
        $(e.target).closest(".nav-link-item-parent-link").length === 0 &&
        $(e.target).closest(".nav-link-item-ul").length === 0
        && $(e.target).closest(".nav-link-item-ul-sub").length === 0) {

        /* Close All open sub items */
        closeAllOpenSubItems();

        /* Close All open main items */
        closeAllOpenMainItems();

    }

    doParentsSelected();
});
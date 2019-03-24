$('body').on('click', '.nav-link', function (event) {


    /* Close All open sub items */
    $('.nav-link-item-parent-link').each(function (i, v) {
        let parent = $(v).parent();
        parent.children("ul").eq(0).css("display", 'none');
    })

    /* Close All open main items */
    $('.nav-link').each(function (i, v) {
        if (!$(event.target).is($(v))) {
            let parent = $(v).parent();
            parent.children("ul").eq(0).css("display", 'none');
        }
    })

    /* Toggle self */
    let parent = $(event.target).parent();
    let currentCss = parent.children("ul").eq(0).css('display');
    parent.children("ul").eq(0).css("display", currentCss == 'block' ? 'none' : 'block');
})

$('body').on('click', '.nav-link-item-parent-link', function (event) {

    /* Close All open sub items */
    $('.nav-link-item-parent-link').each(function (i, v) {
        if (!$(event.target).is($(v))) {
            let parent = $(v).parent();
            parent.children("ul").eq(0).css("display", 'none');
        }
    })

    let parent = $(event.target).parent();
    parent.children("ul").eq(0).css("display", 'block');
});

/* Close Item Outside of the column helper and open area */
$(document).on('click', (e) => {
    if ($(e.target).closest(".nav-link-item-parent-link").length === 0
        && $(e.target).closest(".nav-link").length === 0) {

        /* Close All open sub items */
        $('.nav-link-item-parent-link').each(function (i, v) {
            let parent = $(v).parent();
            parent.children("ul").eq(0).css("display", 'none');
        })

        /* Close All open main items */
        $('.nav-link').each(function (i, v) {
            let parent = $(v).parent();
            parent.children("ul").eq(0).css("display", 'none');
        })
    }
});
$(document).ready(function() {
    
    $('.table-config-button, .close-table-helper').on('click',function () {
        $(".table-column-helper").animate({width: 'toggle'}, "fast");
    });
    
});
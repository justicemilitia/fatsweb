$(document).ready(function() {
    $('.table-config-button').on('click',function () {
        $(".table-column-helper").animate({width: 'toggle'}, "fast");
    });

   /*$('.table-column-helper-down').on('click',function() {
    $(this).detach().appendTo('#DestinationContainerNode')
   });
   $('.table-column-helper-up').on('click',function() {
    alert("Yukari");
   });*/
});
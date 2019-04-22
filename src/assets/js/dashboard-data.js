function loadData() {
  $(function () {
    'use strict'

    $('.az-iconbar .nav-link').on('click', function (e) {
      e.preventDefault();

      $(this).addClass('active');
      $(this).siblings().removeClass('active');

      $('.az-iconbar-aside').addClass('show');

      var targ = $(this).attr('href');
      $(targ).addClass('show');
      $(targ).siblings().removeClass('show');
    });

    $('.az-iconbar-toggle-menu').on('click', function (e) {
      e.preventDefault();

      if (window.matchMedia('(min-width: 992px)').matches) {
        $('.az-iconbar .nav-link.active').removeClass('active');
        $('.az-iconbar-aside').removeClass('show');
      } else {
        $('body').removeClass('az-iconbar-show');
      }
    })

    $('#azIconbarShow').on('click', function (e) {
      e.preventDefault();
      $('body').toggleClass('az-iconbar-show');

      var targ = $('.az-iconbar .nav-link.active').attr('href');
      $(targ).addClass('show');
    });

    $(document).bind('click touchstart', function (e) {
      e.stopPropagation();

      var azContent = $(e.target).closest('.az-content').length;
      var azIconBarMenu = $(e.target).closest('.az-header-menu-icon').length;

      if (azContent) {
        $('.az-iconbar-aside').removeClass('show');

        // for mobile
        if (!azIconBarMenu) {
          $('body').removeClass('az-iconbar-show');
        }
      }
    });

    /******************* DASHBOARD CHARTS **************************/

    if ($('#flotChart1').length == 0)
      return;

    $.plot('#flotChart1', [{
      data: dashData5,
      color: '#560bd0'
    }], {
        series: {
          shadowSize: 0,
          lines: {
            show: true,
            lineWidth: 2,
            fill: true,
            fillColor: { colors: [{ opacity: 0 }, { opacity: .5 }] }
          }
        },
        grid: {
          borderWidth: 0,
          labelMargin: 0
        },
        yaxis: {
          show: false,
          min: 0,
          max: 60
        },
        xaxis: { show: false }
      });


    if ($('#flotChart2').length == 0)
      return;


    $.plot('#flotChart2', [{
      data: dashData6,
      color: '#006adb'
    }], {
        series: {
          shadowSize: 0,
          lines: {
            show: true,
            lineWidth: 2,
            fill: true,
            fillColor: { colors: [{ opacity: 0 }, { opacity: .5 }] }
          }
        },
        grid: {
          borderWidth: 0,
          labelMargin: 0
        },
        yaxis: {
          show: false,
          min: 0,
          max: 80
        },
        xaxis: { show: false }
      });


    if ($('#flotChart3').length == 0)
      return;


    $.plot('#flotChart3', [{
      data: dashData7,
      color: '#00cccc'
    }], {
        series: {
          shadowSize: 0,
          lines: {
            show: true,
            lineWidth: 2,
            fill: true,
            fillColor: { colors: [{ opacity: 0 }, { opacity: .5 }] }
          }
        },
        grid: {
          borderWidth: 0,
          labelMargin: 0
        },
        yaxis: {
          show: false,
          min: 0,
          max: 80
        },
        xaxis: { show: false }
      });


    if ($('#flotChart4').length == 0)
      return;


    $.plot('#flotChart4', [{
      data: dashData5,
      color: '#f10075'
    }], {
        series: {
          shadowSize: 0,
          lines: {
            show: true,
            lineWidth: 2,
            fill: true,
            fillColor: { colors: [{ opacity: 0 }, { opacity: .5 }] }
          }
        },
        grid: {
          borderWidth: 0,
          labelMargin: 0
        },
        yaxis: {
          show: false,
          min: 0,
          max: 80
        },
        xaxis: { show: false }
      });


    if ($('#flotChart5').length == 0)
      return;


    $.plot('#flotChart5', [{
      data: dashData6,
      color: '#3bb001'
    }], {
        series: {
          shadowSize: 0,
          lines: {
            show: true,
            lineWidth: 2,
            fill: true,
            fillColor: { colors: [{ opacity: 0 }, { opacity: .5 }] }
          }
        },
        grid: {
          borderWidth: 0,
          labelMargin: 0
        },
        yaxis: {
          show: false,
          min: 0,
          max: 80
        },
        xaxis: { show: false }
      });


    if ($('#flotChart6').length == 0)
      return;


    $.plot('#flotChart6', [{
      data: dashData7,
      color: '#fd7e14'
    }], {
        series: {
          shadowSize: 0,
          lines: {
            show: true,
            lineWidth: 2,
            fill: true,
            fillColor: { colors: [{ opacity: 0 }, { opacity: .5 }] }
          }
        },
        grid: {
          borderWidth: 0,
          labelMargin: 0
        },
        yaxis: {
          show: false,
          min: 0,
          max: 80
        },
        xaxis: { show: false }
      });


    if ($('#flotChart7').length == 0)
      return;


    $.plot('#flotChart7', [{
      data: dashData4,
      color: '#560bd0',
      curvedLines: { apply: true }
    }], {
        series: {
          shadowSize: 0,
          lines: {
            show: true,
            lineWidth: 0,
            fill: true,
            fillColor: { colors: [{ opacity: .5 }, { opacity: 1 }] }
          },
          curvedLines: { active: true }
        },
        grid: {
          borderWidth: 0,
          labelMargin: 0
        },
        yaxis: {
          show: true,
          min: 0,
          max: 50,
          ticks: [[0, ''], [10, '50'], [20, '150'], [30, '300']],
          tickColor: '#f3f3f3'
        },
        xaxis: {
          show: true,
          ticks: [[0, ''], [20, 'ŞUBAT'], [40, 'MART'], [60, 'NİSAN']],
          tickColor: 'rgba(255,255,255,0)'
        }
      });


    if ($('#flotChart8').length == 0)
      return;


    $.plot('#flotChart8', [{
      data: dashData4,
      color: '#3381d6'
    }], {
        series: {
          bars: {
            show: true,
            lineWidth: 0,
            fill: 1,
            barWidth: .5
          }
        },
        grid: {
          borderWidth: 0,
          labelMargin: 0
        },
        yaxis: {
          show: true,
          min: 0,
          max: 30,
          ticks: [[0, ''], [10, '100'], [20, '200']],
          tickColor: 'rgba(255,255,255,0)'
        },
        xaxis: {
          show: true,
          max: 40,
          ticks: [[0, ''], [15, 'MART'], [30, 'NİSAN']],
          tickColor: 'rgba(255,255,255,0)'
        }
      });


    if ($('#flotChart9').length == 0)
      return;


    $.plot('#flotChart9', [{
      data: dashData3,
      color: '#fff',
      bars: {
        show: true,
        lineWidth: 0,
        barWidth: .5
      }
    }, {
      data: dashData4,
      color: '#fff',
      lines: {
        show: true,
        lineWidth: 2,
        fill: .16
      }
    }], {
        series: {
          shadowSize: 0
        },
        grid: {
          borderWidth: 0,
          labelMargin: 0
        },
        yaxis: {
          show: true,
          min: 0,
          max: 30,
          ticks: [[0, ''], [10, '100'], [20, '200']],
          tickColor: 'rgba(255,255,255,0)'
        },
        xaxis: {
          show: true,
          max: 40,
          ticks: [[0, ''], [15, 'MART'], [30, 'NİSAN']],
          tickColor: 'rgba(255,255,255,0)'
        }
      });

    //
  });
}
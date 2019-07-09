export const loadMorris = function (morris1, morris2, morris3) {

  if ($('#morrisDonut1').length == 0)
    return;

  if (morris1 && morris1.length > 0) {

    $('#morrisDonut1').children().remove();

    new Morris.Donut({
      element: 'morrisDonut1',
      data: morris1,
      colors: morris1.map(x => x.color),
      resize: true
    });

  }
  if (morris2 && morris2.length > 0) {

    $('#morrisDonut2').children().remove();

    new Morris.Donut({
      element: 'morrisDonut2',
      data: morris2,
      colors: morris2.map(x => x.color),
      resize: true,
    });

  }

  if (morris3 && morris3.length > 0) {

    $('#morrisDonut3').children().remove();

    new Morris.Donut({
      element: 'morrisDonut3',
      data: morris3,
      colors: morris3.map(x => x.color),
      resize: true,
    });

  }

};

export const loadFlotLine = function (flotDimention, yValues, xValues) {

  if ($('#flotLine1').length == 0)
    return;

  $('#flotLine1').children().remove();
  $.plot('#flotLine1', [{
    data: flotDimention,
    color: '#f10075'
  }], {
      series: {
        shadowSize: 0,
        lines: {
          show: true,
          lineWidth: 3,
          fill: true,
          fillColor: { colors: [{ opacity: 0 }, { opacity: 0.12 }] }
        }
      },
      grid: {
        borderWidth: 0,
      },
      yaxis: {
        min: 0,
        max: (yValues.length > 0 ? yValues[yValues.length - 1][0] : 0),
        tickColor: '#ddd',
        ticks: yValues,
        font: {
          color: '#444',
          size: 10
        },
      },
      xaxis: {
        min: (xValues.length > 0 ? xValues[0][0] : 0),
        max: (xValues.length > 0 ? xValues[xValues.length - 1][0] : 0),
        //mode: 'categories',
        tickColor: '#eee',
        ticks: xValues,
        font: {
          color: '#999',
          size: 9
        },
      }
    });
};

export const loadMonth = function( xValues){

  if ($('#flotChart7').length == 0)
      return;


    $.plot('#flotChart7', [{
      data: dashData4,
      color: '#560bd0',
      // curvedLines: { apply: true }
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
          ticks: xValues,
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
          ticks: xValues,
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
          ticks: xValues,
          tickColor: 'rgba(255,255,255,0)'
        }
      });
}
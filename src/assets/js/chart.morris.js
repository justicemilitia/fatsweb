export const loadMorris = function (morris1, morris2) {

  if (morris1) {

    $('#morrisDonut1').children().remove();

    new Morris.Donut({
      element: 'morrisDonut1',
      data: morris1,
      colors: morris1.map(x => x.color),
      resize: true
    });

  }
  if (morris2) {

    $('#morrisDonut2').children().remove();

    new Morris.Donut({
      element: 'morrisDonut2',
      data: morris2,
      colors: morris2.map(x => x.color),
      resize: true,
    });

  }

  if (morris2) {

    $('#morrisDonut3').children().remove();

    new Morris.Donut({
      element: 'morrisDonut3',
      data: morris2,
      colors: morris2.map(x => x.color),
      resize: true,
    });

  }

};

export const loadFlotLine = function (flotDimention, yValues,xValues) {
  $.plot('#flotLine1', [{
    data: flotDimention,
    color: '#f10075'
  }], {
      series: {
        shadowSize: 0,
        lines: {
          show: true,
          lineWidth: 2,
          fill: true,
          fillColor: { colors: [{ opacity: 0 }, { opacity: 0.12 }] }
        }
      },
      grid: {
        borderWidth: 0
      },
      yaxis: {
        min: 0,
        max: 5318960,
        tickColor: '#ddd',
        ticks: yValues,
        font: {
          color: '#444',
          size: 10
        }
      },
      xaxis: {
        mode: 'categories',
        tickColor: '#eee',
        ticks: xValues,
        font: {
          color: '#999',
          size: 9
        }
      }
    });
}
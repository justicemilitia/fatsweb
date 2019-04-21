export const loadPieChart = function (piedata) {


  $.plot('#flotPie2', piedata, {
    series: {
      pie: {
        show: true,
        radius: 1,
        innerRadius: 0.5,
        label: {
          show: true,
          radius: 1,
          formatter: labelFormatter,
          threshold: 0
        }
      }
    },
    grid: {
      hoverable: true,
      clickable: true
    },
    legend: {
      show: false
    }
  });
}

function labelFormatter(label, series) {
  return '<div class="flotpie-text">' + label + '<br/>' + Math.round(series.percent) + '</div>';
}


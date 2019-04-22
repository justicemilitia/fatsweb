export const loadPieChart = function (piedata) {

  if ($('#flotPie2').length == 0)
    return;

  $.plot('#flotPie2', piedata, {
    series: {
      pie: {
        show: true,
        radius: 3/4,
        innerRadius: 0.5,
        label: {
          show: true,
          radius: 2/4,
          formatter: labelFormatter,
          threshold: 0.1
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
  console.log(series);
  return '<div class="flotpie-text">' + label + '<br/>' + Math.round(series.data.length > 0 ? series.data[0][1] : 0) + '</div>';
}


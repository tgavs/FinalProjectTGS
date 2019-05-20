anychart.onDocumentReady(function () {
    // The data used in this sample can be obtained from the CDN
    // https://cdn.anychart.com/csv-data/msft-daily-short.js
    // https://cdn.anychart.com/csv-data/csco-daily-short.js

    // create data tables on loaded data
    var msftDataTable = anychart.data.table();
    msftDataTable.addData(get_msft_daily_short_data());

    var cscoDataTable = anychart.data.table();
    cscoDataTable.addData(get_csco_daily_short_data());

    // create stock chart
    var chart = anychart.stock();

    // create first plot on the chart with column series
    var firstPlot = chart.plot(0);
    firstPlot.height('50%');

    // create step area series on the third plot
    var MSFT = firstPlot.rangeSplineArea(msftDataTable.mapAs({'low': 3, 'high': 4})).name('MSFT');
    var CSCO = firstPlot.rangeSplineArea(cscoDataTable.mapAs({'low': 3, 'high': 4})).name('CSCO');
    CSCO.fill('#1976d2 0.6')
            .highStroke('1.5 #1976d2')
            .lowStroke('1.5 #1976d2');

    // set grid settings
    firstPlot.yGrid(true)
             .xGrid(true)
            .yMinorGrid(true)
            .xMinorGrid(true);

    // create second plot on the chart
    var secondPlot = chart.plot(1);
    // create area series on the second plot
    secondPlot.splineArea()
            .name('MSFT')
            .data(msftDataTable.mapAs({'value': 4}))
            .tooltip(false);

    // create third plot on the chart
    var thirdPlot = chart.plot(2);
    // create spline area series on the third plot
    thirdPlot.splineArea()
            .name('CSCO')
            .data(cscoDataTable.mapAs({'value': 4}))
            .fill('#1976d2 0.6')
            .stroke('1.5 #1976d2')
            .tooltip(false);

    // set tooltip
    chart.tooltip()
            .useHtml(true)
            .format(function () {
                return tooltipFormatter(this)
            });

    // create scroller series with mapped data
    chart.scroller().area(msftDataTable.mapAs({'value': 4}));

    // set chart selected date/time range
    chart.selectRange('2006-01-03', '2007-12-20');

    // set container id for the chart
    chart.container('modelsChart');
    // initiate chart drawing
    chart.draw();

    // create range picker
    var rangePicker = anychart.ui.rangePicker();
    // init range picker
    rangePicker.render(chart);

    // create range selector
    var rangeSelector = anychart.ui.rangeSelector();
    // init range selector
    rangeSelector.render(chart);
});

function tooltipFormatter(item) {
    if (item.seriesName === 'CSCO')
        return '<br/><br/>' + item.seriesName +
                '<br/><span style="color: #ccc">High</span>: ' + item.high +
                '<br/><span style="color: #ccc">Low</span>: ' + item.low;

    return item.seriesName +
            '<br/><span style="color: #ccc">High</span>: ' + item.high +
            '<br/><span style="color: #ccc">Low</span>: ' + item.low;
}

                
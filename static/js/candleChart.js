//
//var symbol = d3.select("#symbolName");
function candleChart(urlCandle){

    // Create Data
    anychart.onDocumentReady(function () {
        // The data used in this sample can be obtained from the CDN
        // https://cdn.anychart.com/csv-data/csco-daily.csv
        anychart.data.loadCsvFile(urlCandle, function (dataFrame) {
            // create data table on loaded data

            console.log(dataFrame)
            var dataTable = anychart.data.table();
            dataTable.addData(dataFrame);

            // map loaded data for the ohlc series
            var mapping = dataTable.mapAs({
                'open': 1,
                'high': 2,
                'low': 3,
                'close': 4,
                'value': { 'column': 4, 'type': 'close' }
            });

            console.log(dataTable)

            // map loaded data for the scroller
            var scrollerMapping = dataTable.mapAs();
            scrollerMapping.addField('value', 5);

            // create stock chart
            var chart = anychart.stock();

            // create first plot on the chart
            var plot = chart.plot();
            plot.yGrid(true)
                .xGrid(true)
                .yMinorGrid(true)
                .xMinorGrid(true);

            var series = plot.candlestick(mapping).name('AAPL');
            series.legendItem().iconType('rising-falling');

            // create BBands indicator with period 20
            var bBandsIndicator = plot.bbands(mapping);
            bBandsIndicator.upperSeries().stroke('1.5 #3C8AD8');
            bBandsIndicator.middleSeries().stroke('1.5 #3C8AD8');
            bBandsIndicator.lowerSeries().stroke('1.5 #3C8AD8');

            // create scroller series with mapped data
            chart.scroller().line(mapping);

            // set chart selected date/time range
            chart.selectRange('2018-12-1', '2019-03-02');
            // set container id for the chart
            chart.container("container");
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
    });

}

/* function handleCandleClick(event){

    d3.event.preventDefault();

    var symbolN=document.getElementById("mySymbol").property("value");

    console.log(symbolN)

    var urlCandle = '/dailyquotes/' + symbolN;

    candleChart(urlCandle);

    d3.select("#company-name").text(symbolN)
} */

var submit=d3.select("#submitSearch");

submit.on("click",function(){

    d3.event.preventDefault();

    var inputElement=d3.select("#mySymbol");

    var inputValue=inputElement.property("value");

    console.log(inputValue);

    var urlCandle = '/dailyquotes/' + inputValue;

    candleChart(urlCandle);

})


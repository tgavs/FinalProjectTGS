var  submit=d3.select("#submit")

submit.on("click",function () {

    d3.event.preventDefault();

    d3.select("#container").remove()
    d3.select("#prophetChart").remove()

    d3.select("#candleChartBody")
      .append("div")
      .attr("class", "chart-area")
      .attr("id","container")

    d3.select("#prophetChartBody")
      .append("div")
      .attr("class", "chart-area")
      .attr("id", "prophetChart")


    var inputElement = d3.select("#submitBox");

    var inputValue=inputElement.property("value");

    console.log(inputValue);

    stockInfo(inputValue)
    candleChart(inputValue)
    //prophetChart(inputValue)
    highLowProphet(inputValue)
    

    //d3.select("#graficaText").text(inputValue);   
});


var sentiment=d3.select("#sentimentButton")

sentiment.on("click",function() {

    d3.event.preventDefault();

    d3.select("#sentimentChart").remove()

    d3.select("#sentimentChartBody")
        .append("div")
        .attr("class", "chart-area")
        .attr("id", "sentimentChart")
    
    var inputElement = d3.select("#submitBox");
    var inputValue = inputElement.property("value");

    stockSentiment(inputValue);
})



//----------------------------Candle Chart-----------------------

function candleChart(symbol) {

    var urlCandle = "/dailyquotes/" + symbol

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

            var series = plot.candlestick(mapping).name(symbol);
            series.legendItem().iconType('rising-falling');

            // create BBands indicator with period 20
            var bBandsIndicator = plot.bbands(mapping);
            bBandsIndicator.upperSeries().stroke('1.5 #3C8AD8');
            bBandsIndicator.middleSeries().stroke('1.5 #3C8AD8');
            bBandsIndicator.lowerSeries().stroke('1.5 #3C8AD8');

            // create scroller series with mapped data
            chart.scroller().line(mapping);

            // set chart selected date/time range
            chart.selectRange('2018-12-1', '2019-04-02');
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

//----------------------------ProphetChart-----------------------

function prophetChart(symbol) {

    var urlProphet = "/prophetForecast/" + symbol

    anychart.onDocumentReady(function () {
        // The data used in this sample can be obtained from the CDN
        // https://cdn.anychart.com/samples/combined-chart/range-spline-area-and-marker-chart/data.json
        anychart.data.loadCsvFile(urlProphet, function (data) {

            console.log(data)
            var dataSet = anychart.data.set(data);

            var seriesTrend = dataSet.mapAs({ 'x': [0], 'value': [1] });

            // map data for the first series, take x from the zero column and value from the first column of data set
            var seriesTrendLowHigh = dataSet.mapAs({ 'x': [0], 'low': [2], 'high': [3] });

            // map data for the second series, take x from the zero column and value from the second column of data set
            var seriesYhat = dataSet.mapAs({ 'x': [0], 'value': [4] });

            var seriesYhatLowHigh = dataSet.mapAs({ 'x': [0], 'low': [5], 'high': [6] });

            var seriesWeeklyLowHigh = dataSet.mapAs({ 'x': [0], 'low': [8], 'high': [9] });

            // create column chart
            var chart = anychart.column();

            // turn on chart animation
            chart.animation(true);

            // set chart title text settings
            chart.title('Price Trend and Forecast with FB Prophet for '+ symbol);

             // set settings for chart Y scale

            // set settings for chart X scale
            //chart.xScale(anychart.scales.dateTime());

            var dateTimeScale = anychart.scales.dateTime();
            var dateTimeTicks = dateTimeScale.ticks();
            dateTimeTicks.interval(0, 1);

            chart.xScale(dateTimeScale);

            // adjust axis labels
            var labels = chart.xAxis().labels();
            labels.hAlign("center");
            labels.width(60);
            labels.format(function (value) {
                var date = new Date(value["tickValue"]);
                var options = {
                    year: "numeric",
                    month: "short"
                };
                return date.toLocaleDateString("en-US", options);
            });

            // create line series and set scale for it
            chart.rangeSplineArea(seriesYhatLowHigh)
                .fill('#A9F5F2 0.6')
                .name("Price Forecast High Low");

            //set visuals
            /*         seriesTrendLowHigh.highStroke('#66BB6A', 2);
                    seriesTrendLowHigh.lowStroke('#FF7043', 2);
                    seriesTrendLowHigh.highFill('#66BB6A .5');
                    seriesTrendLowHigh.lowFill('#FF7043 .5'); */


            // create line series and set scale for it
            chart.rangeSplineArea(seriesTrendLowHigh)
                .fill('#A9F5BC 0.6')
                .name('Trend High Low');

            // create second series with mapped data
            chart.marker(seriesYhat)
                .type('diamond')
                .hatchFill("#0000FF")
                .fill("#0000FF")
                .stroke("#0000FF")
                .size(2)
                .hovered({ size: 10 })
                .name("Price Forecast");

            // create third series with mapped data
            chart.spline(seriesTrend)
                .color("#FA8258")
                .markers(false)
                .name("Trend Line");


            // Y axis Scale

            var globalMax = chart.getStat("yScalesMax");
            var globalMin = chart.getStat("yScalesMin");

            var yScales = chart.getYScales();


            chart.yScale()
                .softMinimum(globalMin)
                .softMaximum(globalMax)
                .ticks({ interval: 1 });

            //chart.selectRange('2004-01-02', '2004-01-15');

            chart.xScroller(true)


            chart.xScroller().thumbs(true);
            chart.xScroller().fill('#F2F2F2');
            chart.xScroller().selectedFill('#E3CEF6 .6');
            chart.xScroller().allowRangeChange(true);

            chart.xZoom().setToPointsCount(10, true);

            // set container id for the chart
            chart.container('prophetChart');

            // initiate chart drawing
            chart.draw();
        });
    });
    
};



//----------------Symbol Data------------------

function stockInfo(symbol) {

    var urlInfo = "/symbolData/"+symbol

    d3.json(urlInfo).then(function (sData) {

        console.log(sData);

        realTimePrice = sData.latestPrice;
        previousClose = sData.previousClose;
        sector = sData.sector;
        companyname = sData.companyName;


        d3.select("#realTimePrice").text(realTimePrice);
        d3.select("#previousClose").text(previousClose);
        d3.select("#sector").text(sector);
        d3.select("#nameHeader").text(companyname);


    });
};

//----------------Sentiment Trend------------------

function stockSentiment(symbol){

    var urlSent="/sentiment/"+symbol

    anychart.onDocumentReady(function () {
        // The data used in this sample can be obtained from the CDN
        // https://cdn.anychart.com/csv-data/orcl-intraday.csv
        anychart.data.loadCsvFile(urlSent,
            function (data) {
                // create data table on loaded data
                var dataTable = anychart.data.table();
                dataTable.addData(data);

                // create stock chart
                var chart = anychart.stock();

                // set chart title
                chart.title('Sentiment Analysis for '+symbol);

                // disable legend
                chart.plot(0).legend(true);

                // create line series
                var lineSeries = chart.plot(0).line(dataTable);

                // setup color scale ranges
                var lower = .4;
                var higher = .5;

                var colorScale = anychart.scales.ordinalColor();
                colorScale.ranges([{
                    less: lower,
                    color: {
                        angle: 80,
                        keys: ['#FF1C02', '.8 #4D899B']
                    }
                },
                {
                    from: lower,
                    to: higher,
                    color: '.7 #4D899B'
                },
                {
                    greater: higher,
                    color: {
                        angle: 80,
                        keys: ['.6 #4D899B', '#3F7F93']
                    }
                }
                ])
                lineSeries.colorScale(colorScale);

                // set series stroke settings using color scale
                lineSeries.stroke(function () {
                    return anychart.color.setThickness(this.scaledColor, 2);
                });

                lineSeries.hovered().markers().enabled(true);

                // create scroller series with mapped data
                chart.scroller().line(dataTable);

                // set values for selected range
                chart.selectRange('2019-01-01', '2019-05-15');

                // create range picker
                var rangePicker = anychart.ui.rangePicker();

                // init range picker
                rangePicker.render(chart);

                // create range selector
                var rangeSelector = anychart.ui.rangeSelector();

                // init range selector
                rangeSelector.render(chart);

                // set container id for the chart
                chart.container('sentimentChart');

                // initiate chart drawing
                chart.draw();
            });
    });

}


function highLowProphet(symbol){

    var urlProphet = "/prophetForecast/" + symbol

    anychart.onDocumentReady(function () {
        // create area chart
        var chart = anychart.area();

        
       
        // create data set on our data
        anychart.data.loadCsvFile(urlProphet, function (data) {


        var dataSet = anychart.data.set(data);

        // map mapping
        var mapping = dataSet.mapAs({
            'x': [0],
            'high': [4],
            'low': [1]
        });



        // create range area series
        var series = chart.rangeSplineArea(mapping);

        series.highStroke('#66BB6A', 2);
        series.lowStroke('#FF7043', 2);
        series.highFill('#66BB6A .5');
        series.lowFill('#FF7043 .5');
    
        var globalMax = chart.getStat("yScalesMax");
        var globalMin = chart.getStat("yScalesMin");

        chart.yScale()
             .softMinimum(globalMin)
             .softMaximum(globalMax)
             .ticks({ interval: 2 });

        // set container id for the chart
        chart.container('prophetChart');

        // initiate chart drawing
        chart.draw();
    });

    });
}





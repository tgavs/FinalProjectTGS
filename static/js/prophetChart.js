var urlprophet = '/prophetForecast/AAPL'



anychart.onDocumentReady(function () {
    // The data used in this sample can be obtained from the CDN
    // https://cdn.anychart.com/samples/combined-chart/range-spline-area-and-marker-chart/data.json
    anychart.data.loadCsvFile(urlprophet, function (data) {

        console.log(data)
        var dataSet = anychart.data.set(data);

        var seriesTrend= dataSet.mapAs({'x':[0],'value':[1]});

        // map data for the first series, take x from the zero column and value from the first column of data set
        var seriesTrendLowHigh = dataSet.mapAs({ 'x': [0], 'low': [2], 'high':[3] });
        
        // map data for the second series, take x from the zero column and value from the second column of data set
        var seriesYhat = dataSet.mapAs({ 'x': [0], 'value': [4] });

        var seriesYhatLowHigh = dataSet.mapAs({ 'x': [0], 'low': [5], 'high': [6] });

        var seriesWeeklyLowHigh = dataSet.mapAs({ 'x': [0], 'low': [8], 'high': [9] });


        


        // create column chart
        var chart = anychart.column();

        // turn on chart animation
        chart.animation(true);

        // set chart title text settings
        chart.title('Price Trend and Forecast with FB Prophet');

        // set settings for chart Y scale
        chart.yScale()
            .minimum(100)
            .maximum(230)
            .ticks({ interval: 1 });

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
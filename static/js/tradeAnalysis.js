

var  fitModels=d3.select("#fit-models")

fitModels.on("click",function(){

    d3.event.preventDefault();   

    console.log("fitting models")

    d3.select("#modelsChart").remove()

    d3.select("#modelsChartBody")
        .append("div")
        .attr("class", "chart-area")
        .attr("id", "modelsChart")
    
    var inputElement = d3.select("#submitBox");
    var inputValue = inputElement.property("value");

    var urlTrade="/api/tradeAnalysis/"+inputValue

    anychart.onDocumentReady(function () {
                
        // create data set on our data
        anychart.data.loadCsvFile(urlTrade, function (data) {

            console.log(data)


            var dataSet = anychart.data.set(data);

            // map mapping
            var seriesData_1 = dataSet.mapAs({ 'x': [0],
                                            'value': [1],
                                            });

            var seriesData_2 = dataSet.mapAs({ 'x': [0],
                                            'value': [2],
                                         });

            var seriesData_3 = dataSet.mapAs({ 'x': [0],
                                            'value': [3],
                                         });

            var seriesData_4 = dataSet.mapAs({ 'x': [0],
                                           'value': [4],
                                         });
                                        
            var chart=anychart.line();

            // turn on chart animation
            chart.animation(true);

            // set chart padding
            chart.padding([10, 20, 5, 20]);

            // turn on the crosshair
            chart.crosshair()
                    .enabled(true)
                    .yLabel(false)
                    .yStroke(null);

            // set tooltip mode to point
            chart.tooltip().positionMode('point');

            // set chart title text settings
            chart.title('Time Series Forecast with VAR, Prophet and LTSM');

            // set yAxis title
            chart.yAxis().title('Stock Price');
            chart.xAxis().labels().padding(5);

            // create first series with mapped data
            var series_1 = chart.line(seriesData_1);
            series_1.name('Price');
            series_1.hovered().markers()
                    .enabled(true)
                    .type('circle')
                    .size(4);
            series_1.tooltip()
                    .position('right')
                    .anchor('left-center')
                    .offsetX(5)
                    .offsetY(5);

            // create second series with mapped data
            var series_2 = chart.line(seriesData_2);
            series_2.name('VAR');
            series_2.hovered().markers()
                    .enabled(true)
                    .type('circle')
                    .size(4);
            series_2.tooltip()
                    .position('right')
                    .anchor('left-center')
                    .offsetX(5)
                    .offsetY(5);

            // create third series with mapped data
            var series_3 = chart.line(seriesData_3);
            series_3.name('Prophet');
            series_3.hovered().markers()
                    .enabled(true)
                    .type('circle')
                    .size(4);
            series_3.tooltip()
                    .position('right')
                    .anchor('left-center')
                    .offsetX(5)
                    .offsetY(5);

            // create third series with mapped data
            var series_4 = chart.line(seriesData_4);
            series_4.name('LTSM');
            series_4.hovered().markers()
                    .enabled(true)
                    .type('circle')
                    .size(4);
            series_4.tooltip()
                    .position('right')
                    .anchor('left-center')
                    .offsetX(5)
                    .offsetY(5);

            // turn the legend on
            chart.legend()
                    .enabled(true)
                    .fontSize(13)
                    .padding([0, 0, 10, 0]);

            // set container id for the chart
            chart.container('modelsChart');
            // initiate chart drawing
            chart.draw();
        });

    });

});


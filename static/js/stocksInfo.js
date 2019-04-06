function stockInfo(symbol){

    var urlInfo="/symbolData/"+symbol

    d3.json(urlInfo,function(symbolData){

        console.log(symbolData)

        realTimePrice=symbolData.iexRealtimePrice
        latestPrice = symbolData.latestPrice
        sector=symbolData.sector
        companyname=symbolData.companyName


        d3.select("#realTimePrice").text(realTimePrice)
        d3.select("#latestPrice").text(latestPrice)
        d3.select("#sector").text(sector)
        d3.select("#nameHeader").text(companyname)
        

    })
}


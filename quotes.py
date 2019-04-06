import pandas as pd
import requests
import json

from iexfinance.stocks import get_historical_data
from iexfinance.stocks import Stock

from datetime import datetime


def getHistory(Symbol):

    ticker=Symbol
    start=datetime(2017, 1, 1)
    end=datetime.today()

    data=get_historical_data(ticker, start, end, output_format='pandas')
    data.reset_index(inplace=True)
    data.dropna(inplace=True)

    dataFrame=pd.DataFrame({'date':data['date'],
                            'open':data['open'],
                            'high':data['high'],
                            'low':data['low'],
                            'close':data['close'],
                            'volume':data['volume'],
                            })


    
    return dataFrame.to_csv(header=None,index=False)   

def getSymbolData(Symbol):

    stockInfo=Stock(Symbol, output_format='json').get_quote()

    return stockInfo

def getLatestPrice(Symbol):

    stockInfo=Stock(Symbol,output_format='json').get_quote()   

    latestPrice= stockInfo['latestPrice']

    return latestPrice


    





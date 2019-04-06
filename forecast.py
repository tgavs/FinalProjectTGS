import pandas as pd

from iexfinance.stocks import get_historical_data
from iexfinance.stocks import Stock

from fbprophet import Prophet
from fbprophet.plot import add_changepoints_to_plot
from fbprophet.diagnostics import cross_validation, performance_metrics
from fbprophet.plot import plot_cross_validation_metric
import matplotlib.pyplot as plt

from datetime import datetime


def prophetForecast(Symbol):

    ticker=Symbol
    start=datetime(2017, 1, 1)
    end=datetime.today()

    data=get_historical_data(ticker, start, end, output_format='pandas')
    
    data.reset_index(inplace=True)

    df=pd.DataFrame({'ds':data['date'],
                     'y':data['open']
                     })
    
   
    
    m=Prophet(interval_width=0.95)

    m.fit(df)

    futureDates=m.make_future_dataframe(periods=60)

    forecast=m.predict(futureDates)
    
   

    data=pd.DataFrame({'date': forecast['ds'],
                       'trend':forecast['trend'],
                       'trend_upper':forecast['trend_upper'],
                       'trend_lower':forecast['trend_lower'],
                       'yhat':forecast['yhat'],
                       'yhat_lower':forecast['yhat_lower'],
                       'yhat_upper':forecast['yhat_upper'],
                       'weekly':forecast['weekly'],
                       'weekly_lower':forecast['weekly_lower'],
                       'weekly_upper':forecast['weekly_upper'],
                        })

    data.dropna(inplace=True)
    #data.reset_index(inplace=True)
    

   #fig = m.plot(forecast)

    #plt.xticks(rotation=90)
    #fig.savefig('static/img/prophet_forecast.png') 
    
    forecastDF=data.to_csv(index=False,header=False)
      
    return forecastDF




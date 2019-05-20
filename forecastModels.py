import pandas as pd
import numpy as np
import requests
import json
from datetime import datetime
import matplotlib.pyplot as plt

from iexfinance.stocks import get_historical_data

from ta import *

from sklearn.preprocessing import StandardScaler

from sklearn.preprocessing import MinMaxScaler

from statsmodels.tsa.vector_ar.var_model import VAR

from fbprophet import Prophet


from keras.models import Sequential
from keras.layers import Dense, Dropout
from keras.layers import LSTM


# Get data from the Symbol Quote

def getHistoryPriceModels(Symbol):

    ticker=Symbol
    start=datetime(2014, 1, 1)
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
    
    return dataFrame

#Function to generate Technical Analisis features

def techAnalysis(Data):
    
    DATE=Data['date']
    CLOSE=Data['close']    
    AARON_DOWN=aroon_down(Data['close'],n=25,fillna=True)
    AARON_UP=aroon_down(Data['close'],n=25,fillna=True)
    MACD=macd(Data['close'],n_fast=12,n_slow=26,fillna=True)
    MASS_INDEX=mass_index(Data['high'], Data['low'], n=9, n2=25, fillna=True)
    AO=ao(Data['high'], Data['low'], s=5, len=34, fillna=True)
    RSI=rsi(Data['close'],n=14,fillna=True)
    STOCH=stoch(Data['high'], Data['low'],Data['close'],n=14,fillna=True)
    TSI=tsi(Data['close'],r=25,s=13,fillna=True)
    
    dfTA=pd.DataFrame({'date':DATE,
                       'close':CLOSE,
                       'aaron_down':AARON_DOWN,
                       'aaron_up':AARON_UP,
                       'macd':MACD,
                       'mass_index':MASS_INDEX,
                       'ao':AO,
                       'rsi':RSI,
                       'stoch':STOCH,
                       'tsi':TSI
                      })
    
    return dfTA


def priceModels(DataFrame):

    TA=techAnalysis(DataFrame)

    #build Scaled Data Frame
    TAFeat=TA.drop(columns=['date'])
    columns=TAFeat.columns
    scaler = StandardScaler()
    TAScaled= scaler.fit_transform(TAFeat)
    TAScaledDF=pd.DataFrame(TAScaled,columns=columns)

    #Split train test
    train=TAScaledDF[:int(len(TAScaledDF)*.95)]
    test=TAScaledDF[int(len(TAScaledDF)*.95):]

    testDates=TA[int(len(TAScaledDF)*.95):]['date']

    #fit VAR model
    modelVAR=VAR(endog=train)
    modelVAR_fit=modelVAR.fit(3)
    resultsVAR=modelVAR_fit
    predictionVAR = modelVAR_fit.forecast(modelVAR_fit.y, steps=len(test))

    #build predictions dataframe
    predictionsScaled=pd.DataFrame(predictionVAR,columns=columns)
    predictionOriginalScale=scaler.inverse_transform(predictionsScaled)
    predictionOriginalScaleDF=pd.DataFrame(predictionOriginalScale,columns=columns)

    #Inverse Scale the predictions

    testOriginalScale=scaler.inverse_transform(test)
    testOriginalScaleDF=pd.DataFrame(testOriginalScale,columns=columns)

    resultsVAR=pd.DataFrame({'date':testDates.to_list(),
                            'test':testOriginalScaleDF['close'].to_list(),
                            'VAR':predictionOriginalScaleDF['close']
                            })

##########################################################Prophet Model##########################################################################################

    #Split train test
    dataProphet=DataFrame[['date','close']]

    trainProphet=dataProphet[:int(len(dataProphet)*.95)]
    testProphet=dataProphet[int(len(dataProphet)*.95):]

    trainProphet.rename(columns={'date':'ds',
                                'close':'y'
                                },
                        inplace=True
                         )
    testProphet.rename(columns={'date':'ds',
                                'close':'y'
                               },
                        inplace=True
                        )

    #fit the model

    m=Prophet(changepoint_prior_scale=0.1,interval_width=0.95,yearly_seasonality=12)
    m.add_seasonality(name='weekly', period=7, fourier_order=3, prior_scale=0.1)
    m.add_seasonality(name='twoday', period=2, fourier_order=2, prior_scale=0.6)
    m.fit(trainProphet) 

    #build future dates dataframe

    trainfutureDates=m.make_future_dataframe(periods=len(testProphet))

    #make forecast

    forecast = m.predict(trainfutureDates)

    #save results

    prophetEstimation=forecast[len(trainProphet):]['yhat'].to_list()

    resultsVAR['Prophet']=forecast[len(trainProphet):]['yhat'].to_list()

##########################################################LTSM Neural Network##########################################################################################

    # Part 1 - Data Preprocessing

    data=DataFrame.set_index('date')
    dataTrain=data[:int(len(dataProphet)*.95)]
    dataTest=data[int(len(dataProphet)*.95):]

    # Importing the training set
    dataset_train = dataTrain
    training_set = dataset_train.iloc[:, 1:2].values

    # Feature Scaling
    from sklearn.preprocessing import MinMaxScaler
    sc = MinMaxScaler(feature_range = (0, 1))
    training_set_scaled = sc.fit_transform(training_set)

    # Creating a data structure with 60 timesteps and 1 output
    X_train = []
    y_train = []
    for i in range(60, len(dataset_train)):
        X_train.append(training_set_scaled[i-60:i, 0])
        y_train.append(training_set_scaled[i, 0])
    X_train, y_train = np.array(X_train), np.array(y_train)

    # Reshaping
    X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))

    # Part 2 - Building the RNN

    # Initialising the RNN
    regressor = Sequential()

    # Adding the first LSTM layer and some Dropout regularisation
    regressor.add(LSTM(units = 50, return_sequences = True, input_shape = (X_train.shape[1], 1)))
    regressor.add(Dropout(0.2))

    # Adding a second LSTM layer and some Dropout regularisation
    regressor.add(LSTM(units = 50, return_sequences = True))
    regressor.add(Dropout(0.2))

    # Adding a third LSTM layer and some Dropout regularisation
    regressor.add(LSTM(units = 50, return_sequences = True))
    regressor.add(Dropout(0.2))

    # Adding a fourth LSTM layer and some Dropout regularisation
    regressor.add(LSTM(units = 50))
    regressor.add(Dropout(0.2))

    # Adding the output layer
    regressor.add(Dense(units = 1))

    # Compiling the RNN
    regressor.compile(optimizer = 'adam', loss = 'mean_squared_error')

    # Fitting the RNN to the Training set
    regressor.fit(X_train, y_train, epochs = 10, batch_size = 32)

    # Part 3 - Making the predictions and visualising the results

    # Getting the real stock price of 2017
    dataset_test = dataTest
    real_stock_price = dataset_test.iloc[:, 1:2].values

    # Getting the predicted stock price of 2019
    dataset_total = pd.concat((dataset_train['open'], dataset_test['open']), axis = 0)
    inputs = dataset_total[len(dataset_total) - len(dataset_test) - 60:].values
    inputs = inputs.reshape(-1,1)
    inputs = sc.transform(inputs)
    X_test = []

    for i in range(60,int(60+len(dataset_test))):
        X_test.append(inputs[i-60:i, 0])
    X_test = np.array(X_test)
    X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))
    predicted_stock_price = regressor.predict(X_test)
    predicted_stock_price = sc.inverse_transform(predicted_stock_price)

    resultsVAR['LTSMNeuralNetwork']=predicted_stock_price

    resultsVAR['date']=pd.to_datetime(resultsVAR['date'])

    results=resultsVAR.to_csv(index=False,header=False)
 
    return results


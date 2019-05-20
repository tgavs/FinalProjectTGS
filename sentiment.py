#Import Dependencies
import pandas as pd
import numpy as np
import requests
import time
import json
import jsonify

from datetime import date
from datetime import datetime

import GetOldTweets3 as got
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer


def getSentiment(Symbol):

    ticker=Symbol
    start=datetime(2017, 1, 1)
    end=datetime.today()

    tweetCriteria = got.manager.TweetCriteria().setQuerySearch(f'${ticker}')\
                                           .setSince(start.strftime('%Y-%m-%d'))\
                                           .setUntil(end.strftime('%Y-%m-%d'))\
                                           .setMaxTweets(1000)


    tweets = got.manager.TweetManager.getTweets(tweetCriteria)

    text=[]
    date=[]
    favorites=[]
    retweets=[]

    for item in tweets:
        
        text.append(item.text)
        date.append(item.date)
        favorites.append(item.favorites)
        retweets.append(item.retweets)
        
    tweetsdf=pd.DataFrame({'text':text,
                           'date':pd.to_datetime(date,infer_datetime_format=True).strftime("%Y-%m-%d %H:%M"),
                           'favs':favorites,
                           'retweets':retweets
                          })

    nltk.downloader.download('vader_lexicon')
    sid=SentimentIntensityAnalyzer()

    tweetsdf['sentiment']=tweetsdf['text'].apply(sid.polarity_scores)

    tweetsdf['sentScore'] = tweetsdf['sentiment'].apply(lambda x: x['compound'])

    sentiments=tweetsdf[['date','sentScore']]
    
    sentiments['date']=pd.to_datetime(sentiments['date'],infer_datetime_format=True)

    s=sentiments.resample('5T', on='date').mean()

    s=s.reset_index()
    s=s.dropna()
    s['date']=s['date'].dt.strftime("%Y-%m-%d %H:%M")

    sentDF=s.to_csv(index=False,header=False)

    return sentDF




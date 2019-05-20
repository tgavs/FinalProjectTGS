import os

import pandas as pd
import numpy as np

import sqlalchemy

# Imports the methods needed to abstract classes into tables
from sqlalchemy.ext.declarative import declarative_base

# Allow us to declare column types
from sqlalchemy import Column, Integer, String, Float 

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask import request,redirect
from flask_sqlalchemy import SQLAlchemy


#Personal Libraries

from quotes import getHistory, getSymbolData
from forecast import prophetForecast
from sentiment import getSentiment

from forecastModels import priceModels,getHistoryPriceModels

app = Flask(__name__)


app.config["SQLALCHEMY_DATABASE_URI"] =os.environ.get('DATABASE_URL','') or "sqlite:///db/StocksSymbols.db"

db = SQLAlchemy(app)

# from .models import StocksSymbols

# reflect an existing database into a new model
#Base = automap_base()
# reflect the tables
#Base.prepare(db.engine, reflect=True)

#StocksSymbols = Base.classes.StocksSymbols

class Symbols(db.Model):

    __tablename__='StocksSymbols'
    date=db.Column(db.String, primary_key=True)
    iexId=db.Column(db.String(64))
    isEnabled=db.Column(db.String(64))
    name=db.Column(db.String(64))
    symbol=db.Column(db.String(64))
    type=db.Column(db.String(64))

@app.before_first_request
def setup():
    # Recreate database each time for demo
    # db.drop_all()
    db.create_all()

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("home.html")


@app.route("/api/symbols")
def symbols():    

   #Use Pandas to perform the sql query

    results=db.session.query(Symbols.name,Symbols.symbol).limit(150)

    symbolsDF={'symbols':[result[1] for result in results]    
              }
    
    jsonSymbols=jsonify(symbolsDF)

    #Return a list of the column names (sample names)
    return jsonSymbols 

@app.route("/dailyquotes/<symbol>", methods=["GET", "POST"])

def quotes(symbol):

    if request.method=="POST":

        symbol=request.form["symbol"]
    
    dailyPrices=getHistory(symbol)

    return dailyPrices

@app.route("/prophetForecast/<symbol>",methods=["GET","POST"])

def prophet(symbol):

    if request.method=="POST":

        symbol=request.form["symbol"]
   
    prophetF=prophetForecast(symbol)

    return prophetF

@app.route("/symbolData/<symbol>")

def symbolData(symbol,methods=["GET","POST"]):

    if request.method=="POST":

        symbol=request.form["symbol"]
   
    sData=getSymbolData(symbol)

    return jsonify(sData)

@app.route("/sentiment/<symbol>")

def symbolSentiment(symbol,methods=["GET","POST"]):

    if request.method=="POST":

        symbol=request.form["symbol"]

    sentimentData= getSentiment(symbol)

    return sentimentData


@app.route("/api/tradeAnalysis")

def modelsPage():

    return render_template("tradeAnalysis.html")

@app.route("/api/tradeAnalysis/<symbol>")

def tradeModels(symbol,methods=["GET","POST"]):

    if request.method=="POST":

        symbol=request.form["symbol"]
    
    prices=getHistoryPriceModels(symbol)

    priceForecast=priceModels(prices)

    return priceForecast

if __name__ == "__main__":
    app.run(debug=True)
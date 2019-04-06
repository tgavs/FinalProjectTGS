from .app import db

class StocksSymbols(db.Model):

    __tablename__='StocksSymbols'

    date=db.Column(db.String, primary_key=True)
    iexId=db.Column(db.String(64))
    isEnabled=db.Column(db.String(64))
    name=db.Column(db.String(64))
    symbol=db.Column(db.String(64))
    type=db.Column(db.String(64))

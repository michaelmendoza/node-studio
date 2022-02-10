import datetime
import pymongo 
from dotenv import dotenv_values

config = dotenv_values(".env") 
database = config['DB_NAME']
mongo_uri = config['MONGO_URL']
client = pymongo.MongoClient(mongo_uri)
db = client[database]

import pymongo
import pandas as pd

#Enter your json data file name
filename = 'zoo_data_nf2.json'
df = pd.read_json(filename)

#Enter your mongo uri
mongo_uri = 'mongodb://localhost:27017/default'
client = pymongo.MongoClient(mongo_uri)

#Enter your database name
db_name = 'zoohack'
db = client[db_name]

#Enter your collection name
col_name = 'fauna'
col = db[col_name]

#Uncomment if you want to drop existing collection 
# col.drop()

ids = col.insert_many(list(data))
print(ids.inserted_ids)
# evaluate.py

import pandas as pd
from surprise import Dataset
from surprise import Reader
from surprise import SVD
from surprise.model_selection import train_test_split
from surprise import accuracy

df = pd.read_csv("ratings.csv")

reader = Reader(rating_scale=(0.5, 5))

data = Dataset.load_from_df(
    df[["userId", "movieId", "rating"]],
    reader
)

trainset, testset = train_test_split(
    data,
    test_size=0.2,
    random_state=42
)

model = SVD()

model.fit(trainset)

predictions = model.test(testset)

print(
    "RMSE:",
    accuracy.rmse(predictions)
)
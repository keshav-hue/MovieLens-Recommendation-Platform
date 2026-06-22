import pandas as pd
import joblib

from surprise import Dataset
from surprise import Reader
from surprise import SVD

print("Loading ratings...")

df = pd.read_csv("ratings.csv")

print(f"Ratings: {len(df)}")
print(f"Users: {df['userId'].nunique()}")
print(f"Movies: {df['movieId'].nunique()}")

reader = Reader(
    rating_scale=(0.5, 5.0)
)

data = Dataset.load_from_df(
    df[["userId", "movieId", "rating"]],
    reader
)

trainset = data.build_full_trainset()

print("Training SVD model...")

model = SVD(
    n_factors=100,
    n_epochs=20,
    lr_all=0.005,
    reg_all=0.02,
    random_state=42
)

model.fit(trainset)

joblib.dump(
    model,
    "model.pkl"
)

print("Model saved as model.pkl")
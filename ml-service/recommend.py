import pandas as pd
import joblib

model = joblib.load("model.pkl")

ratings = pd.read_csv("ratings.csv")
movies = pd.read_csv("movies.csv")

USER_ID = 1

rated_movies = set(
    ratings[ratings["userId"] == USER_ID]["movieId"]
)

all_movies = set(
    ratings["movieId"].unique()
)

unseen_movies = all_movies - rated_movies

predictions = []

for movie_id in unseen_movies:
    pred = model.predict(
        uid=USER_ID,
        iid=movie_id
    )

    predictions.append(
        (movie_id, pred.est)
    )

top_movies = sorted(
    predictions,
    key=lambda x: x[1],
    reverse=True
)[:10]

print("\nTop Recommendations:\n")

for movie_id, score in top_movies:

    movie = movies[
        movies["movieId"] == movie_id
    ]

    title = movie.iloc[0]["title"]

    print(
        f"{title} -> {score:.2f}"
    )
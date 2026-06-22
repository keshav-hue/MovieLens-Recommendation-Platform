from fastapi import FastAPI
import pandas as pd
import joblib
import subprocess

app = FastAPI()

model = None
ratings = None
movies = None
movie_counts = None


def load_data():
    global model
    global ratings
    global movies
    global movie_counts

    print("Loading model and datasets...")

    model = joblib.load("model.pkl")

    ratings = pd.read_csv("ratings.csv")
    movies = pd.read_csv("movies.csv")

    movie_counts = (
        ratings.groupby("movieId")
        .size()
        .to_dict()
    )

    print(
        f"Loaded {len(ratings)} ratings | "
        f"{ratings['userId'].nunique()} users | "
        f"{ratings['movieId'].nunique()} movies"
    )


load_data()


@app.post("/reload")
def reload_model():

    load_data()

    return {
        "success": True,
        "message": "Model reloaded successfully"
    }


@app.post("/retrain")
def retrain():

    try:

        print("Exporting ratings...")

        subprocess.run(
            ["python", "export_ratings.py"],
            check=True
        )

        print("Training model...")

        subprocess.run(
            ["python", "train.py"],
            check=True
        )

        print("Reloading model...")

        load_data()

        return {
            "success": True,
            "message": "Model retrained successfully"
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }


@app.get("/recommend/{user_id}")
def recommend(user_id: int):

    # Cold Start User
    if user_id not in ratings["userId"].unique():

        popular_movies = (
            ratings.groupby("movieId")
            .size()
            .reset_index(name="ratingCount")
            .sort_values(
                "ratingCount",
                ascending=False
            )
            .head(20)
        )

        result = []

        for _, row in popular_movies.iterrows():

            movie = movies[
                movies["movieId"] ==
                row["movieId"]
            ]

            if movie.empty:
                continue

            result.append({
                "movieId": int(row["movieId"]),
                "title": movie.iloc[0]["title"],
                "score": "Popular Movie"
            })

        return result

    rated_movies = set(
        ratings[
            ratings["userId"] == user_id
        ]["movieId"]
    )

    all_movies = set(
        movies["movieId"].unique()
    )

    unseen_movies = (
        all_movies - rated_movies
    )

    predictions = []

    for movie_id in unseen_movies:

        pred = model.predict(
            uid=user_id,
            iid=movie_id
        )

        popularity = movie_counts.get(
            movie_id,
            1
        )

        popularity_score = min(
            popularity / 500,
            1
        )

        final_score = (
            pred.est * 0.9 +
            popularity_score * 0.1
        )

        predictions.append({
            "movieId": movie_id,
            "mlScore": pred.est,
            "finalScore": final_score
        })

    top_movies = sorted(
        predictions,
        key=lambda x: x["finalScore"],
        reverse=True
    )[:20]

    result = []

    for item in top_movies:

        movie = movies[
            movies["movieId"] ==
            item["movieId"]
        ]

        if movie.empty:
            continue

        result.append({
            "movieId": int(item["movieId"]),
            "title": movie.iloc[0]["title"],
            "predictedRating": round(
                item["mlScore"],
                4
            ),
            "recommendationScore": round(
                item["finalScore"],
                4
            )
        })

    return result
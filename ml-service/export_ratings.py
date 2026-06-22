import pandas as pd
import psycopg2

DATABASE_URL = os.environ["DATABASE_URL"]

conn = psycopg2.connect(DATABASE_URL)

query = """
SELECT
    user_id AS "userId",
    movie_id AS "movieId",
    rating
FROM ratings
"""

df = pd.read_sql(query, conn)

df.to_csv(
    "ratings.csv",
    index=False
)

print(
    f"Exported {len(df)} ratings"
)

conn.close()
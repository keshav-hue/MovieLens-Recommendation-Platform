import pandas as pd
import psycopg2

conn = psycopg2.connect(
    host="postgres",          
    port="5432",
    database="MovieLens",
    user="postgres",
    password="postgres"
)

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
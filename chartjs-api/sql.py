


import pymysql
import os

db_user = ''
db_password = ''
db_host = ''
db_name = ''

# Connect to the database
connection = pymysql.connect(
    host=db_host,
    user=db_user,
    password=db_password,
    database=db_name,
    cursorclass=pymysql.cursors.DictCursor
)

# Path to the data filebackend
data_file_path = "/path/to/data.txt"

# Read data from the file
data = {}
try:
    with open(data_file_path, "r") as file:
        for line in file:
            key, value = line.strip().split("=")
            data[key] = value
finally:
    # Delete the file after reading
    if os.path.exists(data_file_path):
        os.remove(data_file_path)
        print(f"{data_file_path} has been deleted.")

# Extract variables from the data
total_return_text = data.get("total_return_text")
one_day_return_text = data.get("one_day_return_text")
date = data.get("timestamp")

# SQL query to find the most recent record
select_query = """
SELECT total_return_text, one_day_return_text
FROM records
ORDER BY date DESC
LIMIT 1
"""

# SQL query to insert new data
insert_query = """
INSERT INTO records (total_return_text, one_day_return_text, date)
VALUES (%s, %s, %s)
"""

try:
    with connection.cursor() as cursor:
        # Check for the most recent record
        cursor.execute(select_query)
        result = cursor.fetchone()

        # If the result is not empty, compare values
        if result:
            existing_total_return_text = result['total_return_text']
            existing_one_day_return_text = result['one_day_return_text']

            if (total_return_text == existing_total_return_text and
                one_day_return_text == existing_one_day_return_text):
                print("No new data to insert; values are the same as the most recent record.")
            else:
                # Insert new data
                cursor.execute(insert_query, (total_return_text, one_day_return_text, date))
                connection.commit()
                print("Record inserted successfully.")
        else:
            # Insert new data if no records exist
            cursor.execute(insert_query, (total_return_text, one_day_return_text, date))
            connection.commit()
            print("Record inserted successfully.")
except Exception as e:
    print(f"An error occurred: {e}")
    connection.rollback()
finally:
    # Close the connection
    connection.close()

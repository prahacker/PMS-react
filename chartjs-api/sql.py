import pymysql
import os
import jwt

# Database connection details
db_user = 'admin'
db_password = 'admin12345678'
db_host = 'testgroww.cxgwkco2aeaf.ap-south-1.rds.amazonaws.com'
db_name = 'admin'

# JWT secret to decode the token
jwt_secret = 'your_jwt_secret'

# Extract the username from the JWT token stored in a file or environment variable
def get_username_from_token(token):
    try:
        decoded_token = jwt.decode(token, jwt_secret, algorithms=["HS256"])
        return decoded_token.get('id')
    except jwt.ExpiredSignatureError:
        print("Token has expired")
    except jwt.InvalidTokenError:
        print("Invalid token")
    return None

# Function to read the token from a file (assumes the token is stored in a file called token.txt)
def read_token_from_file():
    token_file_path = "/Users/prakhartripathi/chartjs-api/token.txt"
    if os.path.exists(token_file_path):
        with open(token_file_path, "r") as file:
            return file.read().strip()
    return None

# Path to the data file
data_file_path = "/Users/prakhartripathi/chartjs-api/data.txt"

# Read data from the file
data = {}
try:
    with open(data_file_path, "r") as file:
        for line in file:
            key, value = line.strip().split("=")
            data[key] = value
finally:
    # Uncomment the following line to delete the file after reading
    if os.path.exists(data_file_path):
        os.remove(data_file_path)
        print(f"{data_file_path} has been deleted.")

# Extract variables from the data
total_return_text = data.get("total_return_text")
one_day_return_text = data.get("one_day_return_text")
nifty50 = data.get("nifty50_value")  # Corrected to use the correct key
sensex = data.get("sensex_value")    # Corrected to use the correct key
date = data.get("timestamp")

# Ensure nifty50 and sensex are not None
if not nifty50:
    nifty50 = 'N/A'
if not sensex:
    sensex = 'N/A'

# Get the username from the JWT token
token = read_token_from_file()
username = get_username_from_token(token)
print(f"Username: {username}")

if not username:
    print("Could not retrieve username from the token.")
    exit(1)

# Connect to the admin database
connection = pymysql.connect(
    host=db_host,
    user=db_user,
    password=db_password,
    database=db_name,  # Connect to the 'admin' database
    cursorclass=pymysql.cursors.DictCursor
)

# SQL query to find the most recent record in the user's table
select_query = f"""
SELECT total_return_text, one_day_return_text, nifty50, sensex
FROM `{username}`
ORDER BY date DESC
LIMIT 1
"""

# SQL query to insert new data into the user's table
insert_query = f"""
INSERT INTO `{username}` (total_return_text, one_day_return_text, nifty50, sensex, date)
VALUES (%s, %s, %s, %s, %s)
"""

print(f"Executing query: {select_query}")
try:
    with connection.cursor() as cursor:
        # Check for the most recent record
        cursor.execute(select_query)
        result = cursor.fetchone()

        # Print the result of the select query
        print(f"Select query result: {result}")

        # If the result is not empty, compare values
        if result:
            existing_total_return_text = result['total_return_text']
            existing_one_day_return_text = result['one_day_return_text']
            existing_nifty50 = result['nifty50']
            existing_sensex = result['sensex']

            if (total_return_text == existing_total_return_text and
                one_day_return_text == existing_one_day_return_text and
                nifty50 == existing_nifty50 and
                sensex == existing_sensex):
                print("No new data to insert; values are the same as the most recent record.")
            else:
                # Print the insert query with values
                print(f"Executing insert query: {insert_query} with values ({total_return_text}, {one_day_return_text}, {nifty50}, {sensex}, {date})")
                
                # Insert new data
                cursor.execute(insert_query, (total_return_text, one_day_return_text, nifty50, sensex, date))
                connection.commit()
                print("Record inserted successfully.")
        else:
            # Print the insert query with values
            print(f"Executing insert query: {insert_query} with values ({total_return_text}, {one_day_return_text}, {nifty50}, {sensex}, {date})")
            
            # Insert new data if no records exist
            cursor.execute(insert_query, (total_return_text, one_day_return_text, nifty50, sensex, date))
            connection.commit()
            print("Record inserted successfully.")
except Exception as e:
    print(f"An error occurred: {e}")
    connection.rollback()
finally:
    # Close the connection
    connection.close()

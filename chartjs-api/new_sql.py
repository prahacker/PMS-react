import pymysql
import os
import jwt
import subprocess

# Database connection details
db_user = ''
db_password = ''
db_host = ''
stocks_db_name = ''  # Connect to the 'stocks' database
admin_db_name = ''  # Connect to the 'admin' database

# JWT secret to decode the token
jwt_secret = 'your_jwt_secret'

# Function to extract the username from the JWT token stored in a file or environment variable
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
    token_file_path = "/chartjs-api/token.txt"
    if os.path.exists(token_file_path):
        with open(token_file_path, "r") as file:
            return file.read().strip()
    return None

# Path to the data file
data_file_path = "/chartjs-api/data.txt"

# Read data from the file
data = {}
stock_data = []

try:
    with open(data_file_path, "r") as file:
        for line in file:
            if "=" in line:  # Key-value pairs
                key, value = line.strip().split("=", 1)
                data[key] = value
            else:  # Stock data lines
                stock_data.append(line.strip())
finally:
    # Remove the file after reading
    if os.path.exists(data_file_path):
        os.remove(data_file_path)
        print(f"{data_file_path} has been deleted.")

# Extract variables from the data
total_return_text = data.get("total_return_text")
one_day_return_text = data.get("one_day_return_text")
nifty50 = data.get("nifty50_value")
sensex = data.get("sensex_value")
date = data.get("timestamp")

# Get the username from the JWT token
token = read_token_from_file()
username = get_username_from_token(token)
print(f"Username: {username}")

if not username:
    print("Could not retrieve username from the token.")
    exit(1)

# Connect to the stocks and admin databases
stocks_connection = pymysql.connect(
    host=db_host,
    user=db_user,
    password=db_password,
    database=stocks_db_name,
    cursorclass=pymysql.cursors.DictCursor
)

admin_connection = pymysql.connect(
    host=db_host,
    user=db_user,
    password=db_password,
    database=admin_db_name,
    cursorclass=pymysql.cursors.DictCursor
)

try:
    with stocks_connection.cursor() as cursor:
        # Check if stock exists and update if necessary
        check_stock_query = """
        SELECT * FROM list_of_stocks WHERE name = %s AND user = %s
        """
        
        update_stock_query = """
        UPDATE list_of_stocks SET avg = %s, no_shares = %s WHERE name = %s AND user = %s
        """
        
        insert_stock_query = """
        INSERT INTO list_of_stocks (name, avg, user, no_shares)
        VALUES (%s, %s, %s, %s)
        """

        for stock in stock_data:
            try:
                # Splitting the stock information appropriately
                stock_name, avg_and_shares = stock.split(": ")[0], stock.split(": ")[1]
                
                # Further split avg_and_shares
                avg_price = avg_and_shares.split(", ")[0].replace("Avg. ₹", "")
                no_shares = avg_and_shares.split(", ")[1].replace(" shares", "")

                # Check if the stock already exists for the user
                cursor.execute(check_stock_query, (stock_name, username))
                existing_stock = cursor.fetchone()

                if existing_stock:
                    # Compare and update if there are changes
                    if existing_stock['avg'] != avg_price or existing_stock['no_shares'] != no_shares:
                        print(f"Updating stock: {stock_name} for user: {username}")
                        cursor.execute(update_stock_query, (avg_price, no_shares, stock_name, username))
                else:
                    # Insert new stock if it doesn't exist
                    print(f"Inserting new stock: {stock_name} for user: {username}")
                    cursor.execute(insert_stock_query, (stock_name, avg_price, username, no_shares))

            except ValueError as ve:
                print(f"Skipping stock due to split error: {ve} - Line: {stock}")
            except Exception as e:
                print(f"Error processing stock: {e} - Line: {stock}")

        stocks_connection.commit()
        print("Stock records inserted or updated successfully.")

    with admin_connection.cursor() as cursor:
        # Create a table for the user if it doesn't exist
        create_user_table_query = f"""
        CREATE TABLE IF NOT EXISTS `{username}` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            total_return_text VARCHAR(255),
            one_day_return_text VARCHAR(255),
            nifty50 VARCHAR(50),
            sensex VARCHAR(50),
            date DATETIME
        )
        """
        cursor.execute(create_user_table_query)

        # Insert return data into the user's table
        insert_user_data_query = f"""
        INSERT INTO `{username}` (total_return_text, one_day_return_text, nifty50, sensex, date)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_user_data_query, (total_return_text, one_day_return_text, nifty50, sensex, date))

        admin_connection.commit()
        print(f"Data successfully inserted into the '{username}' table in the admin database.")


except Exception as e:
    print(f"An error occurred: {e}")
    stocks_connection.rollback()
    admin_connection.rollback()
finally:
    # Close the connections
    stocks_connection.close()
    admin_connection.close()

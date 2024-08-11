from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import subprocess
import undetected_chromedriver as uc

# Set up Chrome options
options = webdriver.ChromeOptions()

# Create a new instance of the Chrome driver
driver = uc.Chrome(options=options)
driver.get("https://www.groww.in")

# Wait for the prices to be present
print("Waiting for the price and percentage change to be present...")
price_element = WebDriverWait(driver, 30).until(
    EC.presence_of_element_located((By.XPATH, "//div[@class='seic76PricesDiv']//div[contains(@class, 'contentPrimary')]"))
)
percentage_element = WebDriverWait(driver, 30).until(
    EC.presence_of_element_located((By.XPATH, "//div[@class='seic76PricesDiv']//div[contains(@class, 'contentPositive')]"))
)
print("Price and percentage change are visible.")

# Extract the Nifty 50 price and percentage values
# Extract the Nifty 50 price and percentage values
nifty50_price = driver.find_element(By.XPATH, "(//div[@class='seic76PricesDiv']//div[contains(@class, 'contentPrimary')])[1]").text
nifty50_percentage = driver.find_element(By.XPATH, "(//div[@class='seic76PricesDiv']//div[contains(@class, 'contentPositive')])[1]").text.split(' ')[1]  # Extract just the percentage number

# Format the Nifty 50 value
nifty50_value = f"{nifty50_price}{nifty50_percentage}"
print(f"Nifty50 Value: {nifty50_value}")

# Extract the Sensex price and percentage values using the correct XPath
sensex_price = driver.find_element(By.XPATH, "(//a[@class='indicesCard']//div[contains(@class, 'seic76PricesDiv')]//div[contains(@class, 'contentPrimary')])[2]").text
sensex_percentage = driver.find_element(By.XPATH, "(//a[@class='indicesCard']//div[contains(@class, 'seic76PricesDiv')]//div[contains(@class, 'contentPositive')])[2]").text.split(' ')[1]  # Extract just the percentage number

# Format the Sensex value
sensex_value = f"{sensex_price}{sensex_percentage}"
print(f"Sensex Value: {sensex_value}")



# Now click on the "Investments" link
max_attempts = 30
attempt = 0
found_investments_link = False

while attempt < max_attempts:
    try:
        # Wait for the "Investments" link to be present
        print(f"Attempt {attempt + 1}: Waiting for the 'Investments' link to be present...")
        WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.LINK_TEXT, "Investments"))
        )
        print("Found the 'Investments' link.")
        
        # Locate and click the "Investments" button
        investments_button = driver.find_element(by=By.LINK_TEXT, value="Investments")
        investments_button.click()
        found_investments_link = True
        print("Clicked on 'Investments' button.")

        # Wait for 2 seconds after clicking
        time.sleep(2)
        break  # Exit loop if successful

    except Exception as e:
        print(f"Error: {e}")
        attempt += 1
        time.sleep(3)  # Wait for 3 seconds before retrying

if found_investments_link:
    # Wait for the investments page to load
    print("Waiting for the returns data to be present...")
    WebDriverWait(driver, 40).until(
        EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'stock-investments_stockInvLabel__ehYoT') and text()='Total Returns']/following-sibling::div"))
    )
    print("Returns data is visible.")

    # Extract return values
    total_return_element = driver.find_element(by=By.XPATH, value="//div[contains(@class, 'stock-investments_stockInvLabel__ehYoT') and text()='Total Returns']/following-sibling::div")
    one_day_return_element = driver.find_element(by=By.XPATH, value="//div[contains(@class, 'stock-investments_stockInvLabel__ehYoT') and text()='1D Returns']/following-sibling::div")

    total_return_text = total_return_element.text
    one_day_return_text = one_day_return_element.text

    # Get the current timestamp
    date = time.strftime('%Y-%m-%d ')

    # Save the data to a file for sql.py
    with open("/Users/prakhartripathi/chartjs-api/data.txt", "w") as file:
        file.write(f"total_return_text={total_return_text}\n")
        file.write(f"one_day_return_text={one_day_return_text}\n")
        file.write(f"nifty50_value={nifty50_value}\n")
        file.write(f"sensex_value={sensex_value}\n")
        file.write(f"timestamp={date}\n")
        
    print("Data saved to data.txt. Executing sql.py...")

    # Execute sql.py
    subprocess.run(["python", "/Users/prakhartripathi/chartjs-api/sql.py"])

else:
    print("The 'Investments' link was not found after 20 attempts.")

# Close the browser
driver.quit()
print("Browser closed.")

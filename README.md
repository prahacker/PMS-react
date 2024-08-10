# Financial Dashboard Application

This application is a financial dashboard that allows users to view charts, sign up, log in, and manage their profile. The backend is built using Node.js and Express, while the frontend is built using React. The application also includes MySQL database integration for storing user data and financial records, as well as Selenium for automated browser interactions.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [Clone the Repository](#clone-the-repository)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database Setup](#database-setup)
    - [Create MySQL Databases and Tables](#create-mysql-databases-and-tables)
    - [Set Up the MySQL Endpoint](#set-up-the-mysql-endpoint)
  - [Selenium Setup](#selenium-setup)
- [Running the Application](#running-the-application)
- [Usage](#usage)
  - [Sign Up](#sign-up)
  - [Log In](#log-in)
  - [View Financial Charts](#view-financial-charts)
  - [Manage Profile](#manage-profile)
  - [Run Driver Script](#run-driver-script)
  - [FullScreenGraph Component](#fullscreengraph-component)
- [Driver and SQL Script Explanation](#driver-and-sql-script-explanation)
  - [driver.py](#driverpy)
  - [sql.py](#sqlpy)
  - [Integration with the Dashboard](#integration-with-the-dashboard)
  - [Example Workflow](#example-workflow)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication (Sign Up, Log In)
- Viewing financial charts (One Day Returns, Sensex, Nifty 50)
- Profile management (view profile, delete account)
- Run custom scripts from the dashboard
- Selenium for automated browser interactions

## Prerequisites

- Node.js (v14.x or later)
- MySQL (v8.x or later)
- Python (v3.x)
- Selenium (v4.x or later)
- ChromeDriver (compatible with your Chrome browser version)
- Git (for cloning the repository)

## Setup

### Clone the Repository

```bash
git clone https://github.com/yourusername/financial-dashboard.git
cd financial-dashboard
```

### Backend Setup

Navigate to the `chartjs-api` directory:

```bash
cd chartjs-api
```

Install the required Node.js dependencies:

```bash
npm install
```

Create an `.env` file in the `chartjs-api` directory to store environment variables. Here's an example:

```plaintext
PORT=3001
JWT_SECRET=your_jwt_secret
DB_HOST=testgroww.cxgwkco2aeaf.ap-south-1.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=admin12345678
DB_USERS_DATABASE=users
DB_ADMIN_DATABASE=admin
```

### Frontend Setup

Navigate to the `react-script-trigger` directory:

```bash
cd ../react-script-trigger
```

Install the required Node.js dependencies:

```bash
npm install
```

### Database Setup

#### Create MySQL Databases and Tables

Create the `users` database:

```sql
CREATE DATABASE users;
USE users;

CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

Create the `admin` database:

```sql
CREATE DATABASE admin;
USE admin;

CREATE TABLE records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  total_return_text VARCHAR(255) NOT NULL,
  one_day_return_text VARCHAR(255) NOT NULL,
  nifty50 VARCHAR(255) NOT NULL,
  sensex VARCHAR(255) NOT NULL,
  date DATETIME NOT NULL
);
```

#### Set Up the MySQL Endpoint

Modify the connection settings in the `server.js` file located in the `chartjs-api` directory:

```javascript
const usersDb = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_USERS_DATABASE
});

const adminDb = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_ADMIN_DATABASE
});
```

Replace the `process.env.DB_*` variables with the actual values if not using an `.env` file.

### Selenium Setup

#### Install Python Dependencies

Ensure you have Python 3.x installed.

Install the necessary Python dependencies:

```bash
pip install selenium
```

#### Install ChromeDriver

Download the appropriate version of ChromeDriver that matches your Chrome browser version from the ChromeDriver downloads page.

Ensure ChromeDriver is in your system's PATH, or specify the path to ChromeDriver in your Selenium script.

## Running the Application

### Backend

Start the backend server:

```bash
cd chartjs-api
node server.js
```
<img width="862" alt="Screenshot 2024-08-10 at 7 45 07 PM" src="https://github.com/user-attachments/assets/fa557987-9d05-4c4f-8d8b-9bbfb9dc902d">


The server will start on port 3001.

### Frontend

Start the React development server:

```bash
cd ../react-script-trigger
npm start
```
<img width="965" alt="Screenshot 2024-08-10 at 7 45 47 PM" src="https://github.com/user-attachments/assets/b80cc4f6-2b17-4a2d-b784-6cb2e7561370">

The frontend will start on port 3000.

## Usage

### Sign Up

- Open the app in your browser: `http://localhost:3000`.
- Click on the "Sign Up" button and fill in the required fields (Name, Email, Username, Password).
- Submit the form to create a new account.
<img width="1920" alt="Screenshot 2024-08-10 at 4 03 42 PM" src="https://github.com/user-attachments/assets/bcbbb794-aa9f-4887-8c3a-e8c79faa7a9f">

### Log In

- On the login page, enter your username/email and password.
- Click "Login" to access the dashboard.
<img width="1920" alt="Screenshot 2024-08-10 at 4 03 32 PM" src="https://github.com/user-attachments/assets/f5821de6-07f6-4e8c-84d5-df9b0d69c466">

### View Financial Charts

- After logging in, you will see different charts (One Day Returns, Sensex, Nifty 50).
- Click on any chart to view it in full screen.
- <img width="1917" alt="Screenshot 2024-08-10 at 4 04 07 PM" src="https://github.com/user-attachments/assets/bc656658-a95f-465d-8903-743b897a2c84">
<img width="1920" alt="Screenshot 2024-08-10 at 4 04 16 PM" src="https://github.com/user-attachments/assets/eaebe22a-81d6-49a0-847a-d23ca6bcb46f">


### Manage Profile

- Click on the user icon in the top-right corner and select "Profile".
- You can view your profile information and delete your account.
  <img width="1917" alt="Screenshot 2024-08-10 at 4 04 47 PM" src="https://github.com/user-attachments/assets/04b5050b-276d-4ad1-b5ab-bda865039fe8">


### Run Driver Script

- In the dashboard, click the "Run Driver Script" button to trigger the custom script.

## FullScreenGraph Component

The `FullScreenGraph.js` component is responsible for displaying detailed views of various financial charts such as One Day Returns, Sensex, and Nifty 50. It provides an immersive full-screen experience for users who want to closely analyze their financial data.

### Key Features

- **Dynamic Chart Display:** The chart type is dynamically determined based on the route parameter, allowing the same component to display different financial charts.
- **Interactive Data Points:** Users can interact with data points on the chart, particularly on the One Day Returns chart, to get more detailed comparisons between data points.
- **Responsive Design:** The chart automatically adjusts to fit the screen size, ensuring an optimal viewing experience on all devices.

### How It Works

- **Fetching Data:** The component fetches chart data from the backend API using an authorization token stored in `localStorage`. This ensures that only authenticated users can access the data.
  
- **Rendering Charts:** Based on the `chartType` parameter in the URL, the component formats the fetched data to render the appropriate chart (e.g., One Day Returns, Sensex, Nifty 50). It uses the `react-chartjs-2` library to display the charts.

- **Data Interaction:** For the One Day Returns chart, users can click on data points to view a detailed comparison between the selected point and the previous one, including changes in Sensex and portfolio returns.

- **Navigation:** The component provides a "Back" button that allows users to return back to home page.

<img width="1919" alt="Screenshot 2024-08-10 at 4 04 30 PM" src="https://github.com/user-attachments/assets/fc8beaf1-c243-4055-bd1d-e6898e67aa23">

 
## Driver and SQL Script Explanation

The application includes two Python scripts, `driver.py` and `sql.py`, which are designed to interact with the backend database and automate certain tasks.

### driver.py

`driver.py` is a Python script designed to automate the collection or processing of financial data using Selenium. This script might be used to scrape data from financial websites, process it, and then insert or update records in the MySQL database.

<img width="930" alt="Screenshot 2024-08-10 at 7 46 37 PM" src="https://github.com/user-attachments/assets/39b4e995-03f2-4c80-9f18-1b57b42714b5">

**Key Components:**

- **Selenium WebDriver:** The script uses Selenium WebDriver to automate web interactions, such as navigating to web pages, filling out forms, or scraping data.
- **Data Processing:** The script processes the scraped data to prepare it for insertion into the database.
- **MySQL Integration:** The script may connect to the MySQL database and insert or update records based on the data it has processed.

**How to Run:**

1. Ensure you have installed the required Python dependencies as outlined in the Selenium Setup section.
2. Ensure that ChromeDriver is correctly installed and configured.
3. To test run the script using Python:

    ```bash
    python driver.py
    ```

### sql.py

`sql.py` is a Python script that directly interacts with the MySQL database. It could be used for tasks such as:

- Inserting new financial data into the database.
- Updating existing records.
- Running complex SQL queries and processing the results.

**Key Components:**

- **MySQL Connector:** The script uses MySQL connectors like `mysql-connector-python` or `PyMySQL` to establish a connection with the MySQL database.
- **SQL Queries:** The script contains SQL queries to insert, update, or retrieve data from the database.
- **Data Processing:** After retrieving data, the script processes it as needed (e.g., calculating returns, formatting results).

**How to Run:**

1. Ensure you have installed the required Python dependencies:

    ```bash
    pip install mysql-connector-python
    ```

2. Configure the MySQL connection details (host, user, password, database) within the script, if necessary.
3. To test run the script using Python:

    ```bash
    python sql.py
    ```

### Integration with the Dashboard

- The **Run Driver Script** button in the dashboard triggers the `driver.py` script via a backend API call. The backend listens for this request and executes the script, updating the database with the latest data.
- The data manipulated by `driver.py` and `sql.py` is reflected in the financial charts displayed on the dashboard.

### Example Workflow

1. `driver.py` scrapes the latest financial data from a website.
2. It processes the data and uses SQL queries to update the `admin` database.
3. When a user views the financial charts on the dashboard, the data displayed reflects the most recent updates made by `driver.py`.

## Environment Variables

Create an `.env` file in the `chartjs-api` directory with the following variables:

- `PORT`: The port on which the backend server runs (default: 3001).
- `JWT_SECRET`: The secret key used for JWT authentication.
- `DB_HOST`: MySQL database host.
- `DB_USER`: MySQL database user.
- `DB_PASSWORD`: MySQL database password.
- `DB_USERS_DATABASE`: Name of the users database.
- `DB_ADMIN_DATABASE`: Name of the admin database.

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request with your changes.


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
npm start
```

The server will start on port 3001.

### Frontend

Start the React development server:

```bash
cd ../react-script-trigger
npm start
```

The frontend will start on port 3000.

## Usage

### Sign Up

- Open the app in your browser: `http://localhost:3000`.
- Click on the "Sign Up" button and fill in the required fields (Name, Email, Username, Password).
- Submit the form to create a new account.

### Log In

- On the login page, enter your username/email and password.
- Click "Login" to access the dashboard.

### View Financial Charts

- After logging in, you will see different charts (One Day Returns, Sensex, Nifty 50).
- Click on any chart to view it in full screen.

### Manage Profile

- Click on the user icon in the top-right corner and select "Profile".
- You can view your profile information and delete your account.

### Run Driver Script

- In the dashboard, click the "Run Driver Script" button to trigger the custom script.

## Driver and SQL Script Explanation

The application includes two Python scripts, `driver.py` and `sql.py`, which are designed to interact with the backend database and automate certain tasks.

### driver.py

`driver.py` is a Python script designed to automate the collection or processing of financial data using Selenium. This script might be used to scrape data from financial websites, process it, and then insert or update records in the MySQL database.

**Key Components:**

- **Selenium WebDriver:** The script uses Selenium WebDriver to automate web interactions, such as navigating to web pages, filling out forms, or scraping data.
- **Data Processing:** The script processes the scraped data to prepare it for insertion into the database.
- **MySQL Integration:** The script may connect to the MySQL database and insert or update records based on the data it has processed.

**How to Run:**

1. Ensure you have installed the required Python dependencies as outlined in the Selenium Setup section.
2. Ensure that ChromeDriver is correctly installed and configured.
3. Run the script using Python:

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
3. Run the script using Python:

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


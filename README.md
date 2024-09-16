# Tableau Embedded Viz App

This project demonstrates how to embed a Tableau visualization (viz) into a webpage using the Tableau JavaScript API and a Node.js backend for JWT token generation. The viz is dynamically loaded based on URL parameters and uses JWT for authentication.

## Features

- Dynamically load Tableau visualization based on `pod`, `site`, `workbook`, and `view` parameters from the URL.
- Secure JWT authentication to Tableau via a Node.js backend.
- Responsive design for centering the Tableau viz both horizontally and vertically.
- Uses the Tableau JavaScript API with a dynamic pod URL.

## Prerequisites

- Node.js installed on your machine.
- Tableau Connected Apps configured to obtain `clientId`, `secretId`, `secretValue`, and `userId` for JWT generation.

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/tableau-embed.git
cd tableau-embed
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create a .env File
Create a .env file in the root directory and populate it with your Tableau Connected Apps credentials:

```bash
clientId = "your_client_id"
secretId = "your_secret_id"
secretValue = "your_secret_value"
scope = "tableau:views:embed"
userId = "user@company.com"
```

### 4. Run the Application

Start the Node.js server by running:

```bash
node index.js
```

This will start the server on http://localhost:3000.

### 5. Access the Application
You can access the application in the browser by navigating to:

http://localhost:3000/index.html?pod=dub01&site=mySite&workbook=myWorkbook&view=MyView

Replace the URL parameters (pod, site, workbook, and view) as needed for your Tableau environment. 

Alternatively, all these values can be hard-coded in app.js, so you can load run the app without passing parameters (http://localhost:3000/index.html)



# RENTit

Welcome to RENTit!! This project is a clone of the popular Airbnb platform, built to demonstrate my skills in web development. Below, you'll find information on how to set up and run the project on your local system.

TO ACCESS THE WEBSITE CLICK ON - https://rentit-90is.onrender.com/

## Prerequisites

Ensure you have the following installed on your local system:

- **Node.js**: [Download and install Node.js](https://nodejs.org/en/download/package-manager/current)
- **MongoDB**: [Download and install MongoDB](https://www.mongodb.com/try/download/community)


## Installation

Follow these steps to set up the project locally:

1. **Clone the repository:**
   ```bash
   https://github.com/vedprakash226/RENTit.git

2. **Navigate to the Project Directory**
    ```bash
   cd ./RENTit

3. **Install all the npm packages and its dependencies**
    ```bash
    npm install


## Running the Project

1. **Initialize the database:**
   Navigate to the `init` folder and run the `index.js` file to set up the database.
   ```bash
   cd init
   node index.js

2. **Start the server**
   Go back to the root directory and start server.
   ```bash
   cd ..
   node app.js

  Alternatively, you can use nodemon to automatically restart the server when changes are detected:
  ```bash
  nodemon app.js

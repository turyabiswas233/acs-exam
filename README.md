 
## 1. Setup frontend with Yarn:
 *    - Navigate to the frontend directory.
 *    - Run `yarn install` to install all dependencies.
 *    - Use `yarn start` to start the development server.
 *
## 2. Setup backend with npm:
 *    - Navigate to the backend directory.
 *    - Run `npm install` to install all dependencies.
 *    - Use `npm run dev` to start the backend server.
 *
## 3. Copy and paste environment configuration:
 *    - Locate the environment configuration files provided (e.g., `.env` files).
 *    - Copy the content of these files.
 *    - Paste the copied content into the respective environment configuration files in your project.

## Or you can paste the line into `.env` file

`Path`: `frontend/.env.local`
 ```
 APP_URL=http://localhost:3000/
 ```
 `Path`: `backend/.env.local`
 ```
 APP_URL=http://localhost:3000/
 ```
 

## NB:-

 * If you find error like `'yarn' not found` then try this & continue:
 ```
 npm i -g yarn
 ```
 * If you find error like `'nodemon' not found` then try this & continue:
 ```
 npm i -g nodemon
 ```
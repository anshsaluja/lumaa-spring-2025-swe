### Task Management Application Setup Guide

#### 1. Setting Up the Database
- Ensure PostgreSQL is installed on your system.
- Create a new PostgreSQL database:
  sql
  CREATE DATABASE task_management;
  
- Set up environment variables:
  
  DATABASE_URL=postgresql://username:password@localhost:5432/task_management
  
- Run database migrations:
  sh
  npm run migrate
  

#### 2. Running the Backend
- Navigate to the backend directory:
  sh
  cd backend
  
- Install dependencies:
  sh
  npm install
  
- Start the server on port 3001:
sh
  npm run start
  

#### 3. Running the Frontend
- Navigate to the frontend directory:
  sh
  cd frontend
  
- Install dependencies:
  sh
  npm install
  
- Start the frontend application on port 3000:
  sh
  npm run dev
  

#### 4. Testing
- To run backend tests:
  sh
  npm run test
  
- To run frontend tests:
  sh
  npm run test
  
- Ensure unit and integration tests are included for key features.

#### 5. Salary Expectations
- Expected salary per month (Mandatory):2560-2800$




#### 6. Video Link 
- https://www.loom.com/share/02eb20146a82440ebafe6900e6d68d4c

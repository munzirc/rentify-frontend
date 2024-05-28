# Frontend for Rentify

This is the frontend for Rentify, a property rental platform. The frontend is built with React and communicates with the backend service to provide a seamless user experience.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
- [Technologies Used](#technologies-used)

## Features

- User authentication and registration
- Property listing management for sellers
- Search functionality for properties
- Responsive design for various devices

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/munzirc/rentify-frontend.git
    cd rentify-frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

## Configuration

Create a `.env` file in the root directory and add the following environment variables:

```plaintext
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_BASE_URL=http://localhost:3000
Adjust the VITE_BASE_URL to point to your backend server if it's different in production.

Running the Application
Start the development server:

npm run dev
The application will run on http://localhost:5173.

Folder Structure
plaintext
Copy code
src/
├── context/            # globlal states, context api
├── public/             # Images, icons, and other static assets
├── components/         # Reusable React components
├── pages/              # Page components for different routes
├── App.jsx             # Main application component
├── main.jsx            # Entry point for the React application
└── ...                 # Other files and configurations
Available Scripts
In the project directory, you can run:

npm run dev
Runs the app in development mode. Open http://localhost:5173 to view it in your browser.

npm run build
Builds the app for production to the dist folder. It correctly bundles React in production mode and optimizes the build for the best performance.

npm run preview
Preview the production build locally.

npm run lint
Lints the project for code quality.

Technologies Used

React
Vite for fast build and development
Tailwind CSS for styling
React Router for routing
dotenv for environment variables
# Pantry Tracker

## Overview

Pantry Tracker is a web application designed to help users manage their pantry items and get recipe suggestions based on the ingredients they have. The app includes features such as user authentication, pantry management, and recipe generation.

## Features

- **User Authentication**: Sign up, log in, and manage user accounts.
- **Pantry Management**: Add, update, and delete pantry items.
- **Recipe Suggestions**: Fetch recipes based on the items in your pantry.
- **Responsive Design**: Accessible from any device.

## Coding Process

1. **Initial Setup:**
   - I started by creating a new Next.js project and installed necessary dependencies such as Material-UI for UI components and Firebase for backend services.
   - Set up the project structure by creating folders for pages, components, and API routes.

2. **Implementing Features:**
   - Developed the authentication flow (sign up, log in, forgot password) using Firebase Authentication.
   - Created the pantry management functionality, allowing users to add, update, and delete pantry items.
   - Integrated the Gemini API for recipe generation based on pantry items.

3. **User Interface:**
   - Designed a responsive UI using Material-UI components and styled the application to improve aesthetics and usability.
   - Ensured that all pages are easy to navigate and understand.

## Challenges Faced

1. **Environment Variables:**
   - **Problem**: Struggled to manage API keys securely and prevent them from being exposed in the repository.
   - **Solution**: Created a `.env` file for local development and added `.env` to the `.gitignore` file to prevent it from being pushed to GitHub. Used an `.env.example` file as a template for others to follow.

2. **Deployment Issues:**
   - **Problem**: Encountered errors while deploying to Vercel, particularly with ESLint rules and unescaped entities in JSX.
   - **Solution**: Fixed the ESLint issues by ensuring all JSX strings were properly escaped. Adjusted my code according to ESLint warnings, allowing for successful deployment.

3. **API Integration:**
   - **Problem**: Faced challenges in handling API responses and managing the state in React components.
   - **Solution**: Utilized Axios for API requests and properly structured the response handling logic. Implemented error handling to manage failed requests gracefully.

## Contributing

1. **Fork the Repository:**

   - Click the "Fork" button at the top right of the repository page on GitHub.

2. **Create a Branch:**

   ```bash
   git checkout -b feature/your-feature
   ```

3. **Commit Changes:**

   ```bash
   git add .
   git commit -m "Add a new feature"
   ```

4. **Push to GitHub:**

   ```bash
   git push origin feature/your-feature
   ```

5. **Create a Pull Request:**

   - Go to your repository on GitHub.
   - Click on "Compare & pull request" to create a pull request with your changes.

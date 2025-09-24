==============================
FILENAME: README.md
==============================

# SDG Explorer & Learning Games

An interactive and gamified web application designed to educate users about the United Nations' Sustainable Development Goals (SDGs). This project is built with a modern React-based stack, featuring a clean, responsive interface and a serverless backend powered by Firebase.


## Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Gamification & Games](#gamification--games)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Firebase Setup](#firebase-setup)
  - [Local Installation](#local-installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## About The Project

The SDG Explorer & Learning Games platform is an educational tool designed to increase awareness and understanding of the 17 Sustainable Development Goals. It moves beyond static information displays by incorporating interactive elements. Users can browse detailed information about each goal or dive into a "Games" section to test their knowledge, earn points, and compete on a leaderboard.

The primary goal is to transform passive learning into an active and engaging experience using a fast, modern, and scalable tech stack.

---

## Features

-   **Visual SDG Explorer:** A fully responsive grid of cards built with React and styled with Tailwind CSS.
-   **Interactive Games:** A dedicated section with quizzes and challenges to reinforce learning.
-   **Real-time Leaderboard:** User scores are updated in real-time on a global leaderboard using Firestore.
-   **Secure Authentication:** User sign-up and login managed securely through Firebase Authentication.
-   **Lightweight State Management:** Clean and efficient state handling with Zustand.
-   **Smooth Animations:** Fluid transitions and feedback powered by Framer Motion.

---

## Gamification & Games

The core of user engagement revolves around gamification to make learning enjoyable.


## Tech Stack

This project is built with a modern, serverless architecture focusing on performance and developer experience.

**Frontend:**
-   **React.js:** Core UI library for building a component-based application.
-   **Tailwind CSS:** A utility-first CSS framework for rapid and custom styling.
-   **Zustand:** A minimal, fast, and scalable state management solution.
-   **React Router:** For client-side routing and navigation.
-   **Framer Motion:** For declarative animations and gestures.
-   **React Query (TanStack Query):** For fetching, caching, and updating data from Firebase.

**Backend & Database (Serverless):**
-   **Firebase:** The core backend platform providing:
    -   **Firestore:** A NoSQL cloud database for real-time data syncing (leaderboards, user profiles, game state).
    -   **Firebase Authentication:** For handling user sign-up, login, and session management.
    -   **Firebase Hosting:** For deploying and hosting the React application.
    -   **Firebase Functions (Optional):** For running server-side logic if needed.

**Design & Prototyping:**
-   **Figma:** Used for the initial UI/UX design and component mockups.

---

## Getting Started

To get a local copy of the full application up and running, follow these steps.

### Prerequisites

-   Node.js and npm  installed.
-   A Google account to create a Firebase project.

### Firebase Setup

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  In your new project, go to **Project Settings** > **General**. Under "Your apps", click the web icon (`</>`) to add a new web app.
3.  Copy the `firebaseConfig` object provided. You will need this for your local setup.
4.  In the console, go to the **Authentication** section and enable the "Email/Password" sign-in method.
5.  Go to the **Firestore Database** section and create a database. Start in **test mode** for easy local development.

### Local Installation

1.  **Clone the repository**
    ```sh
    git clone [https://github.com/your-username/sdg-explorer-games.git](https://github.com/your-username/sdg-explorer-games.git)
    ```
2.  **Navigate to the project directory**
    ```sh
    cd sdg-explorer-games
    ```
3.  **Install Dependencies**
    ```sh
    npm install
    ```
4.  **Set up Environment Variables**
    -   Create a `.env` file in the root of the project.
    -   Add the Firebase config keys you copied earlier, prefixed with `REACT_APP_`.
        ```
        REACT_APP_FIREBASE_API_KEY="your-api-key"
        REACT_APP_FIREBASE_AUTH_DOMAIN="your-auth-domain"
        REACT_APP_FIREBASE_PROJECT_ID="your-project-id"
        REACT_APP_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
        REACT_APP_FIREBASE_APP_ID="your-app-id"
        ```

5.  **Run the Application**
    ```sh
    npm start
    ```

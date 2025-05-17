# Constitution App

A React application for a constitution-based system.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development.

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installing

1. Clone the repository
2. Install dependencies

```
cd constitution-app
npm install
```

### Firebase Setup

This application uses Firebase for authentication and data storage. Follow these steps to set up Firebase:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add a web application to your Firebase project
4. Enable Authentication (Email/Password provider)
5. Create a Firestore database
6. Get your Firebase configuration and update the `src/firebase/config.ts` file:

```ts
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Running the application

```
npm start
```

The application will start at http://localhost:3000

## Database Structure

The application uses Firestore with the following collections:

### Users Collection
Stores user information with documents using the user's UID as the document ID.
Fields:
- `email`: string
- `displayName`: string
- `uid`: string

### Login Activity Collection
Tracks user login activity with documents named `{userId}_{timestamp}`.
Fields:
- `userId`: string
- `email`: string
- `timestamp`: timestamp
- `action`: string ('login')

## Features

- User authentication (login/signup)
- Firestore database integration
- Responsive design with animations

## Built With

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase](https://firebase.google.com/)
- [React Router](https://reactrouter.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

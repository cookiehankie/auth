Firebase Authentication
=============================

The Firebase Auth quickstart demonstrates several methods for signing in:

 - The Firebase phone number authentication demonstrates using Firebase phone number authentication with a [visible ReCaptcha](phone/phone-visible.html).
 - The Firebase Google Sign in demonstrate using a Google account to authenticate to Firebase with a [popup](google/google-popup.html).


Introduction
------------

[Read more about Firebase Auth](https://firebase.google.com/docs/auth/)

## Workflow

Phone Number Authentication

![Authentication](https://github.com/cookiehankie/firebase-auth-web/assets/106795225/89c6defc-4787-41ce-a6a0-dfe5ac8ba96b)

Identity Provider Authentication - Google

![google-auth](https://github.com/cookiehankie/auth/assets/106795225/60423d69-7d1e-42f4-9d0c-50a9f9943831)

Getting Started
---------------

 1. Create a Firebase project on the [Firebase Console](https://console.firebase.google.com). Copy your Firebase config object (from the "Add Firebase to your web app" dialog), and paste it in the `firebase/config.js` file.
 
    [Firebase Console > Project Settings > General > Web app > 
    SDK setup and configuration]


 2. You must have the [Firebase CLI](https://firebase.google.com/docs/cli/) installed. If you don't have it install it with `npm install -g firebase-tools` and then configure it with `firebase login`.
 3. On the command line, `cd` into the `auth` subdirectory.
 4. Run `firebase use --add` and select your Firebase project.

To run the sample app locally during development:
 1. Run `npm install` to install dependencies.
 2. Run `firebase emulators:start` to start the local Firebase emulators. Note: phone authentication required ReCaptcha verification which does not work with the Firebase emulators. These examples skip connecting to the emulators.
 3. Run `npm run dev` to serve the app locally using Vite
   This will start a server locally that serves `index.html` on `http://localhost:5173/index.html`. 


Running the app using the Firebase CLI:
 1. Run `npm install` to install dependencies.
 2. Run `npm run build` to build the app using Vite.
 3. Run `firebase emulators:start` to start the local Firebase emulators. Note: phone authentication required ReCaptcha verification which does not work with the Firebase emulators. These examples skip connecting to the emulators.
 4. In your terminal output, you will see the "Hosting" URL. By default, it will be `127.0.0.1:5002`, though it may be different for you.
 5. Navigate in your browser to the URL output by the `firebase emulators:start` command.


Support
-------

https://firebase.google.com/support/


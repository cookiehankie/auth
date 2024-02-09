import {
  GoogleAuthProvider,
  connectAuthEmulator,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase/config';


if (window.location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
}

const signInButton = document.getElementById('quickstart-sign-in');
const oauthToken = document.getElementById('quickstart-oauthtoken');
const signInStatus = document.getElementById('quickstart-sign-in-status');
const accountDetails = document.getElementById('quickstart-account-details');

// Modify the signOut logic to include a page refresh
function signOutAndRefresh() {
  signOut(auth).then(() => {
    console.log('User has been signed out.');
    // Refresh the page after sign out
    window.location.reload();
  }).catch((error) => {
    console.error('Error signing out:', error);
  });
}

function toggleSignIn() {
  if (!auth.currentUser) {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    signInWithPopup(auth, provider)
      .then(function (result) {
        if (!result) return;
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential && credential.accessToken; // Access token can be used to access the Google API.
        const user = result.user;
        oauthToken.textContent = token || '';
      })
      .catch(function (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert('You have already signed up with a different auth provider for that email.');
        } else {
          console.error(error);
        }
      });
  } else {
    signOut(auth);
  }
  signInButton.disabled = true;
}

onAuthStateChanged(auth, function (user) {
  if (user) {
    signInStatus.textContent = 'Signed in';
    signInButton.textContent = 'Sign out';
    accountDetails.textContent = JSON.stringify(user, null, '  ');
  } else {
    signInStatus.textContent = 'Signed out';
    signInButton.textContent = 'Sign in with Google';
    accountDetails.textContent = 'null';
    oauthToken.textContent = 'null';
  }
  signInButton.disabled = false;
});

// Event listener for sign-in/sign-out button
signInButton.addEventListener('click', function () {
  if (auth.currentUser) {
    signOutAndRefresh(); // This will sign out the user and refresh the page
  } else {
    toggleSignIn(); // This will sign in the user
  }
}, false);

// Initialize a variable to keep track of the timeout
// Select the timer container element
const autoLogoutTimerContainer = document.getElementById('auto-logout-timer-container');
const autoLogoutTimer = document.getElementById('auto-logout-timer');

// Initialize a variable to keep track of the timeout and interval
let autoSignOutTimer;
let autoSignOutInterval;
const signOutTime = 10 * 60 * 1000; //  in milliseconds


// Function to handle auto-logout after a period of inactivity
function startAutoSignOutTimer() {
  // Clear any existing timers
  clearTimeout(autoSignOutTimer);
  clearInterval(autoSignOutInterval);

  let timeLeft = signOutTime / 1000; // Convert to seconds

  // Update the timer display every second
  autoSignOutInterval = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    autoLogoutTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timeLeft -= 1;
    if (timeLeft < 0) {
      clearInterval(autoSignOutInterval);
    }
  }, 1000);

  // Set the timeout to sign out the user
  autoSignOutTimer = setTimeout(() => {
    signOutAndRefresh();
  }, signOutTime);
}

// Function to reset the auto-logout timer when there's user activity
function resetAutoSignOutTimer() {
  startAutoSignOutTimer();
}

// Attach event listeners to reset the timer on user actions
window.onload = startAutoSignOutTimer; // Start the timer when the window loads
document.onmousemove = resetAutoSignOutTimer; // Reset the timer on mouse movement
document.onkeypress = resetAutoSignOutTimer; // Reset the timer on keypress

// Update the onAuthStateChanged listener
onAuthStateChanged(auth, function (user) {
  if (user) {
    // User is signed in
    signInStatus.textContent = 'Signed in';
    signInButton.textContent = 'Sign out';
    accountDetails.textContent = JSON.stringify(user, null, '  ');
    autoLogoutTimerContainer.style.display = 'block'; // Show the timer container
    startAutoSignOutTimer(); // Start the timer
  } else {
    // User is signed out
    signInStatus.textContent = 'Signed out';
    signInButton.textContent = 'Sign in with Google';
    accountDetails.textContent = 'null';
    oauthToken.textContent = 'null';
    autoLogoutTimerContainer.style.display = 'none'; // Hide the timer container
    clearTimeout(autoSignOutTimer); // Clear the sign-out timer
    clearInterval(autoSignOutInterval); // Clear the interval for the timer
  }
  signInButton.disabled = false;
});

// Event listener for sign-in/sign-out button
signInButton.addEventListener('click', toggleSignIn, false);

// Attach event listeners to reset the timer on user actions
window.onload = resetAutoSignOutTimer;
document.onmousemove = resetAutoSignOutTimer;
document.onkeypress = resetAutoSignOutTimer;


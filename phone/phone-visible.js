import {
  onAuthStateChanged,
  signInWithPhoneNumber,
  signOut,
  RecaptchaVerifier
} from 'firebase/auth';
import { auth } from '../firebase/config';


const phoneNumberInput = document.getElementById('phone-number');
const signInButton = document.getElementById('sign-in-button');
const signInForm = document.getElementById('sign-in-form');
const signOutButton = document.getElementById('sign-out-button');
const verificationCodeForm = document.getElementById('verification-code-form');
const verificationCodeInput = document.getElementById('verification-code');
const verifyCodeButton = document.getElementById('verify-code-button');
const signInStatus = document.getElementById('sign-in-status');
const accountDetails = document.getElementById('account-details');
const cancelVerifyCodeButton = document.getElementById('cancel-verify-code-button');

function onSignInSubmit() {
  if (isPhoneNumberValid()) {
    window.signingIn = true;
    updateSignInButtonUI();
    const phoneNumber = getPhoneNumberFromUserInput();
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then(function (confirmationResult) {
        window.confirmationResult = confirmationResult;
        window.signingIn = false;
        updateSignInButtonUI();
        updateVerificationCodeFormUI();
        updateVerifyCodeButtonUI();
        updateSignInFormUI();
      })
      .catch(function (error) {
        console.error('Error during signInWithPhoneNumber', error);
        window.alert('Error during signInWithPhoneNumber:\n\n' + error.code + '\n\n' + error.message);
        window.signingIn = false;
        updateSignInFormUI();
        updateSignInButtonUI();
      });
  }
}

function onVerifyCodeSubmit(e) {
  e.preventDefault();
  if (getCodeFromUserInput()) {
    window.verifyingCode = true;
    updateVerifyCodeButtonUI();
    const code = getCodeFromUserInput();
    window.confirmationResult.confirm(code)
      .then(function (result) {
        const user = result.user;
        window.verifyingCode = false;
        window.confirmationResult = null;
        updateVerificationCodeFormUI();
      })
      .catch(function (error) {
        console.error('Error while checking the verification code', error);
        window.alert('Error while checking the verification code:\n\n' + error.code + '\n\n' + error.message);
        window.verifyingCode = false;
        updateSignInButtonUI();
        updateVerifyCodeButtonUI();
      });
  }
}

function cancelVerification(e) {
  e.preventDefault();
  window.confirmationResult = null;
  updateVerificationCodeFormUI();
  updateSignInFormUI();
}

function onSignOutClick() {
  clearTimeout(autoSignOutTimer);
  signOut(auth);
}

function getCodeFromUserInput() {
  return verificationCodeInput.value;
}

function getPhoneNumberFromUserInput() {
  return phoneNumberInput.value;
}

function isPhoneNumberValid() {
  const pattern = /^\+[0-9\s\-\(\)]+$/;
  const phoneNumber = getPhoneNumberFromUserInput();
  return phoneNumber.search(pattern) !== -1;
}

function resetReCaptcha() {
  if (typeof grecaptcha !== 'undefined' && typeof window.recaptchaWidgetId !== 'undefined') {
    grecaptcha.reset(window.recaptchaWidgetId);
  }
}

function updateSignInButtonUI() {
  signInButton.disabled = !isPhoneNumberValid() || window.signingIn;
}

function updateVerifyCodeButtonUI() {
  verifyCodeButton.disabled = window.verifyingCode || !getCodeFromUserInput();
}

function updateSignInFormUI() {
  if (auth.currentUser || window.confirmationResult) {
    signInForm.style.display = 'none';
  } else {
    resetReCaptcha();
    signInForm.style.display = 'block';
  }
}

function updateVerificationCodeFormUI() {
  if (!auth.currentUser && window.confirmationResult) {
    verificationCodeForm.style.display = 'block';
  } else {
    verificationCodeForm.style.display = 'none';
  }
}

function updateSignOutButtonUI() {
  if (auth.currentUser) {
    signOutButton.style.display = 'block';
  } else {
    signOutButton.style.display = 'none';
  }
}

function updateSignedInUserStatusUI() {
  const user = auth.currentUser;
  const timerContainer = document.getElementById('auto-logout-timer-container');

  if (user) {
    signInStatus.textContent = 'Signed in';
    accountDetails.textContent = JSON.stringify(user, null, '  ');
    timerContainer.style.display = 'block'; // Show the timer when user is logged in
    startAutoSignOutTimer(); // Start the auto-logout timer
  } else {
    signInStatus.textContent = 'Signed out';
    accountDetails.textContent = 'null';
    timerContainer.style.display = 'none'; // Hide the timer when user is logged out
    clearTimeout(autoSignOutTimer); // Clear the auto-logout timer
    clearInterval(countdownInterval); // Clear the countdown interval
  }
}


onAuthStateChanged(auth, function (user) {
  updateSignInButtonUI();
  updateSignInFormUI();
  updateSignOutButtonUI();
  updateSignedInUserStatusUI();
  updateVerificationCodeFormUI();

  if (user) {
    startAutoSignOutTimer();
  } else {
    clearTimeout(autoSignOutTimer); // Clear the timer if the user is not signed in
  }
});

signOutButton.addEventListener('click', onSignOutClick);
phoneNumberInput.addEventListener('keyup', updateSignInButtonUI);
phoneNumberInput.addEventListener('change', updateSignInButtonUI);
verificationCodeInput.addEventListener('keyup', updateVerifyCodeButtonUI);
verificationCodeInput.addEventListener('change', updateVerifyCodeButtonUI);
verificationCodeForm.addEventListener('submit', onVerifyCodeSubmit);
cancelVerifyCodeButton.addEventListener('click', cancelVerification);

window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  size: 'normal',
  callback: function (response) {
    onSignInSubmit();
  }
});

window.recaptchaVerifier.render().then(function (widgetId) {
  window.recaptchaWidgetId = widgetId;
  updateSignInButtonUI();
});

//

let autoSignOutTimer;
let countdownInterval;
const logoutTime = 10;
let timeLeft = logoutTime;

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = document.getElementById('auto-logout-timer');
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function resetTimer() {
  timeLeft = logoutTime; // Reset the timer back to 10 minutes
  updateTimerDisplay();
}

function startAutoSignOutTimer() {
  clearTimeout(autoSignOutTimer);
  clearInterval(countdownInterval);
  resetTimer();

  countdownInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      signOut(auth).then(() => {
        console.log('User has been automatically signed out after 10 minutes of inactivity');
      }).catch((error) => {
        console.error('Error signing out:', error);
      });
    }
  }, 1000);

  autoSignOutTimer = setTimeout(() => {
    clearInterval(countdownInterval);
  }, logoutTime * 1000);
}

// Function to reset the auto-logout timer when there's user activity
function resetAutoSignOutTimer() {
  startAutoSignOutTimer();
}

// Attach event listeners to reset the timer on user actions
document.addEventListener('mousemove', resetAutoSignOutTimer, false);
document.addEventListener('keypress', resetAutoSignOutTimer, false);
// You may want to add other events to reset the timer such as 'click' or 'touchstart' for mobile devices

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebase"; // your firebase config file

// Call this when component mounts
const setUpRecaptcha = () => {
  window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible',
    'callback': () => {
      // reCAPTCHA solved - will proceed with sign-in
    }
  }, auth);
};

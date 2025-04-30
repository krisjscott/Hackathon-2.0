const sendOTP = async (phoneNumber) => {
  setUpRecaptcha();
  const appVerifier = window.recaptchaVerifier;

  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    alert("OTP sent!");
  } catch (error) {
    console.error("SMS not sent", error);
  }
};

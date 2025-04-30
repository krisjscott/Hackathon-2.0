const verifyOTP = async (otp) => {
  try {
    const result = await window.confirmationResult.confirm(otp);
    const user = result.user;
    console.log("User signed in:", user);
  } catch (error) {
    console.error("Incorrect OTP", error);
  }
};

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Email not valid");
  }
}

export function checkInput(
  email: string,
  password: string,
) {
  if (!email || !password) {
    throw new Error("Complete all inputs");
  }
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Email not valid");
  }
}

export function checkPassword(password: string, confirmation: string) {
  if (password !== confirmation) {
    throw new Error("Passwords didnt match");
  }
}

export function checkInput(
  email: string,
  password: string,
  name: string,
  username: string,
  last_name: string,
  password_confirmation: string
) {
  if (
    !email ||
    !password ||
    !name ||
    !username ||
    !last_name ||
    !password_confirmation
  ) {
    throw new Error("Complete all inputs");
  }
}

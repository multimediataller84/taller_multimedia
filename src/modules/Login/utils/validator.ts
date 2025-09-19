export function checkInput(username: string, password: string) {
  if (!username || !password) {
    throw new Error("Complete all inputs");
  }
}

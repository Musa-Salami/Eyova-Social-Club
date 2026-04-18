export const ADMIN_EMAIL = "eyovaclub@gmail.com";
export const ADMIN_PASSWORD = "admin321";
export const ADMIN_SESSION_KEY = "eyova_admin_logged_in";

export function validateAdminLogin(email: string, password: string) {
  return email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

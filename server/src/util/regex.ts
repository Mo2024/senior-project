export const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const ownerCprRegex = /^\d{9}$/;
export const fullNameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
export const telephoneRegex = /^\d{8}$/;
export const addressRegex = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9\s]+$/;
export const businessNameRegex = /^(?! )[a-zA-Z0-9\s]+$/;
export const descriptionRegex = /^(?=.*[a-zA-Z]).{1,50}$/;

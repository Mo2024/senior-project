export const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const ownerCprRegex = /^\d{9}$/;
export const fullNameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
export const telephoneRegex = /^\d{8}$/;
export const addressRegex = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9\s]+$/;
export const businessNameRegex = /^(?! )[a-zA-Z0-9\s]+$/;
export const descriptionRegex = /^(?=.*[a-zA-Z]).{1,50}$/;
export const couponTypeRegex = /^(percentage|amount)$/;
export const couponNameRegex = /^[A-Za-z]{1,15}$/;
export const couponPercentageRegex = /^(0\.[1-9]\d*|0?\.0*[1-9]\d*|1(\.0+)?)$/;
export const couponAmounteRegex = /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/;
export const openingClosingTimeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
export const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const qtyRegex = /^(0|[1-9]\d*)$/;
export const barcodeRegex = /^[0-9a-zA-Z]+$/
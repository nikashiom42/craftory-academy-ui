export const GEORGIAN_PHONE_REGEX = /^(?:\+?995\d{9}|\d{9})$/;
export const PERSONAL_ID_REGEX = /^\d{11}$/;

export const normalizePhone = (value: string) => value.replace(/[\s\-()]/g, "");

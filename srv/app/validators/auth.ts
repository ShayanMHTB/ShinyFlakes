import vine from '@vinejs/vine';

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().minLength(2).maxLength(255),
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(6).maxLength(32),
  }),
);

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(1),
  }),
);

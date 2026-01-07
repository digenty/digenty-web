export const hasASmallLetter = (password: string) => /[a-z]/.test(password);

export const hasACapitalLetter = (password: string) => /[A-Z]/.test(password);

export const hasANumber = (password: string) => /\d/.test(password);

export const hasASpecialCharacter = (password: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);

export const is8CharactersLong = (password: string) => password.length >= 8;

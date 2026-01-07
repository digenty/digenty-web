import { CheckIcon, XIcon } from "lucide-react";
import { hasASmallLetter, hasACapitalLetter, hasANumber, hasASpecialCharacter, is8CharactersLong } from "./utils";
import { useEffect } from "react";

export const PasswordChecklist = ({ password, setIsfulfilled }: { password: string; setIsfulfilled: (bool: boolean) => void }) => {
  useEffect(() => {
    if (
      hasASmallLetter(password) &&
      hasACapitalLetter(password) &&
      hasANumber(password) &&
      hasASpecialCharacter(password) &&
      is8CharactersLong(password)
    ) {
      setIsfulfilled(true);
    } else {
      setIsfulfilled(false);
    }
  }, [password, setIsfulfilled]);

  return (
    <div className="grid grid-cols-2 gap-y-1">
      <div className="flex items-center gap-2">
        {hasASmallLetter(password) ? <CheckIcon className="text-text-success size-4" /> : <XIcon className="text-text-destructive size-4" />}
        <p className="text-2xs text-text-muted sm:text-xs">At least 1 small letter</p>
      </div>

      <div className="flex items-center gap-2">
        {hasACapitalLetter(password) ? <CheckIcon className="text-text-success size-4" /> : <XIcon className="text-text-destructive size-4" />}
        <p className="text-2xs text-text-muted sm:text-xs">At least 1 capital letter</p>
      </div>

      <div className="flex items-center gap-2">
        {hasANumber(password) ? <CheckIcon className="text-text-success size-4" /> : <XIcon className="text-text-destructive size-4" />}
        <p className="text-2xs text-text-muted sm:text-xs">At least 1 number</p>
      </div>

      <div className="flex items-center gap-2">
        {hasASpecialCharacter(password) ? <CheckIcon className="text-text-success size-4" /> : <XIcon className="text-text-destructive size-4" />}
        <p className="text-2xs text-text-muted sm:text-xs">At least 1 special character</p>
      </div>

      <div className="flex items-center gap-2">
        {is8CharactersLong(password) ? <CheckIcon className="text-text-success size-4" /> : <XIcon className="text-text-destructive size-4" />}
        <p className="text-2xs text-text-muted sm:text-xs">At least 8 characters</p>
      </div>
    </div>
  );
};

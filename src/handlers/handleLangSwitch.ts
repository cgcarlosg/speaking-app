import { Dispatch, SetStateAction } from 'react';

export function handleLangSwitch(setIsEnglish: Dispatch<SetStateAction<boolean>>) {
  setIsEnglish((prev) => !prev);
}
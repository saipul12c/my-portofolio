import { useContext } from 'react';
import { RecaptchaContext } from './RecaptchaContextDef';

export function useRecaptcha() {
  const context = useContext(RecaptchaContext);
  if (!context) {
    throw new Error('useRecaptcha harus digunakan dalam RecaptchaProvider');
  }
  return context;
}

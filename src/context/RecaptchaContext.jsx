import { useState, useCallback } from 'react';
import { RecaptchaContext } from './RecaptchaContextDef';

export function RecaptchaProvider({ children }) {
  const [isRecaptchaVisible, setIsRecaptchaVisible] = useState(false);

  const showRecaptcha = useCallback(() => {
    setIsRecaptchaVisible(true);
  }, []);

  const hideRecaptcha = useCallback(() => {
    setIsRecaptchaVisible(false);
  }, []);

  return (
    <RecaptchaContext.Provider value={{ isRecaptchaVisible, showRecaptcha, hideRecaptcha }}>
      {children}
    </RecaptchaContext.Provider>
  );
}

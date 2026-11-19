import { useState } from 'react';

export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('uju355@gmail.com');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return { isCopied, copyEmail };
};
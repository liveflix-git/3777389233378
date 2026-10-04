import React from 'react';
import { sanitizeDemoMessage } from '../../utils/sensitiveMask';

interface SensitiveTextSpanProps {
  text: string;
}

export const SensitiveTextSpan: React.FC<SensitiveTextSpanProps> = ({ text }) => {
  const cleanText = sanitizeDemoMessage(text);
  return <span>{cleanText}</span>;
};

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 6, value, onChange, error }) => {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const inputs = Array.from({ length }, (_, i) => i);

  const focusInput = (index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleTextChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (!numericText) return;

    const newValueArray = value.split('');
    newValueArray[index] = numericText[numericText.length - 1] || '';
    const newValue = newValueArray.join('');

    onChange(newValue);

    if (newValue.length > index) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (value[index] === undefined || value[index] === '') {
        focusInput(index - 1);
      }

      const newValueArray = value.split('');
      newValueArray[index] = '';
      onChange(newValueArray.join(''));
    }
  };

  return (
    <div className="flex flex-col gap-2 font-body items-center">
      <div className="flex gap-2">
        {inputs.map((index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleTextChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            aria-label={`Digit ${index + 1} of verification code`}
            className={twMerge(
              clsx(
                'w-12 h-12 text-center text-body-lg font-bold bg-bg-subtle border border-border-default rounded-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-border-brand focus:ring-1 focus:ring-border-brand transition-all duration-fast',
                error && 'border-semantic-danger focus:border-semantic-danger focus:ring-semantic-danger',
              ),
            )}
          />
        ))}
      </div>
      {error && (
        <span role="alert" className="text-body-xs text-semantic-danger">
          {error}
        </span>
      )}
    </div>
  );
};
export default OTPInput;

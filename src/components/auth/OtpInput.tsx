// OtpInput.tsx
'use client';

import { useRef } from 'react';
import { Special_Elite } from 'next/font/google';

const typewriter = Special_Elite({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-typewriter',
});

const BLUE = '#4A6B8A';
const GOLD = '#C79A45';
const INK = '#1C1C1A';
const CREAM = '#EDE9E1';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(length, ' ').split('').slice(0, length);

  function setDigit(index: number, char: string) {
    const next = digits.slice();
    next[index] = char;
    onChange(next.join('').replace(/\s/g, ''));
  }

  function handleChange(index: number, raw: string) {
    const char = raw.replace(/\D/g, '').slice(-1);
    setDigit(index, char || ' ');
    if (char && index < length - 1) inputsRef.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index].trim() && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
  }

  return (
    <div className={`${typewriter.variable} flex gap-2 justify-between`} onPaste={handlePaste}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={digit.trim()}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="font-[family-name:var(--font-typewriter)] w-12 h-14 text-center text-xl rounded-sm border outline-none transition-all duration-150"
          style={{
            backgroundColor: CREAM,
            borderColor: `${INK}22`,
            color: INK,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = BLUE;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${BLUE}22`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = digit.trim() ? `${GOLD}` : `${INK}22`;
            e.currentTarget.style.boxShadow = 'none';
          }}
          aria-label={`Digit ${i + 1} of verification code`}
        />
      ))}
    </div>
  );
}
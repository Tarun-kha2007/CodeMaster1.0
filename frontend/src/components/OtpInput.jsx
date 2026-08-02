import React, { useState, useRef, useEffect } from 'react';

const OtpInput = ({ length = 6, value, onChange }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (value) {
      setOtp(value.split('').slice(0, length).concat(new Array(Math.max(0, length - value.length)).fill('')));
    } else {
      setOtp(new Array(length).fill(''));
    }
  }, [value, length]);

  const handleChange = (e, index) => {
    const text = e.target.value;
    if (/[^0-9]/.test(text)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = text.substring(text.length - 1);
    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Move to next input if there's a value
    if (text && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length).replace(/[^0-9]/g, '');
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      onChange(newOtp.join(''));
      
      // Focus on the next empty input or the last one
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex].focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength="1"
          ref={el => inputRefs.current[index] = el}
          value={data}
          onChange={e => handleChange(e, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          onFocus={e => e.target.select()}
          className="w-12 h-14 text-center text-2xl font-bold bg-base-200 border-2 border-base-300 rounded-xl focus:border-primary focus:outline-none transition-all text-base-content"
        />
      ))}
    </div>
  );
};

export default OtpInput;

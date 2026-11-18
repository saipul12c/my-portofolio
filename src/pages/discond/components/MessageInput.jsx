import React, { useState, useRef } from 'react';

const MessageInput = ({ placeholder = 'Message', onSend }) => {
  const [value, setValue] = useState('');
  const ref = useRef(null);

  const submit = (e) => {
    e?.preventDefault();
    const txt = value.trim();
    if (!txt) return;
    onSend && onSend(txt);
    setValue('');
  };

  return (
    <div className="p-4">
      <form onSubmit={submit} className="bg-[#202225]/60 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#5865f2]/10">
        <div className="flex items-center">
          <button type="button" className="p-2 text-gray-400 hover:text-gray-300">+</button>
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            rows={1}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
            className="flex-1 resize-none bg-transparent text-white py-2 px-2 focus:outline-none placeholder-gray-400"
          />
          <div className="flex items-center space-x-1">
            <button type="button" className="p-2 text-gray-400 hover:text-gray-300">🙂</button>
            <button type="submit" className="px-3 py-1 bg-[#56b6c2] text-white rounded">Kirim</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;

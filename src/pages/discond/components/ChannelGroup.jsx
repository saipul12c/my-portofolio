import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const ChannelGroup = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <div onClick={() => setOpen(v => !v)} className="px-4 py-2 flex items-center justify-between text-gray-400 text-sm font-semibold cursor-pointer hover:text-gray-300">
        <div className="flex items-center gap-2">
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-0' : '-rotate-90'}`} />
          <span>{title}</span>
        </div>
      </div>
      {open && <div>{children}</div>}
    </div>
  );
};

export default ChannelGroup;

"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function AdminPasswordInput() {
  const [visible, setVisible] = useState(false);

  return <div className="relative">
    <input className="w-full border border-line bg-ivory px-3 py-3 pr-12 focus-visible:outline-2 focus-visible:outline-olive" id="admin-password" type={visible ? "text" : "password"} name="password" autoComplete="current-password" required maxLength={200} />
    <button aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-stone hover:text-forest focus-visible:outline-2 focus-visible:outline-olive" onClick={() => setVisible(value => !value)} type="button">
      {visible ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
    </button>
  </div>;
}

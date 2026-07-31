"use client";

import { useState } from "react";
import { qaData } from "@/app/qa/data";

export default function QaAccordion() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="max-w-2xl mx-auto space-y-12 md:space-y-16">
      {qaData.map((group) => (
        <div key={group.category}>
          <p className="text-[9px] tracking-[0.5em] text-[#9a9088] mb-8">
            {group.category}
          </p>
          <div className="space-y-0">
            {group.items.map((item) => (
              <div key={item.q} className="border-t border-[#1e1c1a]/8">
                <button
                  type="button"
                  onClick={() => setOpen(open === item.q ? null : item.q)}
                  className="w-full flex items-start justify-between gap-6 py-6 text-left"
                >
                  <span className="text-[13px] font-light tracking-wide text-[#1e1c1a]">
                    {item.q}
                  </span>
                  <span className="text-[#9a9088] text-xs shrink-0 mt-0.5 transition-transform duration-300"
                    style={{ transform: open === item.q ? "rotate(45deg)" : "rotate(0deg)" }}>
                    ＋
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: open === item.q ? "400px" : "0px" }}
                >
                  <p className="text-[12px] leading-[2.6] tracking-wide text-[#6b6560] font-light pb-6">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
            <div className="border-t border-[#1e1c1a]/8" />
          </div>
        </div>
      ))}
    </div>
  );
}

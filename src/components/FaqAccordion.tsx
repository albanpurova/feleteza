"use client";

import { useState } from "react";

type Faq = { id: string; question: string; answer: string };

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  if (faqs.length === 0) return null;

  return (
    <div className="mx-auto max-w-3xl divide-y divide-gray-200">
      {faqs.map((f) => {
        const isOpen = open === f.id;
        return (
          <div key={f.id} className="py-4">
            <button
              onClick={() => setOpen(isOpen ? null : f.id)}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <span className="font-semibold text-brand-navy">{f.question}</span>
              <span className="text-xl text-brand-orange">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <p className="mt-3 text-sm leading-relaxed text-brand-orange/90">{f.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

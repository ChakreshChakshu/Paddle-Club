'use client';

import * as React from 'react';
import RotatingText from './RotatingText';

export function TypewriterTitle() {
  return (
    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-display text-white leading-tight flex flex-col items-start select-none">
      <span className="text-slate-400 text-xs md:text-sm font-bold tracking-eyebrow uppercase mb-3">
        Agra's Ultimate Club Experience
      </span>
      <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-slate-100">Where Sport Meets</span>
        <RotatingText
          texts={['Social', 'Community', 'Agra', 'Cafe Brio', 'Championship']}
          mainClassName="text-brand-court-lime font-black"
          staggerFrom="last"
          initial={{ y: 35, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -35, opacity: 0 }}
          staggerDuration={0.035}
          splitLevelClassName="overflow-hidden pb-1"
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          rotationInterval={2600}
        />
      </span>
    </h1>
  );
}


import React from 'react';
import StatCard from './StatCard';
import { statsData } from '../data/portalData';

export default function StatsSection() {
  return (
    <section className="relative py-12 border-y border-slate-800/80 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat) => (
            <StatCard key={stat.id} item={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

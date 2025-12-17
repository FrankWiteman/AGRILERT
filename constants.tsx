
import React from 'react';

export const CROP_DATA = {
  Rice: { color: 'bg-emerald-500', icon: '🌾', growthTime: 120, waterNeed: 0.8 },
  Cowpea: { color: 'bg-green-600', icon: '🫘', growthTime: 70, waterNeed: 0.4 },
  Maize: { color: 'bg-yellow-400', icon: '🌽', growthTime: 90, waterNeed: 0.6 },
  Cassava: { color: 'bg-amber-700', icon: '🪴', growthTime: 300, waterNeed: 0.3 }
};

export const MOCK_WEATHER_HISTORY = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  rainfall: Math.random() * 10,
  signalStrength: 70 + (Math.random() * 30 - (i > 12 && i < 18 ? 20 : 0)) // Drop signal during "rain"
}));

export const NAVIGATION_ITEMS = [
  { label: 'Dashboard', icon: 'fa-chart-line', id: 'dashboard' },
  { label: 'Plot Mapper', icon: 'fa-map-location-dot', id: 'mapping' },
  { label: 'Virtual Farm', icon: 'fa-clover', id: 'simulation' },
  { label: 'Advisory', icon: 'fa-lightbulb', id: 'advisory' },
  { label: 'Management', icon: 'fa-list-check', id: 'management' },
  { label: 'Education', icon: 'fa-graduation-cap', id: 'education' },
  { label: 'Community', icon: 'fa-users', id: 'community' }
];

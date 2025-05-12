// Default units by region/country codes
export const REGION_UNITS = {
  US: { height: 'ft/in', weight: 'lb' },
  UK: { height: 'ft/in', weight: 'st/lb' },
  // Most other countries use metric
  DEFAULT: { height: 'cm', weight: 'kg' }
} as const;

export function getRegionUnits() {
  // Get user's region from browser
  const region = navigator.language.split('-')[1];
  return REGION_UNITS[region as keyof typeof REGION_UNITS] || REGION_UNITS.DEFAULT;
}

// Conversion functions
export function convertHeight(value: number, from: string, to: string): number {
  if (from === to) return value;
  
  switch (`${from}-${to}`) {
    case 'cm-ft/in':
      return value / 30.48;
    case 'ft/in-cm':
      return value * 30.48;
    default:
      return value;
  }
}

export function convertWeight(value: number, from: string, to: string): number {
  if (from === to) return value;
  
  switch (`${from}-${to}`) {
    case 'kg-lb':
      return value * 2.20462;
    case 'lb-kg':
      return value / 2.20462;
    case 'kg-st/lb':
      return value * 0.157473;
    case 'st/lb-kg':
      return value / 0.157473;
    default:
      return value;
  }
}

export function formatHeight(value: number, unit: string): string {
  switch (unit) {
    case 'ft/in':
      const feet = Math.floor(value);
      const inches = Math.round((value - feet) * 12);
      return `${feet}'${inches}"`;
    default:
      return `${Math.round(value)}${unit}`;
  }
}

export function formatWeight(value: number, unit: string): string {
  switch (unit) {
    case 'st/lb':
      const stone = Math.floor(value);
      const pounds = Math.round((value - stone) * 14);
      return `${stone}st ${pounds}lb`;
    default:
      return `${Math.round(value)}${unit}`;
  }
}
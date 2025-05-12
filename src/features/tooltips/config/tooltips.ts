export const FEATURE_TOOLTIPS = {
  CAMERA: {
    id: 'camera-feature',
    content: 'Take a photo of your food for instant nutrition analysis',
    placement: 'bottom'
  },
  BARCODE: {
    id: 'barcode-scanner',
    content: 'Scan product barcodes to log packaged foods',
    placement: 'bottom'
  },
  MENU: {
    id: 'menu-scanner',
    content: 'Analyze restaurant menus for nutritional information',
    placement: 'bottom'
  },
  WATER_TRACKING: {
    id: 'water-tracking',
    content: 'Track your daily water intake',
    placement: 'right'
  }
} as const;

export const CONTEXTUAL_PROMPTS = {
  FIRST_PHOTO: {
    id: 'first-photo-prompt',
    title: 'Ready to log your first meal?',
    content: 'Take a photo of your food to get started with AI-powered nutrition tracking',
    action: {
      label: 'Learn how it works',
      onClick: () => {} // Add tutorial or help action
    }
  },
  RESTAURANT_SUGGESTION: {
    id: 'restaurant-suggestion',
    title: 'Eating out?',
    content: 'Try our menu scanner to analyze restaurant meals before ordering',
    condition: () => true, // Add condition based on usage patterns
    dismissible: true
  }
} as const;
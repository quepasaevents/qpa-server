export interface Theme {
  color: {
    [K: string]: string
  };
  nestedDepthBackgrounds: string[];
  font: {
    textL: string;
    textM: string;
    textS: string;
    textXL: string;
    textXS: string;
    textXXL: string;
  };
  input: {
    height: string;
    borderRadius: string;
  };
  chipColor: {
    tag: string;
    productType: string;
  };
  snackbar: {
    borderColor: {
      info: string;
      debug: string;
      warning: string;
      error: string;
      success: string;
    }
  }
}

const color = {
  azure: '#00a9e0',
  black: '#000000',
  clearBlue: '#1890ff',
  darkGrey: '#4a4a4a',
  deepPink: '#ce0058',
  dustyOrange: '#f78a27',
  green: '#00a34e',
  grey: '#666666',
  lightBlack: '#333333',
  lightGrey: '#d3d3d3',
  lightSilver: '#f1f1f1',
  perrywinkle: '#7fbae3',
  powderBlue: '#9bcaeb',
  red: '#ff0000',
  silver: '#eff0f0',
  tangerine: '#e95326',
  warmPurple: '#6f2b8d',
  white: '#fff',
  yellow: '#feeb3d',
};

const theme: Theme = {
  color,
  font: {
    textL: '16px',
    textM: '14px',
    textS: '13px',
    textXL: '18px',
    textXS: '11px',
    textXXL: '20px',
  },
  nestedDepthBackgrounds: [
    'rgba(155, 202, 235, 0.7)',
    'rgba(155, 202, 235, 0.5)',
    'rgba(155, 202, 235, 0.3)',
    'rgba(155, 202, 235, 0.1)',
  ],
  input: {
    height: '24px',
    borderRadius: '4px',
  },
  chipColor: {
    productType: color.perrywinkle,
    tag: color.azure,
  },
  snackbar: {
    borderColor: {
      success: color.green,
      warning: color.yellow,
      info: color.clearBlue,
      debug: color.deepPink,
      error: color.red,
    }
  }
};

export default theme;

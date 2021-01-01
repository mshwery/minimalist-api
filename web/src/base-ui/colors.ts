// $xiketic: #161528ff;
// $han-purple: #4b30f2ff;
// $emerald: #59c586ff;
// $platinum: #eaeaecff;
// $red-crayola: #e9354dff;

const neutrals = {
  '100': '#F4F4F6',
  '200': '#E9E9EC',
  '300': '#C9CACF',
  '400': '#A9A9B6',
  '500': '#54526D',
  '600': '#292749',
}

const blues = {
  lightest: '#F1F2FD',
  light: '#D4D8F8',
  base: '#3649DF',
  dark: '#1B2BAA',
}

const reds = {
  lightest: '#FCE5E8',
  light: '#F6A9B3',
  base: '#E9354D',
  dark: '#B8142A',
}

export const colors = {
  neutral: neutrals,
  blue: blues,
  red: reds,
  fill: {
    background: neutrals['100'],
    muted: neutrals['300'],
    secondary: neutrals['400'],
    primary: blues.base,
    danger: reds.base,
  },
  text: {
    action: blues.base,
    placeholder: neutrals['300'],
    muted: neutrals['500'],
    default: neutrals['600'],
  },
}

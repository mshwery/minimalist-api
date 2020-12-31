const BLUE = '#2e8ae6'
const RED = '#E44343'

const neutrals = {
  '100': '#F4F4F6',
  '200': '#E2E8F0',
  '300': '#C9CACF',
  '400': '#A6B1BB',
  '500': '#787A87',
  '600': '#242527',
}

export const colors = {
  neutral: neutrals,
  fill: {
    background: neutrals['100'],
    muted: neutrals['300'],
    secondary: neutrals['400'],
    primary: BLUE,
    danger: RED,
  },
  text: {
    action: BLUE,
    placeholder: neutrals['300'],
    muted: neutrals['500'],
    default: neutrals['600'],
  },
}

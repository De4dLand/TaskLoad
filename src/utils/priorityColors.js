import { alpha } from '@mui/material/styles';

const baseColors = {
  High: '#ff4d4d',  // A strong red
  Medium: '#ffa64d', // A vibrant orange
  Low: '#66b3ff'    // A soft blue
};

export const getPriorityColor = (priority, theme) => {
  const baseColor = baseColors[priority];
  
  switch (priority) {
    case 'High':
      return {
        background: alpha(baseColor, 0.2),
        border: baseColor,
        text: theme.palette.getContrastText(baseColor)
      };
    case 'Medium':
      return {
        background: alpha(baseColor, 0.15),
        border: baseColor,
        text: theme.palette.getContrastText(baseColor)
      };
    case 'Low':
      return {
        background: alpha(baseColor, 0.1),
        border: baseColor,
        text: theme.palette.getContrastText(baseColor)
      };
    default:
      return {
        background: theme.palette.background.paper,
        border: theme.palette.divider,
        text: theme.palette.text.primary
      };
  }
};


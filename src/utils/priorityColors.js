import { alpha } from '@mui/material/styles';

const baseColors = {
  High: '#ff1a1a',    // A stronger red
  Medium: '#ff8c1a',  // A stronger orange
  Low: '#3399ff'    // A soft blue
};

export const getPriorityColor = (priority, theme) => {
  const baseColor = baseColors[priority];

  switch (priority) {
    case 'High':
      return {
        background: alpha(baseColor, 0.3),
        border: baseColor,
        text: '#000000'
      };
    case 'Medium':
      return {
        background: alpha(baseColor, 0.2),
        border: baseColor,
        text: '#000000'
      };
    case 'Low':
      return {
        background: alpha(baseColor, 0.15),
        border: baseColor,
        text: '#000000'
      };
    default:
      return {
        background: theme.palette.background.paper,
        border: theme.palette.divider,
        text: '#000000'
      };
  }
};


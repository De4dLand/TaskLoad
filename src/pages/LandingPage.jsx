import React from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Assignment as AssignmentIcon,
  DateRange as DateRangeIcon,
  Timeline as TimelineIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

const FeatureItem = ({ icon, title, description }) => (
  <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {icon}
      <Typography variant="h6" component="h3" sx={{ ml: 1 }}>
        {title}
      </Typography>
    </Box>
    <Typography variant="body2" sx={{ flexGrow: 1 }}>
      {description}
    </Typography>
  </Paper>
);

const LandingPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom align="center">
          Welcome to TaskLoad
        </Typography>
        <Typography variant="h3" component="h2" gutterBottom align="center" color="text.secondary">
          Giải Pháp Toàn Diện Cho Quản Lý Công Việc
        </Typography>
        <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Bạn đã sẵn sàng lập lịch chưa ?
          </Typography>
          <Button
            component={RouterLink}
            to="/signup"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Bắt đầu
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 6 }}>
        <Grid item xs={12} md={6}>
          <FeatureItem
            icon={<AssignmentIcon fontSize="large" color="primary" />}
            title="Quản Lý Công Việc"
            description="Dễ dàng tạo, cập nhật , tổ chức công việc,nâng cao hiệu suất làm việc"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FeatureItem
            icon={<DateRangeIcon fontSize="large" color="secondary" />}
            title="Tích Hợp Lịch Biểu"
            description="Minh họa Công việc của bạn trong chế độ xem lịch để quản lý thời gian và thời hạn tốt hơn."
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FeatureItem
            icon={<TimelineIcon fontSize="large" color="success" />}
            title="Thống Kê Thời Gian"
            description="Theo dõi năng suất của bạn bằng tính năng theo dõi thời gian tích hợp cho từng Công việc."
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FeatureItem
            icon={<NotificationsIcon fontSize="large" color="error" />}
            title="Thông báo Linh hoạt"
            description="Luôn hoàn thành nhiệm vụ của bạn với lời nhắc và thông báo kịp thời."
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default LandingPage;


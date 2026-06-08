import { Box, Typography, Button } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  title = 'No data found',
  description = 'There are no items to display yet.',
  actionLabel,
  onAction,
}: EmptyStateProps) => (
  <Box textAlign="center" py={8}>
    <InboxOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography color="text.secondary" mb={3}>
      {description}
    </Typography>
    {actionLabel && onAction && (
      <Button variant="contained" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </Box>
);

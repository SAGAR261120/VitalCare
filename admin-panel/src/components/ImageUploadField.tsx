import { useRef, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import api from '../services/api';
import { resolveMediaUrl } from '../utils/mediaUrl';

interface ImageUploadFieldProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
}

export const ImageUploadField = ({ label, value = '', onChange }: ImageUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const preview = resolveMediaUrl(value);

  const handleUpload = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/cms/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(data.data.url as string);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Upload failed',
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        {label}
      </Typography>

      {preview && (
        <Box
          sx={{
            position: 'relative',
            mb: 1.5,
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            maxHeight: 180,
          }}>
          <Box
            component="img"
            src={preview}
            alt="Preview"
            sx={{ width: '100%', maxHeight: 180, objectFit: 'cover', display: 'block' }}
          />
          <IconButton
            size="small"
            aria-label="Remove image"
            onClick={() => onChange('')}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.55)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
            }}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
        <Button
          variant="outlined"
          startIcon={uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
          disabled={uploading}
          onClick={() => inputRef.current?.click()}>
          {uploading ? 'Uploading…' : preview ? 'Replace Image' : 'Upload Image'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          hidden
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />
      </Box>

      <TextField
        fullWidth
        size="small"
        label="Or paste image URL"
        margin="dense"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="/uploads/banner.jpg or https://..."
        sx={{ mt: 1 }}
      />

      {error && (
        <Typography variant="caption" color="error" display="block" mt={0.5}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

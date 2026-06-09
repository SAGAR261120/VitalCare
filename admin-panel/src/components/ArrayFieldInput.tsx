import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface ArrayFieldInputProps {
  label: string;
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export const ArrayFieldInput = ({ label, value, onChange, placeholder }: ArrayFieldInputProps) => {
  const items = value.length ? value : [''];

  const updateItem = (index: number, text: string) => {
    const next = [...items];
    next[index] = text;
    onChange(next);
  };

  const addItem = () => onChange([...items, '']);

  const removeItem = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    onChange(next.length ? next : ['']);
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        {label}
      </Typography>
      {items.map((item, index) => (
        <Box key={index} display="flex" gap={1} mb={1}>
          <TextField
            fullWidth
            size="small"
            placeholder={placeholder}
            value={item}
            onChange={e => updateItem(index, e.target.value)}
          />
          <IconButton
            size="small"
            color="error"
            onClick={() => removeItem(index)}
            disabled={items.length === 1 && !item}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button size="small" startIcon={<AddIcon />} onClick={addItem}>
        Add Item
      </Button>
    </Box>
  );
};

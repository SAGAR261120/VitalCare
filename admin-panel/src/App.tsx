import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store';
import { lightTheme, darkTheme } from './theme';
import { useAppSelector } from './hooks/useAppDispatch';
import { AppRoutes } from './routes';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const ThemedApp = () => {
  const mode = useAppSelector(s => s.theme.mode);
  return (
    <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemedApp />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;

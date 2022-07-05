import React, { useMemo, ReactNode } from 'react';
import { ThemeProvider, StyledEngineProvider, createTheme, CssBaseline } from '@mui/material';

import { palette } from './palette';
import typography from './typography';
import overrides from './overrides';

interface AppProps {
  children: ReactNode;
}

function ThemeProviderWrapper({ children }: AppProps) {
  const themeOptions = useMemo(
    () => ({
      palette: palette,
      typography: typography,
      shape: {
        borderRadius: '.5rem'
      }
    }),
    []
  );

  const theme = createTheme(themeOptions as any);
  theme.components = overrides(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default ThemeProviderWrapper;

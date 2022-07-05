import { ReactElement } from 'react';
import { Breakpoint, Theme, useMediaQuery } from '@mui/material';

interface ComponentProps {
  width: string;
  children: ReactElement;
}

function Hidden({ width, children }: ComponentProps): JSX.Element | null {
  const breakpoint = width.substring(0, 2);

  const hiddenUp = useMediaQuery<Theme>((theme: Theme) => theme.breakpoints.up(breakpoint as Breakpoint));
  const hiddenDown = useMediaQuery<Theme>((theme: Theme) => theme.breakpoints.down(breakpoint as Breakpoint));

  if (width.includes('Down')) {
    return hiddenDown ? null : children;
  }

  if (width.includes('Up')) {
    return hiddenUp ? null : children;
  }

  return null;
}

export default Hidden;

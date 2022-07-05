import { ReactNode } from 'react';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

import useToggle from '../hooks/useToggle';

export const NAVBAR_HEIGHT: number = 72;

interface AppProps {
  children: ReactNode;
}

const MainContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  overflow: 'hidden',
  width: '100%'
}));

const PageWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  width: '100%',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('lg')]: {
    paddingTop: `${NAVBAR_HEIGHT}px`
  },
  [theme.breakpoints.down('lg')]: {
    paddingTop: theme.spacing(9),
    paddingInline: theme.spacing(2)
  }
}));

function Layout({ children }: AppProps) {
  const { checked, onOpen, onClose } = useToggle(false);

  const handleOpenSidebar = () => onOpen();
  const handleCloseSidebar = () => onClose();

  return (
    <MainContainer>
      <Navbar onOpenSidebar={handleOpenSidebar} />
      <Sidebar isOpenSidebar={checked} onCloseSidebar={handleCloseSidebar} />
      <PageWrapper>
        <Box sx={{ width: '100%' }}>{children}</Box>
      </PageWrapper>
    </MainContainer>
  );
}

export default Layout;

import { Drawer, Box, IconButton, List, ListItemButton, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';

import { MuiButton, MuiTypography, NextLink } from '../common';

import CloseIcon from '@mui/icons-material/Close';

import { pxToRem } from '../../utils/font';
import Menuitems from '../../constant/sidebar';

const DRAWER_WIDTH: number = 265;

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: pxToRem(16),
  marginInline: pxToRem(16)
})) as typeof Box;

interface SidebarProps {
  isOpenSidebar: boolean;
  onCloseSidebar: () => void;
}

function Sidebar({ isOpenSidebar, onCloseSidebar }: SidebarProps): JSX.Element {
  return (
    <Box>
      <Drawer
        open={isOpenSidebar}
        onClose={onCloseSidebar}
        PaperProps={{
          sx: {
            width: DRAWER_WIDTH
          }
        }}
      >
        <Box>
          <LogoContainer>
            <Box>
              <MuiTypography variant="h5">NFT Marketplace</MuiTypography>
            </Box>
            <Box sx={{ marginLeft: 'auto' }}>
              <IconButton onClick={onCloseSidebar}>
                <CloseIcon />
              </IconButton>
            </Box>
          </LogoContainer>

          <Box sx={{ mt: 2 }}>
            <List>
              {Menuitems?.map((item, index) => {
                return (
                  <List component="li" disablePadding key={index}>
                    <NextLink to={item?.href}>
                      <ListItemButton>
                        <ListItemText primary={item?.title} />
                      </ListItemButton>
                    </NextLink>
                  </List>
                );
              })}
            </List>
          </Box>

          <Box sx={{ margin: pxToRem(16), textAlign: 'center' }}>
            <MuiButton variant="contained">Connect wallet</MuiButton>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}

export default Sidebar;

import { styled } from '@mui/material';

const CustomFooter = styled('footer')(({ theme }) => ({
  height: '5vh',
  minHeight: theme.spacing(4),
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.common.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
}));

const Footer = () => <CustomFooter>&copy;2019-2022 Smart Spectral Matching</CustomFooter>;

export default Footer;

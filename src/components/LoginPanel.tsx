import { useAuth } from 'react-oidc-context';
import { Button, Dialog, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const LoginDialog = styled(Dialog)(({ theme }) => ({
  display: 'flex',
  margin: 'auto',
  justifyContent: 'space-between',
  borderRadius: theme.spacing(3),
}));

const LoginPaper = styled(Paper)(() => ({
  display: 'flex',
  background: 'white',
}));

export interface LoginPanelProps {
  id: string;
  open: boolean;
  onClose: (value: string) => void;
}
const LoginPanel = (props: LoginPanelProps) => {
  const auth = useAuth();
  const { id, open, onClose } = props;
  const handleClose = (value: string) => {
    onClose(value);
  };

  const dialogButton = auth.isAuthenticated ? (
    <Button onClick={() => auth.removeUser()}>Confirm Logout.</Button>
  ) : (
    <Button onClick={() => auth.signinPopup()}>Sign in with Keycloak.</Button>
  );

  return (
    <LoginDialog id={id} open={open} onClose={handleClose}>
      <LoginPaper variant="outlined" elevation={1}>
        {dialogButton}
      </LoginPaper>
    </LoginDialog>
  );
};

export default LoginPanel;

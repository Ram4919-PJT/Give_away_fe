import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/Toast';
import LogoutConfirmDialog from '../components/ui/LogoutConfirmDialog';

export function useLogoutAction({ redirectTo = '/', skipConfirm = false } = {}) {
  const { logout, logoutLoading, currentUser } = useApp();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const performLogout = useCallback(async () => {
    setConfirmOpen(false);
    try {
      await logout();
      showToast('You have been signed out safely.', 'success');
    } catch {
      showToast('Signed out locally.', 'info');
    } finally {
      navigate(redirectTo, { replace: true });
    }
  }, [logout, navigate, redirectTo, showToast]);

  const requestLogout = useCallback(() => {
    if (skipConfirm) {
      performLogout();
      return;
    }
    setConfirmOpen(true);
  }, [skipConfirm, performLogout]);

  const cancelLogout = useCallback(() => {
    if (!logoutLoading) setConfirmOpen(false);
  }, [logoutLoading]);

  const LogoutDialog = (
    <LogoutConfirmDialog
      open={confirmOpen}
      onCancel={cancelLogout}
      onConfirm={performLogout}
      loading={logoutLoading}
      userName={currentUser?.name}
    />
  );

  return { requestLogout, performLogout, logoutLoading, LogoutDialog };
}

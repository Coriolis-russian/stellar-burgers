import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useAppDispatch } from '../../services/store';
import { userActions } from '@slices/user';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(userActions.logout());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};

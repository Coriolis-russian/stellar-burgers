import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { userSelectors } from '@slices/user';
import { useAppSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const userName = useAppSelector(userSelectors.selectUserName);
  return <AppHeaderUI userName={userName} />;
};

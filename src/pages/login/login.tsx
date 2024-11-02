import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { userActions, userSelectors } from '@slices/user';

export const Login: FC = () => {
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const [wasLoginTried, setWasLoginTried] = useState<boolean>(false);

  const error = useAppSelector(userSelectors.selectLastError) || '';
  const loading = useAppSelector(userSelectors.selectPendingState);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setWasLoginTried(true);
    localStorage.setItem('email', email);
    dispatch(userActions.login({ email, password }));
  };

  const errorText = wasLoginTried ? error : '';

  return (
    <LoginUI
      errorText={errorText}
      inProgress={loading}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};

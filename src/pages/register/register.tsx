import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { userActions, userSelectors } from '@slices/user';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const [wasRegisterTried, setWasRegisterTried] = useState<boolean>(false);

  const error = useAppSelector(userSelectors.selectLastError) || '';
  const loading = useAppSelector(userSelectors.selectPendingState);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setWasRegisterTried(true);
    localStorage.setItem('email', email);
    dispatch(userActions.register({ name: userName, email, password }));
  };

  const errorText = wasRegisterTried ? error : '';

  return (
    <RegisterUI
      errorText={errorText}
      inProgress={loading}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};

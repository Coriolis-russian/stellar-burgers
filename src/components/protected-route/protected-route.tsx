import { useAppSelector } from '../../services/store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { userSelectors } from '@slices/user';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyPublic?: boolean;
};

function ProtectedRoute({ onlyPublic }: ProtectedRouteProps) {
  const isUserAuth = useAppSelector(userSelectors.selectIsUserAuth);
  const isUserActual = useAppSelector(userSelectors.selectIsUserActual);
  const location = useLocation();

  if (!isUserActual) {
    return <Preloader />;
  }

  if (onlyPublic && isUserAuth) {
    const from = location.state?.from || { pathname: '/' };
    return (
      <Navigate to={from} state={{ background: from?.state?.background }} />
    );
  }

  if (!onlyPublic && !isUserAuth) {
    return (
      <Navigate
        to='/login'
        state={{
          from: location
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;

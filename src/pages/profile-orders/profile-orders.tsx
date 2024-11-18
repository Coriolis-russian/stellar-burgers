import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { ordersActions, ordersSelectors } from '@slices/orders';

export const ProfileOrders: FC = () => {
  /** DONE: взять переменную из стора */
  const dispatch = useAppDispatch();
  const orders = useAppSelector(ordersSelectors.selectOrders);
  const loading = useAppSelector(ordersSelectors.selectIsLoading);

  useEffect(() => {
    dispatch(ordersActions.get());
  }, [dispatch]);

  return <ProfileOrdersUI loading={loading} orders={orders} />;
};

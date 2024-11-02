import { FeedUI } from '@ui-pages';
import { FC, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { feedActions, feedSelectors } from '@slices/feed';
import { Preloader } from '@ui';

export const Feed: FC = () => {
  /** DONE: взять переменную из стора */
  const orders = useAppSelector(feedSelectors.selectOrders);
  const loading: boolean = useAppSelector(feedSelectors.selectIsLoading);
  const dispatch = useAppDispatch();

  // при первом монтировании сделаем запрос на сервер, если до этого не делали
  // (по сути, если заказов не будет вообще, то при каждом монтировании будем
  // делать запрос, но такое поведение не баг, а фича)
  useEffect(() => {
    if (!orders.length) dispatch(feedActions.fetch());
  }, [dispatch]);

  const handleGetFeeds = useCallback(() => {
    dispatch(feedActions.fetch());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};

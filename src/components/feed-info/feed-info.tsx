import { FC, useEffect } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '@ui';
import { useAppSelector } from '../../services/store';
import { feedSelectors } from '@slices/feed';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** DONE: взять переменные из стора */
  const orders = useAppSelector(feedSelectors.selectOrders);
  const total = useAppSelector(feedSelectors.selectTotal);
  const totalToday = useAppSelector(feedSelectors.selectTotalToday);

  const feed = { total, totalToday };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};

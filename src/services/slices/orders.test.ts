import orders, { ordersActions, ordersSelectors } from '@slices/orders';
import {
  ordersInitialState,
  testOrderOne,
  testOrderTwo
} from '../test-data';
import { RequestStatus } from '@utils-types';

describe('Редюсер orders', () => {
  describe('Получение заказов', () => {
    test('Отправка запроса', () => {
      const newState = orders.reducer(
        ordersInitialState,
        ordersActions.get.pending('загрузка...')
      );
      expect(newState.status).toEqual(RequestStatus.Loading);

      const isLoading = ordersSelectors.selectIsLoading({ orders: newState });
      expect(isLoading).toBeTruthy();
    });

    test('Ответ с ошибкой', () => {
      const newState = orders.reducer(
        ordersInitialState,
        ordersActions.get.rejected(Error('ошибка'), '')
      );
      expect(newState.status).toEqual(RequestStatus.Failed);
      const isLoading = ordersSelectors.selectIsLoading({ orders: newState });
      expect(isLoading).toBeFalsy();
    });

    test('Успешный ответ', () => {
      const expectedOrders = [testOrderOne, testOrderTwo];
      const newState = orders.reducer(
        ordersInitialState,
        ordersActions.get.fulfilled(expectedOrders, '')
      );
      expect(newState.status).toEqual(RequestStatus.Success);

      const loadedOrders = ordersSelectors.selectOrders({ orders: newState });
      expect(loadedOrders).toEqual(expectedOrders);

      const isLoading = ordersSelectors.selectIsLoading({ orders: newState });
      expect(isLoading).toBeFalsy();
    });
  });
});

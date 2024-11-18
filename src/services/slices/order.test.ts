import order, { orderActions, orderSelectors } from '@slices/order';
import { orderInitialState, testOrderOne } from '../test-data';
import { RequestStatus } from '@utils-types';

describe('Редюсер order', () => {
  describe('Заказ по номеру', () => {
    test('Отправка запроса', () => {
      const newState = order.reducer(
        orderInitialState,
        orderActions.get.pending('загрузка', 1)
      );
      expect(newState.statusOrderByNumber).toEqual(RequestStatus.Loading);
    });

    test('Ответ с ошибкой', () => {
      const newState = order.reducer(
        orderInitialState,
        orderActions.get.rejected(Error('тестовая ошибка'), '', 1)
      );
      expect(newState.statusOrderByNumber).toEqual(RequestStatus.Failed);
    });

    test('Успешный ответ', () => {
      const newState = order.reducer(
        orderInitialState,
        orderActions.get.fulfilled(
          { success: true, orders: [testOrderOne] },
          '',
          testOrderOne.number
        )
      );
      expect(newState.statusOrderByNumber).toEqual(RequestStatus.Success);
      expect(newState.orderRequestedByNumber).toEqual(testOrderOne);
    });
  });

  describe('Размещение заказа', () => {
    test('Отправка запроса', () => {
      const newState = order.reducer(
        orderInitialState,
        orderActions.order.pending('загрузка', [''])
      );
      expect(newState.statusOrderPlace).toEqual(RequestStatus.Loading);
      const isLoading = orderSelectors.selectIsOrderPlacePending({
        order: newState
      });
      expect(isLoading).toBeTruthy();
    });

    test('Ответ с ошибкой', () => {
      const newState = order.reducer(
        orderInitialState,
        orderActions.order.rejected(Error('тестовая ошибка'), '', [''])
      );
      expect(newState.statusOrderPlace).toEqual(RequestStatus.Failed);
      const isLoading = orderSelectors.selectIsOrderPlacePending({
        order: newState
      });
      expect(isLoading).toBeFalsy();
    });

    test('Успешный ответ', () => {
      const newState = order.reducer(
        orderInitialState,
        orderActions.order.fulfilled(
          { success: true, order: testOrderOne, name: testOrderOne.name },
          '',
          testOrderOne.ingredients
        )
      );
      expect(newState.statusOrderPlace).toEqual(RequestStatus.Success);
      expect(newState.orderPlaced).toEqual(testOrderOne);
      const isLoading = orderSelectors.selectIsOrderPlacePending({
        order: newState
      });
      expect(isLoading).toBeFalsy();
    });
  });
});

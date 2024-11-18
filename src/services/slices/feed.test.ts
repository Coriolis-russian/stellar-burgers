import feed, { feedActions, feedSelectors } from '@slices/feed';
import { feedInitialState, testOrderOne, testOrderTwo } from '../test-data';
import { RequestStatus } from '@utils-types';

describe('Редюсер feed', () => {
  describe('Запрос содержимого ленты', () => {
    test('Отправка запроса', () => {
      const newState = feed.reducer(
        feedInitialState,
        feedActions.fetch.pending('')
      );
      expect(newState.status).toEqual(RequestStatus.Loading);

      const isLoading = feedSelectors.selectIsLoading({ feed: newState });
      expect(isLoading).toBeTruthy();
    });

    test('Получение успешного ответа на запрос', () => {
      const expectedFeed = [testOrderOne, testOrderTwo];
      const newState = feed.reducer(
        feedInitialState,
        feedActions.fetch.fulfilled(
          {
            success: true,
            orders: expectedFeed,
            total: 1222,
            totalToday: 99_999
          },
          ''
        )
      );
      expect(newState.status).toEqual(RequestStatus.Success);
      expect(newState.total).toEqual(1222);
      expect(newState.totalToday).toEqual(99_999);
      expect(newState.orders).toEqual(expectedFeed);
      const isLoading = feedSelectors.selectIsLoading({ feed: newState });
      expect(isLoading).toBeFalsy();
    });

    test('Получение ошибки на запрос', () => {
      const newState = feed.reducer(
        feedInitialState,
        feedActions.fetch.rejected(Error('тестовая ошибка'), '')
      );
      expect(newState.status).toEqual(RequestStatus.Failed);
      const isLoading = feedSelectors.selectIsLoading({ feed: newState });
      expect(isLoading).toBeFalsy();
    });
  });
});

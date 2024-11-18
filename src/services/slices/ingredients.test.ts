import { RequestStatus } from '@utils-types';
import {
  ingredientsInitialState,
  testBun,
  testIngredientOne,
  testIngredientTwo,
  testSauce
} from '../test-data';
import ingredients, { ingredientsActions } from '@slices/ingredients';

afterEach(() => {
  jest.clearAllMocks();
});

describe('Редюсер ingredients', () => {
  test('Отправка запроса', () => {
    const newState = ingredients.reducer(
      ingredientsInitialState,
      ingredientsActions.fetch.pending('')
    );
    expect(newState.status).toEqual(RequestStatus.Loading);
  });

  test('Ответ с ошибкой', () => {
    const newState = ingredients.reducer(
      ingredientsInitialState,
      ingredientsActions.fetch.rejected(Error('ошибка загрузки'), '')
    );

    expect(newState.status).toEqual(RequestStatus.Failed);
    expect(newState.ingredients).toEqual([]);
  });

  test('Успешный ответ', () => {
    const expectedIngredients = [
      testBun,
      testIngredientOne,
      testIngredientTwo,
      testSauce
    ];

    const newState = ingredients.reducer(
      ingredientsInitialState,
      ingredientsActions.fetch.fulfilled(expectedIngredients, '')
    );

    expect(newState.status).toEqual(RequestStatus.Success);
    expect(newState.ingredients).toEqual(expectedIngredients);
  });
});

import * as uuid from 'uuid';

import constructor, { constructorActions } from '@slices/constructor';
import {
  constructorInitialState,
  GUARANTEED_ABSOLUTE_RANDOM_ID as RND_ID,
  testBun,
  testIngredientOne,
  testIngredientTwo
} from '../test-data';

jest.mock('uuid');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Редюсер constructor', () => {
  test('Добавление булки', () => {
    const uuidV4Mock = jest.spyOn(uuid, 'v4').mockImplementation(() => RND_ID);

    const newState = constructor.reducer(
      constructorInitialState,
      constructorActions.add({ ...testBun, id: '' })
    );

    expect(uuidV4Mock).toHaveBeenCalledTimes(1);
    expect(newState).toEqual({
      ingredients: [],
      bun: { ...testBun, id: RND_ID }
    });
  });

  test('Добавление ингредиентов', () => {
    const uuidV4Mock = jest.spyOn(uuid, 'v4').mockImplementation(() => RND_ID);

    const intermediateState = constructor.reducer(
      constructorInitialState,
      constructorActions.add({ ...testIngredientOne, id: '' })
    );

    const newState = constructor.reducer(
      intermediateState,
      constructorActions.add({ ...testIngredientTwo, id: '' })
    );

    expect(uuidV4Mock).toHaveBeenCalledTimes(2);
    expect(newState).toEqual({
      ingredients: [
        { ...testIngredientOne, id: RND_ID },
        { ...testIngredientTwo, id: RND_ID }
      ],
      bun: null
    });
  });

  test('Удаление ингредиента', () => {
    const newState = constructor.reducer(
      {
        ingredients: [
          { ...testIngredientOne, id: '' },
          { ...testIngredientTwo, id: '' }
        ],
        bun: null
      },
      constructorActions.del({ ...testIngredientOne, id: '' })
    );

    expect(newState).toEqual({
      ingredients: [{ ...testIngredientTwo, id: '' }],
      bun: null
    });
  });

  test('Изменение порядка ингредиентов вверх', () => {
    const newState = constructor.reducer(
      {
        ingredients: [
          { ...testIngredientOne, id: '' },
          { ...testIngredientTwo, id: '' }
        ],
        bun: null
      },
      constructorActions.shift({ indexFromZero: 1, direction: 'up' })
    );

    expect(newState).toEqual({
      ingredients: [
        { ...testIngredientTwo, id: '' },
        { ...testIngredientOne, id: '' }
      ],
      bun: null
    });
  });

  test('Изменение порядка ингредиентов вниз', () => {
    const newState = constructor.reducer(
      {
        ingredients: [
          { ...testIngredientOne, id: '' },
          { ...testIngredientTwo, id: '' }
        ],
        bun: null
      },
      constructorActions.shift({ indexFromZero: 0, direction: 'down' })
    );

    expect(newState).toEqual({
      ingredients: [
        { ...testIngredientTwo, id: '' },
        { ...testIngredientOne, id: '' }
      ],
      bun: null
    });
  });
});

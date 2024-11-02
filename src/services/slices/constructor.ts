import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { CONSTRUCTOR_SLICE_NAME } from './sliceNames';
import { v4 as uuidv4 } from 'uuid';

type ConstructorState = {
  bun?: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructor = createSlice({
  name: CONSTRUCTOR_SLICE_NAME,
  initialState,
  selectors: {
    selectItems: (state) => state
  },
  reducers: {
    add: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') state.bun = action.payload;
        else state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TConstructorIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    del: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient._id !== action.payload._id
      );
    },
    reset: (state) => {
      state.ingredients = initialState.ingredients;
      state.bun = initialState.bun;
    },
    shift: (
      state,
      action: PayloadAction<{
        indexFromZero: number;
        direction: 'up' | 'down';
      }>
    ) => {
      const to =
        action.payload.indexFromZero +
        (action.payload.direction === 'up' ? -1 : 1);
      const from = action.payload.indexFromZero;

      const moved = state.ingredients[from];
      state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, moved);
    }
  }
});

export const constructorSelectors = constructor.selectors;
export const constructorActions = constructor.actions;
export default constructor;

import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus, TIngredient } from '@utils-types';
import { INGREDIENTS_SLICE_NAME } from './sliceNames';
import { fetchIngredients } from '../thunks/ingredients';

type IngredientState = {
  ingredients: TIngredient[];
  status: RequestStatus;
};

const initialState: IngredientState = {
  ingredients: [],
  status: RequestStatus.Idle
};

const ingredients = createSlice({
  name: INGREDIENTS_SLICE_NAME,
  initialState,
  selectors: {
    selectIsLoading: (state) => state.status === RequestStatus.Loading,
    selectIngredients: (state) => state.ingredients,
    selectIngredient: (state, id: string) =>
      state.ingredients.find((i) => i._id === id)
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.status = RequestStatus.Failed;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.ingredients = action.payload;
      });
  }
});

export const ingredientsActions = {
  ...ingredients.actions,
  fetch: fetchIngredients
};
export const ingredientsSelectors = ingredients.selectors;
export default ingredients;

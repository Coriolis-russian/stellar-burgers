import { FC } from 'react';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';
import { useAppSelector } from '../../services/store';
import { ingredientsSelectors } from '../../services/slices/ingredients';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  /** DONE: взять переменную из стора */
  const ingredientData = id
    ? useAppSelector((state) =>
        ingredientsSelectors.selectIngredient(state, id)
      )
    : undefined;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};

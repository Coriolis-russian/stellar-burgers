import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';
import {
  selectOrder,
  useAppDispatch,
  useAppSelector
} from '../../services/store';
import { ingredientsSelectors } from '@slices/ingredients';
import { useNavigate, useParams } from 'react-router-dom';
import { orderActions } from '@slices/order';

export const OrderInfo: FC = () => {
  const number = useParams().number || '';
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  /** DONE: взять переменные orderData и ingredients из стора */
  const orderData = useAppSelector(selectOrder(number));

  // если локально нет - идём в сеть
  useEffect(() => {
    if (!orderData) {
      dispatch(orderActions.get(+number));
    }
  }, [number, orderData, dispatch]);

  const ingredients: TIngredient[] = useAppSelector(
    ingredientsSelectors.selectIngredients
  );

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (number === '') {
    navigate('/notFound');
    return;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { constructorActions, constructorSelectors } from '@slices/constructor';
import { useNavigate } from 'react-router-dom';
import { userSelectors } from '@slices/user';
import { orderActions, orderSelectors } from '@slices/order';
import { feedActions } from '@slices/feed';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isUserAuth = useAppSelector(userSelectors.selectIsUserAuth);
  /** DONE: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useAppSelector(constructorSelectors.selectItems);

  // DONE: взять переменные orderRequest и orderModalData из стора order
  // признак выполнения запроса "order" - т.е. в процессе осуществления заказа
  const orderRequest = useAppSelector(orderSelectors.selectIsOrderPlacePending);

  // вернувшийся заказ (сервер подтвердил приём заказа и вернул вот это)
  const orderModalData = useAppSelector(orderSelectors.selectOrderPlaced);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isUserAuth) {
      navigate('/login');
      return;
    }

    const order = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    dispatch(orderActions.order(order));
  };
  const closeOrderModal = () => {
    // очистить конструктор
    dispatch(constructorActions.reset());
    // и заказ
    dispatch(orderActions.reset());
    // сбросить ленту заказов что бы если на неё переключатся - она обновилась
    dispatch(feedActions.reset());
    // и идём в конструктор
    navigate('/');
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useAppDispatch } from '../../services/store';
import { constructorActions } from '@slices/constructor';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useAppDispatch();
    const handleMoveDown = () => {
      dispatch(
        constructorActions.shift({ indexFromZero: index, direction: 'down' })
      );
    };

    const handleMoveUp = () => {
      dispatch(
        constructorActions.shift({ indexFromZero: index, direction: 'up' })
      );
    };

    const handleClose = () => {
      dispatch(constructorActions.del({ ...ingredient, id: ingredient._id }));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);

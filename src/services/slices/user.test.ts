import user, { userActions } from '@slices/user';
import {
  testAuthResponse,
  testRegisterData,
  userInitialState
} from '../test-data';
import { RequestStatus } from '@utils-types';

describe('Редюсер user', () => {
  describe('Авторизация', () => {
    test('Отправка запроса', () => {
      const loginData = { email: 'email', password: 'password' };
      const newState = user.reducer(
        userInitialState,
        userActions.login.pending('', loginData)
      );
      expect(newState.requestStatus).toEqual(RequestStatus.Loading);
    });

    test('Ответ с ошибкой', () => {
      const loginData = { email: 'email', password: 'password' };
      const newState = user.reducer(
        userInitialState,
        userActions.login.rejected(Error('ошибка'), '', loginData)
      );
      expect(newState.requestStatus).toEqual(RequestStatus.Failed);
      expect(newState.lastError).toEqual('ошибка');
    });

    test('Успешный ответ', () => {
      const loginData = {
        email: testAuthResponse.user.email,
        password: 'password'
      };
      const newState = user.reducer(
        userInitialState,
        userActions.login.fulfilled(
          { success: true, ...testAuthResponse },
          '',
          loginData
        )
      );
      expect(newState.requestStatus).toEqual(RequestStatus.Success);
      expect(newState.user).toEqual(testAuthResponse.user);
      expect(newState.isUserActual).toBeTruthy();
    });
  });

  describe('Информация о пользователе', () => {
    test('Отправка запроса', () => {
      const loginData = { email: 'email', password: 'password' };
      const newState = user.reducer(
        userInitialState,
        userActions.fetch.pending('')
      );
      expect(newState.requestStatus).toEqual(RequestStatus.Loading);
    });

    test('Ответ с ошибкой', () => {
      const newState = user.reducer(
        userInitialState,
        userActions.fetch.rejected(Error('ошибка'), '')
      );
      expect(newState.requestStatus).toEqual(RequestStatus.Failed);
      expect(newState.lastError).toEqual('ошибка');
    });

    test('Успешный ответ', () => {
      const loginData = {
        email: testAuthResponse.user.email,
        password: 'password'
      };
      const newState = user.reducer(
        userInitialState,
        userActions.fetch.fulfilled(testAuthResponse.user, '')
      );
      expect(newState.requestStatus).toEqual(RequestStatus.Success);
      expect(newState.user).toEqual(testAuthResponse.user);
      expect(newState.isUserActual).toBeTruthy();
    });
  });

  describe('Регистрация пользователя', () => {
    test('Отправка запроса', () => {
      const newState = user.reducer(
        userInitialState,
        userActions.register.pending('', testRegisterData)
      );
      expect(newState.requestStatus).toEqual(RequestStatus.Loading);
    });

    test('Ответ с ошибкой', () => {
      const newState = user.reducer(
        userInitialState,
        userActions.register.rejected(Error('ошибка'), '', testRegisterData)
      );
      expect(newState.requestStatus).toEqual(RequestStatus.Failed);
      expect(newState.lastError).toEqual('ошибка');
      expect(newState.user).toBeNull();
    });

    test('Успешный ответ', () => {
      const newState = user.reducer(
        userInitialState,
        userActions.register.fulfilled(
          { success: true, ...testAuthResponse },
          '',
          testRegisterData
        )
      );
      expect(newState.requestStatus).toEqual(RequestStatus.Success);
      expect(newState.user).toEqual(testAuthResponse.user);
      expect(newState.isUserActual).toBeTruthy();
    });
  });

  describe('Логаут', () => {
    test('Отправка запроса', () => {
      const newState = user.reducer(
        userInitialState,
        userActions.logout.pending('')
      );
      expect(newState.requestStatus).toEqual(RequestStatus.Loading);
    });

    test('Ответ с ошибкой', () => {
      const newState = user.reducer(
        userInitialState,
        userActions.logout.rejected(Error('ошибка'), '')
      );
      expect(newState.requestStatus).toEqual(RequestStatus.Failed);
      expect(newState.lastError).toEqual('ошибка');
    });

    test('Успешный ответ', () => {
      const newState = user.reducer(
        userInitialState,
        userActions.logout.fulfilled({ success: true, ...testAuthResponse }, '')
      );
      expect(newState.requestStatus).toEqual(RequestStatus.Success);
      expect(newState.user).toBeNull();
      expect(newState.isUserActual).toBeTruthy();
    });
  });

  describe('Обновление данных', () => {
    test('Отправка запроса', () => {
      const newState = user.reducer(
        userInitialState,
        userActions.update.pending('', testRegisterData)
      );
      expect(newState.requestStatus).toEqual(RequestStatus.Loading);
    });

    test('Ответ с ошибкой', () => {
      const newState = user.reducer(
        userInitialState,
        userActions.update.rejected(Error('ошибка'), '', testRegisterData)
      );
      expect(newState.requestStatus).toEqual(RequestStatus.Failed);
      expect(newState.lastError).toEqual('ошибка');
    });

    test('Успешный ответ', () => {
      const initialState = {
        ...userInitialState,
        user: {
          name: 'name',
          email: 'email'
        }
      };
      const userNewData = {
        name: 'new name',
        email: 'new email'
      };
      const newState = user.reducer(
        initialState,
        userActions.update.fulfilled(
          { success: true, user: userNewData },
          '',
          testRegisterData
        )
      );
      expect(newState.requestStatus).toEqual(RequestStatus.Success);
      expect(newState.user).toEqual(userNewData);
    });
  });
});

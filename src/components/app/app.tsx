import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  Route,
  Routes,
  Location,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom';
import ProtectedRoute from '../protected-route/protected-route';
import { useCallback, useEffect } from 'react';
import { useAppDispatch } from '../../services/store';
import { ingredientsActions } from '@slices/ingredients';
import { userActions } from '@slices/user';

const App = () => {
  const location: Location<{ background?: Location }> = useLocation();
  const background = location.state?.background;

  const navigate = useNavigate();
  const goBack = useCallback(() => navigate(-1), []);

  const orderFromProfile = useMatch('/profile/orders/:number')?.params.number;
  const orderFromFeed = useMatch('/feed/:number')?.params.number;
  const orderNumberFromParams = orderFromProfile || orderFromFeed;

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(ingredientsActions.fetch());
    // Запросим юзера. Если у нас токена (еще) нет - придёт ошибка
    // и в любом случае ситуация с юзером прояснится (isUserActual->true)
    dispatch(userActions.fetch());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route element={<ProtectedRoute onlyPublic />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
          <Route
            path='/profile/orders/:number'
            element={
              <div className={styles.detailPageWrap}>
                <p
                  className={`text text_type_main-large ${styles.detailHeader}`}
                >
                  Детали заказа
                </p>
                <OrderInfo />
              </div>
            }
          />
        </Route>
        <Route
          path='*'
          element={
            <div className={styles.detailPageWrap}>
              <NotFound404 />
            </div>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <div className={styles.detailPageWrap}>
              <p className={`text text_type_main-large ${styles.detailHeader}`}>
                Детали ингредиента
              </p>
              <IngredientDetails />
            </div>
          }
        />
        <Route
          path='/feed/:number'
          element={
            <div className={styles.detailPageWrap}>
              <p className={`text text_type_main-large ${styles.detailHeader}`}>
                Детали заказа
              </p>
              <OrderInfo />
            </div>
          }
        />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal onClose={goBack} title='Детали заказа'>
                <OrderInfo />
              </Modal>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path='/profile/orders/:number'
              element={
                <Modal onClose={goBack} title='Детали заказа'>
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
          <Route
            path='/ingredients/:id'
            element={
              <Modal onClose={goBack} title='Детали ингредиента'>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;

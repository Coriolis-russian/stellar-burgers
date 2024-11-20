// булка для бесчеловечных экспериментов
import { RequestStatus, TIngredient, TOrder, TUser } from '@utils-types';

// гарантированно рандомный ID (введено полностью случайным образом)
export const GUARANTEED_ABSOLUTE_RANDOM_ID = '23433-3312-112';

export const testBun: TIngredient = {
  _id: '666',
  type: 'bun',
  calories: 999,
  carbohydrates: 333,
  fat: 100,
  image: 'noImage.png',
  image_large: 'noImage.png',
  image_mobile: 'noImage.png',
  name: 'тестовая булка',
  price: 100,
  proteins: 2000
};

export const testIngredientOne: TIngredient = {
  _id: '667',
  type: 'main',
  calories: 999,
  carbohydrates: 333,
  fat: 100,
  image: 'noImage.png',
  image_large: 'noImage.png',
  image_mobile: 'noImage.png',
  name: 'тестовая котлетка',
  price: 200,
  proteins: 2000
};

export const testIngredientTwo: TIngredient = {
  _id: '668',
  type: 'main',
  calories: 999,
  carbohydrates: 333,
  fat: 100,
  image: 'noImage.png',
  image_large: 'noImage.png',
  image_mobile: 'noImage.png',
  name: 'тестовый бекон',
  price: 200,
  proteins: 2000
};

export const testSauce: TIngredient = {
  _id: '669',
  type: 'sauce',
  calories: 999,
  carbohydrates: 333,
  fat: 100,
  image: 'noImage.png',
  image_large: 'noImage.png',
  image_mobile: 'noImage.png',
  name: 'тестовая подливка',
  price: 200,
  proteins: 2000
};

export const constructorInitialState = {
  bun: null,
  ingredients: []
};

export const feedInitialState = {
  orders: [],
  status: RequestStatus.Idle,
  total: 0,
  totalToday: 0
};

export const ingredientsInitialState = {
  ingredients: [],
  status: RequestStatus.Idle
};

export const orderInitialState = {
  orderPlaced: null,
  statusOrderPlace: RequestStatus.Idle,
  error: null,
  statusOrderByNumber: RequestStatus.Idle,
  orderRequestedByNumber: null
};

export const ordersInitialState = {
  orders: [],
  status: RequestStatus.Idle,
  error: null
};

export const userInitialState = {
  user: null,
  isUserActual: false,
  lastError: null,
  requestStatus: RequestStatus.Idle
};

export const testOrderOne: TOrder = {
  _id: '11',
  status: 'готов',
  name: 'Иван',
  createdAt: '2024-11-12T23:00:00',
  updatedAt: '2024-11-12T23:00:00',
  number: 33_333,
  ingredients: [testBun._id, testIngredientOne._id, testSauce._id]
};

export const testOrderTwo: TOrder = {
  _id: '12',
  status: 'готов',
  name: 'Пётр',
  createdAt: '2024-11-12T23:30:00',
  updatedAt: '2024-11-12T23:30:00',
  number: 33_334,
  ingredients: [
    testBun._id,
    testIngredientOne._id,
    testSauce._id,
    testIngredientTwo._id,
    testSauce._id
  ]
};

export const testAuthResponse = {
  refreshToken: GUARANTEED_ABSOLUTE_RANDOM_ID,
  accessToken: GUARANTEED_ABSOLUTE_RANDOM_ID,
  user: {
    email: 'email',
    name: 'name'
  }
};

export const testRegisterData = {
  email: 'email',
  name: 'name',
  password: 'password'
};

/// <reference types="cypress" />

// селекторы ингредиентов
const SELECTOR_INGREDIENTS_BUN = '[data-cy=ingredients-bun]';
const SELECTOR_INGREDIENTS_MAINS = '[data-cy=ingredients-mains]';
const SELECTOR_INGREDIENTS_SAUCES = '[data-cy=ingredients-sauces]';

// селекторы элементов конструктора
const SELECTOR_CONSTRUCTOR_BUN_TOP = '[data-cy=constructor-bun-top]';
const SELECTOR_CONSTRUCTOR_MAINS = '[data-cy=constructor-mains]';
const SELECTOR_CONSTRUCTOR_BUN_BOTTOM = '[data-cy=constructor-bun-bottom]';

// селекторы модального окна
const SELECTOR_OVERLAY = '[data-cy=overlay]';
const SELECTOR_BUTTON_CLOSE = '[data-cy=button-close]';
const SELECTOR_MODAL_WINDOW = '#modals';

describe('Добавление ингредиентов в конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Добавление булки', () => {
    cy.get(SELECTOR_INGREDIENTS_BUN).contains('Добавить').click();
    cy.get(SELECTOR_CONSTRUCTOR_BUN_TOP)
      .contains('Краторная булка N-200i')
      .should('exist');
    cy.get(SELECTOR_CONSTRUCTOR_BUN_BOTTOM)
      .contains('Краторная булка N-200i')
      .should('exist');
  });

  it('Добавление ингредиента', () => {
    cy.get(SELECTOR_INGREDIENTS_MAINS).contains('Добавить').click();
    cy.get(SELECTOR_CONSTRUCTOR_MAINS)
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
  });

  it('Добавление ингредиента и соуса', () => {
    cy.get(SELECTOR_INGREDIENTS_MAINS).contains('Добавить').click();
    cy.get(SELECTOR_INGREDIENTS_SAUCES).contains('Добавить').click();
    cy.get(SELECTOR_CONSTRUCTOR_MAINS)
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
    cy.get(SELECTOR_CONSTRUCTOR_MAINS).contains('Соус Spicy-X').should('exist');
  });
});

describe('Модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Открытие окна', () => {
    // модалка должна быть закрыта
    cy.get(SELECTOR_OVERLAY).should('not.exist');
    // открыть модалку
    cy.contains('Краторная булка N-200i').click();
    // проверка на открытие окна
    cy.contains('Детали ингредиента').should('exist');
    cy.get(SELECTOR_MODAL_WINDOW)
      .contains('Краторная булка N-200i')
      .should('exist');
  });

  it('Закрытие по крестику', () => {
    // модалка должна быть закрыта
    cy.get(SELECTOR_OVERLAY).should('not.exist');
    // открыть модалку
    cy.contains('Краторная булка N-200i').click();
    // проверка на открытие окна
    cy.contains('Детали ингредиента').should('exist');
    // закрытие окна
    cy.get(SELECTOR_BUTTON_CLOSE).click();
    // проверка на то что окно закрылось
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('Закрытие по оверлею', () => {
    // модалка должна быть закрыта
    cy.get(SELECTOR_OVERLAY).should('not.exist');
    // открыть модалку
    cy.contains('Краторная булка N-200i').click();
    // проверка на открытие окна
    cy.contains('Детали ингредиента').should('exist');
    // закрытие окна по оверлею
    cy.get(SELECTOR_OVERLAY).click('left', { force: true });
    // проверка на то что окно закрылось
    cy.contains('Детали ингредиента').should('not.exist');
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    // "загрузить" ингредиенты
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    // "загрузить" пользователя
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    // ответ на создание заказа
    cy.intercept('POST', 'api/orders', { fixture: 'post-orders.json' }).as(
      'postOrder'
    );
    // делаем вид что токены есть
    cy.setCookie('accessToken', 'accessToken');
    window.localStorage.setItem('refreshToken', JSON.stringify('refreshToken'));

    cy.viewport(1300, 800);
    cy.visit('');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Создание заказа', () => {
    // сборка бургера
    cy.get(SELECTOR_INGREDIENTS_BUN).contains('Добавить').click();
    cy.get(SELECTOR_INGREDIENTS_MAINS).contains('Добавить').click();
    cy.get(SELECTOR_INGREDIENTS_SAUCES).contains('Добавить').click();
    // ищем кнопку "Оформить заказ" и нажимаем на неё
    cy.contains('Оформить заказ').click();

    // ждём модального окна с результатом
    cy.get(SELECTOR_OVERLAY).should('exist');
    cy.get(SELECTOR_MODAL_WINDOW)
      .contains('идентификатор заказа')
      .should('exist');
    cy.get(SELECTOR_MODAL_WINDOW).contains('59846').should('exist');

    // закрываем окно
    cy.get(SELECTOR_BUTTON_CLOSE).click();
    // проверка на то что окно закрылось
    cy.get(SELECTOR_MODAL_WINDOW)
      .contains('идентификатор заказа')
      .should('not.exist');

    // проверка на очистку конструктора
    cy.get(SELECTOR_CONSTRUCTOR_BUN_TOP)
      .contains('Выберите булки')
      .should('exist');
    cy.get(SELECTOR_CONSTRUCTOR_BUN_BOTTOM)
      .contains('Выберите булки')
      .should('exist');
    cy.get(SELECTOR_CONSTRUCTOR_MAINS)
      .contains('Выберите начинку')
      .should('exist');
  });
});

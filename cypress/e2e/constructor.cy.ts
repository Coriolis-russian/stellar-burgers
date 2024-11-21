/// <reference types="cypress" />

// селекторы ингредиентов
const SELECTOR_INGREDIENTS_BUN = '[data-cy=ingredients-bun]';
const SELECTOR_INGREDIENTS_MAINS = '[data-cy=ingredients-mains]';
const SELECTOR_INGREDIENTS_SAUCES = '[data-cy=ingredients-sauces]';

// на этой булке всё тестируем
const SELECTOR_BUN_NAME = 'Краторная булка N-200i';

// селекторы элементов конструктора
const SELECTOR_CONSTRUCTOR_BUN_TOP = '[data-cy=constructor-bun-top]';
const SELECTOR_CONSTRUCTOR_MAINS = '[data-cy=constructor-mains]';
const SELECTOR_CONSTRUCTOR_BUN_BOTTOM = '[data-cy=constructor-bun-bottom]';

// селекторы модального окна
const SELECTOR_OVERLAY = '[data-cy=overlay]';
const SELECTOR_BUTTON_CLOSE = '[data-cy=button-close]';
const SELECTOR_MODAL_WINDOW = '#modals';

// команда для добавления одного из типа ингредиентов
Cypress.Commands.add('addSome', (selector: string) => {
  cy.get(selector).contains('Добавить').click();
});

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
    cy.addSome(SELECTOR_INGREDIENTS_BUN);
    cy.get(SELECTOR_CONSTRUCTOR_BUN_TOP)
      .contains(SELECTOR_BUN_NAME)
      .should('exist');
    cy.get(SELECTOR_CONSTRUCTOR_BUN_BOTTOM)
      .contains(SELECTOR_BUN_NAME)
      .should('exist');
  });

  it('Добавление ингредиента', () => {
    cy.addSome(SELECTOR_INGREDIENTS_MAINS);
    cy.get(SELECTOR_CONSTRUCTOR_MAINS)
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
  });

  it('Добавление ингредиента и соуса', () => {
    cy.addSome(SELECTOR_INGREDIENTS_MAINS);
    cy.addSome(SELECTOR_INGREDIENTS_SAUCES);
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
    cy.contains(SELECTOR_BUN_NAME).click();
    // проверка на открытие окна
    cy.contains('Детали ингредиента').should('exist');
    cy.get(SELECTOR_MODAL_WINDOW).contains(SELECTOR_BUN_NAME).should('exist');
  });

  it('Закрытие по крестику', () => {
    // модалка должна быть закрыта
    cy.get(SELECTOR_OVERLAY).should('not.exist');
    // открыть модалку
    cy.contains(SELECTOR_BUN_NAME).click();
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
    cy.contains(SELECTOR_BUN_NAME).click();
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
    [
      SELECTOR_INGREDIENTS_BUN,
      SELECTOR_INGREDIENTS_MAINS,
      SELECTOR_INGREDIENTS_SAUCES
    ].forEach(cy.addSome);

    // ищем кнопку "Оформить заказ" и нажимаем на неё
    cy.contains('Оформить заказ').click();

    // проверить что ушли нужные идентификаторы ингредиентов
    cy.wait('@postOrder')
      .its('request.body')
      .should('deep.equal', {
        ingredients: [
          '643d69a5c3f7b9001cfa093c',
          '643d69a5c3f7b9001cfa0941',
          '643d69a5c3f7b9001cfa0942',
          '643d69a5c3f7b9001cfa093c'
        ]
      });

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

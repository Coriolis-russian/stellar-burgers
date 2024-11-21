/// <reference types="cypress" />

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
    cy.get('[data-cy=ingredients-bun]').contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-top]')
      .contains('Краторная булка N-200i')
      .should('exist');
    cy.get('[data-cy=constructor-bun-bottom]')
      .contains('Краторная булка N-200i')
      .should('exist');
  });

  it('Добавление ингредиента', () => {
    cy.get('[data-cy=ingredients-mains]').contains('Добавить').click();
    cy.get('[data-cy=constructor-mains]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
  });

  it('Добавление ингредиента и соуса', () => {
    cy.get('[data-cy=ingredients-mains]').contains('Добавить').click();
    cy.get('[data-cy=ingredients-sauces]').contains('Добавить').click();
    cy.get('[data-cy=constructor-mains]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
    cy.get('[data-cy=constructor-mains]')
      .contains('Соус Spicy-X')
      .should('exist');
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
    cy.get('[data-cy=overlay]').should('not.exist');
    // открыть модалку
    cy.contains('Краторная булка N-200i').click();
    // проверка на открытие окна
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modals').contains('Краторная булка N-200i').should('exist');
  });

  it('Закрытие по крестику', () => {
    // модалка должна быть закрыта
    cy.get('[data-cy=overlay]').should('not.exist');
    // открыть модалку
    cy.contains('Краторная булка N-200i').click();
    // проверка на открытие окна
    cy.contains('Детали ингредиента').should('exist');
    // закрытие окна
    cy.get('[data-cy=button-close]').click();
    // проверка на то что окно закрылось
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('Закрытие по оверлею', () => {
    // модалка должна быть закрыта
    cy.get('[data-cy=overlay]').should('not.exist');
    // открыть модалку
    cy.contains('Краторная булка N-200i').click();
    // проверка на открытие окна
    cy.contains('Детали ингредиента').should('exist');
    // закрытие окна по оверлею
    cy.get('[data-cy=overlay]').click('left', { force: true });
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
    cy.get('[data-cy=ingredients-bun]').contains('Добавить').click();
    cy.get('[data-cy=ingredients-mains]').contains('Добавить').click();
    cy.get('[data-cy=ingredients-sauces]').contains('Добавить').click();
    // ищем кнопку "Оформить заказ" и нажимаем на неё
    cy.contains('Оформить заказ').click();

    // ждём мдального окна с результатом
    cy.get('[data-cy=overlay]').should('exist');
    cy.get('#modals').contains('идентификатор заказа').should('exist');
    cy.get('#modals').contains('59846').should('exist');

    // закрываем окно
    cy.get('[data-cy=button-close]').click();
    // проверка на то что окно закрылось
    cy.get('#modals').contains('идентификатор заказа').should('not.exist');

    // проверка на очистку конструктора
    cy.get('[data-cy=constructor-bun-top]')
      .contains('Выберите булки')
      .should('exist');
    cy.get('[data-cy=constructor-bun-bottom]')
      .contains('Выберите булки')
      .should('exist');
    cy.get('[data-cy=constructor-mains]')
      .contains('Выберите начинку')
      .should('exist');
  });
});

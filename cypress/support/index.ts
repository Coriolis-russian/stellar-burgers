declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Команда для добавления чего-нибудь в конструктор, ищет внутри кнопку
       * @example cy.addSome('селектор')
       */
      addSome(value: string): void;
    }
  }
}

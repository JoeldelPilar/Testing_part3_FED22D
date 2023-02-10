beforeEach(() => {
    cy.visit('/');
});

describe('Testing input and search functionality', () => {

    it('should find the input and confirm the input value', () => {
        cy.get('input#searchText').should('exist');
        cy.get('input#searchText').type('test').should('have.value', 'test');
    });

    it('should create html when searching for movie title', () => {
        cy.get('input#searchText').type('star').should('have.value', 'star');
        cy.get('button#search').should('exist');

        cy.get('form#searchForm').submit();

        cy.get('div.movie').should('exist');
        cy.get('div.movie').eq(0).should('contain.html', 'h3');
        cy.get('div.movie').eq(0).children('h3').contains('Star').should('exist');
    });

});
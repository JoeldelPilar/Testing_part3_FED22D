beforeEach(() => {
    cy.visit('/');
});

describe('Testing input and search functionality', () => {

    it('should find the input and confirm the input value', () => {
        cy.get('input#searchText').should('exist');
        cy.get('input#searchText').type('test').should('have.value', 'test');
    });

    it('should create html if search is successful', () => {
        cy.intercept('GET', 'http://omdbapi.com/?apikey=416ed51a&s=*', {
        fixture: 'omdbResponse'}).as('omdbCall') 

        cy.get('input#searchText').type('Movie').should('have.value', 'Movie');
        cy.get('button#search').should('exist');

        cy.get('form#searchForm').submit();
        cy.wait('@omdbCall');

        cy.get('div.movie').should('exist');
        cy.get('div.movie').eq(0).should('contain.html', 'h3');
        cy.get('div.movie').eq(0).children('h3').contains('Movie').should('exist');
    });

});

describe('Test regarding request', () => {

    it('should make api request with correct url', () => {
        cy.intercept('GET', 'http://omdbapi.com/?apikey=416ed51a&s=*', {
        fixture: 'omdbResponse'}).as('omdbCall') 

        cy.get('input#searchText').type('Movie').should('have.value', 'Movie');
        cy.get('button#search').should('exist');

        cy.get('form#searchForm').submit();

        cy.wait('@omdbCall').its('request.url').should('contain', 'Movie');
    });
});

describe('Tests that is provided with an empty response', () => {

    it('should create the correct error message if search input is whitespace', () => {
        cy.intercept('GET', 'http://omdbapi.com/?apikey=416ed51a&s=*', {
        fixture: 'emptyOmdbResponse'}).as('emptyOmdbCall') 

        cy.get('input#searchText').type(' ').should('have.value', ' ');
        cy.get('button#search').should('exist');

        cy.get('form#searchForm').submit();

        cy.wait('@emptyOmdbCall');

        cy.get('p').should('contain.text', 'Inga sökresultat att visa');
    });

    it('should create the correct error message if input is empty', () => {
        cy.intercept('GET', 'http://omdbapi.com/?apikey=416ed51a&s=*', {
        fixture: 'emptyOmdbResponse'}).as('emptyOmdbCall')
        
        cy.get('form#searchForm').submit();

        cy.wait('@emptyOmdbCall');

        cy.get('p').should('contain.text', 'Inga sökresultat att visa');
    });
});

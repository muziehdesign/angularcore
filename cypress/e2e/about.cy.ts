describe('about', ()=>{
    it('displays', ()=>{
        cy.visit('/');
        cy.get('h1').should('contain.text', 'About');
    });
});
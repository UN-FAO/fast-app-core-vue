describe('Send Submissions', function () {
  it('Sends every submission', function () {
    cy.visit('http://localhost:8080/')
    cy.contains('Version')
    // Fills the new user information
    cy.get('input[name="Email"]')
      .type('cabrerabywaters@gmail.com')
      .should('have.value', 'cabrerabywaters@gmail.com')
    cy.get('input[name="password"]')
      .type('cabrerabywaters@gmail.com')
      .should('have.value', 'cabrerabywaters@gmail.com')
    // Click Registe
    cy.get('input[name="LOGIN"]')
      .click()
    // Redirect the user to login
    cy.url().should('include', '/dashboard')
    cy.contains('Start survey')
    cy.contains('Collected Data').click({ force: true })
    cy.contains('Uganda Final version').click()
  })
})

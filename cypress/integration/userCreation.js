describe('New user creation', function () {
  it('Creates a new user', function () {
    cy.visit('http://localhost:8080/')
    cy.contains('Version')
    // Clicks the new user link
    cy.contains('New user?').click({ force: true })
    cy.contains('Back to login')
    // Fills the new user information
    cy.get('input[name="data[email]"]')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
    cy.get('input[name="data[password]"]')
      .type('123')
      .should('have.value', '123')
    // Click Register
    cy.get('button[name="data[submit]"]')
      .click()
    // Redirect the user to login
    cy.url().should('include', '/login')
    cy.contains('Version')
  })
})


describe('Create new user', function() {
	it('Visits login page', function() {
    	cy.visit('http://localhost:8080/')
    	cy.contains('Version')
  	})
	it('Clicks the new user link', function() {
    	cy.contains('New user ?').click({force:true})
   	 	cy.contains('Register')
 	})
 	it('Fills the new user information', function() {
    	cy.get('input[name="data[email]"]')
      	.type('fake@email.com')
      	.should('have.value', 'fake@email.com')
      	cy.get('input[name="data[password]"]')
      	.type('123')
      	.should('have.value', '123')
 	})	
 	it('Click Register', function() {
    	cy.get('button[name="data[submit]"]')
      	.click()
 	})
 	it('Click confirmation message', function() {
    	cy.contains('Are you sure?')
    	cy.contains('Yes, send it!').click()
 	})
 	it('Send the submition for new User', function() {
    	cy.contains('Sent!')
    	cy.contains('OK').click()
 	})
 	it('Redirect the user to login', function() {
    	cy.url().should('include', '/login')
    	cy.contains('Version')
 	})
})


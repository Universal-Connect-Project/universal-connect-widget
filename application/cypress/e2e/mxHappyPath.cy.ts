describe('Should connect to an Institution through happy path', () => {
  before(() => {
    cy.setAuthCode()
  })
  it('Connects to MX Bank', () => {
    const authCode = Cypress.env("authCode")
    cy.visit(`http://localhost:8080/?job_type=agg&auth=${authCode}`)
    cy.get('#mx-connect-search').type('MX Bank')
    cy.get(`button[aria-label*="Add account with MX Bank"]`).first().click()
    cy.get('#LOGIN').type('mxuser')
    cy.get('#PASSWORD').type('correct')
    cy.get('button[data-test="connect-credentials-button"').click()
    cy.wait(10000).then(() => {
      cy.contains('Connected').should('be.visible')
    })
  })
})

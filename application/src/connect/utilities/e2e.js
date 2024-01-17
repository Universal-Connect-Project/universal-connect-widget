/**
 * @description see https://docs.cypress.io/faq/questions/using-cypress-faq#Is-there-any-way-to-detect-if-my-app-is-running-under-Cypress
 * @returns boolean - true if running e2e test
 */
export const isRunningE2ETests = () => {
  // If Cypress is defined on the window it's safe to assume we're running tests.
  return Boolean(window?.Cypress)
}

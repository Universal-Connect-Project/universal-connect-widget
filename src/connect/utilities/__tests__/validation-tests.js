import validation from '../../../connect/utilities/validation.js'

describe('Validation Util Tests', () => {
  it('Pattern Digits', () => {
    const formSchema = {
      testNumber: {
        label: 'Test number',
        pattern: 'digits',
      },
    }
    const test1 = validation.validate(formSchema, { testNumber: 1 })
    const test2 = validation.validate(formSchema, { testNumber: 1.5 })

    expect(test1).toEqual(null)
    expect(test2).toEqual({ testNumber: 'Test number must only contain digits' })
  })
  it('Pattern Number', () => {
    const formSchema = {
      testNumber: {
        label: 'Test number',
        pattern: 'number',
      },
    }
    const test1 = validation.validate(formSchema, { testNumber: 1.5 })
    const test2 = validation.validate(formSchema, { testNumber: '1' })

    expect(test1).toEqual(null)
    expect(test2).toEqual(null)
  })
  it('Pattern Money', () => {
    const formSchema = {
      balance: {
        label: 'Balance',
        pattern: 'money',
      },
    }
    const test1 = validation.validate(formSchema, { balance: 1 })
    const test2 = validation.validate(formSchema, { balance: '$1.50' })

    expect(test1).toEqual(null)
    expect(test2).toEqual({ balance: 'Balance is invalid' })
  })
  it('Pattern Email', () => {
    const formSchema = {
      email: {
        label: 'Email',
        pattern: 'email',
      },
    }
    const test1 = validation.validate(formSchema, { email: 'username@email' })
    const test2 = validation.validate(formSchema, { email: 'username@email.com' })

    expect(test1).toEqual({ email: 'Email must be a valid email' })
    expect(test2).toEqual(null)
  })
})

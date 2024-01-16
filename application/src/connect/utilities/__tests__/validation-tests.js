import validation from 'src/connect/utilities/validation.js'

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
  it('Pattern Required', () => {
    const formSchema = {
      email: {
        label: 'Email',
        required: true,
      },
    }
    const test1 = validation.validate(formSchema, { email: 'testemail@mx.com' })
    const test2 = validation.validate(formSchema, { email: null })

    expect(test1).toEqual(null)
    expect(test2).toEqual({ email: 'Email is required' })
  })
  it('Pattern Min', () => {
    const formSchema = {
      balance: {
        label: 'Balance',
        min: 2,
      },
    }
    const test1 = validation.validate(formSchema, { balance: 3 })
    const test2 = validation.validate(formSchema, { balance: 0 })

    expect(test1).toEqual(null)
    expect(test2).toEqual({
      balance: `${formSchema.balance.label} must be greater than or equal to ${formSchema.balance.min}`,
    })
  })
  it('Pattern Max', () => {
    const formSchema = {
      balance: {
        label: 'Balance',
        max: 2,
      },
    }
    const test1 = validation.validate(formSchema, { balance: 3 })
    const test2 = validation.validate(formSchema, { balance: 1 })

    expect(test1).toEqual({
      balance: `${formSchema.balance.label} must be less than or equal to ${formSchema.balance.max}`,
    })
    expect(test2).toEqual(null)
  })
})

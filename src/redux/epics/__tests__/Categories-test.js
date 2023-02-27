import FireflyAPI from '../../../utils/FireflyAPI'

import { of, throwError } from 'rxjs'
import { expectRx } from '../../../utils/Test'

import { ActionTypes } from '../../actions/Categories'
import * as actions from '../../actions/Categories'
import * as epics from '../../epics/Categories'

describe('A Category', () => {
  beforeEach(() => {
    FireflyAPI.deleteCategory = jest.fn(() => of('SUCCESS'))
    FireflyAPI.saveCategory = jest.fn(() => of('SUCCESS'))
    FireflyAPI.updateCategory = jest.fn(() => of('SUCCESS'))
  })

  afterEach(() => {
    FireflyAPI.deleteCategory.mockClear()
    FireflyAPI.saveCategory.mockClear()
    FireflyAPI.loadCategories.mockClear()
    FireflyAPI.updateCategory.mockClear()
  })

  describe('loadCategories', () => {
    it('should load categories', () => {
      FireflyAPI.loadCategories = jest.fn(() => of(['test', 'test1']))
      expect.assertions(2)
      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.loadCategories() })

        expectObservable(epics.loadCategories(input$)).toBe('a', {
          a: { type: ActionTypes.CATEGORIES_LOADED, payload: { items: ['test', 'test1'] } },
        })
      })

      expect(FireflyAPI.loadCategories).toHaveBeenCalled()
    })

    it('should try to load empty categories', () => {
      expect.assertions(2)
      FireflyAPI.loadCategories = jest.fn(() => of([]))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.loadCategories() })

        expectObservable(epics.loadCategories(input$)).toBe('a', {
          a: { type: ActionTypes.LOAD_CATEGORIES_ERROR },
        })
      })

      expect(FireflyAPI.loadCategories).toHaveBeenCalled()
    })

    it('should emit LOAD_CATEGORIES_NO_CHANGE if a 304 happens', () => {
      expect.assertions(1)
      FireflyAPI.loadCategories = jest.fn(() => throwError({ response: { status: 304 } }))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const actions$ = hot('a', { a: actions.loadCategories() })

        expectObservable(epics.loadCategories(actions$)).toBe('b', {
          b: { type: ActionTypes.LOAD_CATEGORIES_NO_CHANGE },
        })
      })
    })

    it('should emit LOAD_CATEGORIES_NO_ERROR if an error happens', () => {
      expect.assertions(1)
      FireflyAPI.loadCategories = jest.fn(() => throwError({ response: { status: 500 } }))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const actions$ = hot('a', { a: actions.loadCategories() })

        expectObservable(epics.loadCategories(actions$)).toBe('b', {
          b: { type: ActionTypes.LOAD_CATEGORIES_ERROR },
        })
      })
    })
  })

  it('should delete a category', () => {
    expect.assertions(2)

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.deleteCategory() })

      expectObservable(epics.deleteCategory(input$)).toBe('a', {
        a: { type: ActionTypes.CATEGORY_DELETED },
      })
    })

    expect(FireflyAPI.deleteCategory).toHaveBeenCalled()
  })

  it('should try to delete a category', () => {
    expect.assertions(2)
    FireflyAPI.deleteCategory = jest.fn(() => throwError('FAIL'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.deleteCategory() })

      expectObservable(epics.deleteCategory(input$)).toBe('a', {
        a: { type: ActionTypes.CATEGORY_DELETED_ERROR },
      })
    })

    expect(FireflyAPI.deleteCategory).toHaveBeenCalled()
  })

  it('should save a category', () => {
    expect.assertions(2)

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.saveCategory() })

      expectObservable(epics.saveCategory(input$)).toBe('a', {
        a: { type: ActionTypes.CATEGORY_SAVED },
      })
    })

    expect(FireflyAPI.saveCategory).toHaveBeenCalled()
  })

  it('should try to save a category', () => {
    expect.assertions(2)
    FireflyAPI.saveCategory = jest.fn(() => throwError('FAIL'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.saveCategory() })

      expectObservable(epics.saveCategory(input$)).toBe('a', {
        a: { type: ActionTypes.CATEGORY_SAVED_ERROR },
      })
    })

    expect(FireflyAPI.saveCategory).toHaveBeenCalled()
  })

  it('should successfully update a category', () => {
    expect.assertions(2)

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.editCategory() })

      expectObservable(epics.editCategory(input$)).toBe('a', {
        a: { type: ActionTypes.CATEGORY_EDIT_SUCCESS },
      })
    })

    expect(FireflyAPI.updateCategory).toHaveBeenCalled()
  })

  it('should throw an error when there is an error updating a category', () => {
    expect.assertions(2)
    FireflyAPI.updateCategory = jest.fn(() => throwError('FAIL'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.editCategory() })

      expectObservable(epics.editCategory(input$)).toBe('a', {
        a: { type: ActionTypes.CATEGORY_EDIT_ERROR },
      })
    })

    expect(FireflyAPI.updateCategory).toHaveBeenCalled()
  })
})

import { shouldUpdateItem, upsertItem } from 'utils/Reducer'

describe('Reducer utility functions', () => {
  describe('shouldUpdateItem', () => {
    it("returns true when the item's revision is NOT outdated", () => {
      expect(shouldUpdateItem({ revision: 1 }, { revision: 2 })).toBe(true)
    })

    it('returns true when the item is the same revision', () => {
      expect(shouldUpdateItem({ revision: 1 }, { revision: 1 })).toBe(true)
    })

    it("returns false when the item's revision is outdated", () => {
      expect(shouldUpdateItem({ revision: 2 }, { revision: 1 })).toBe(false)
    })
  })

  describe('upsertItem', () => {
    it('inserts a new item when it does not already exist', () => {
      const item = { guid: 'a', revision: 1 }
      const newItem = { guid: 'b', revision: 1 }
      const state = { items: [item] }
      const expectedState = { items: [item, newItem] }

      expect(upsertItem(state, newItem)).toEqual(expectedState)
    })

    it('updates an existing item when it has a new revision', () => {
      const itemA = { guid: 'a', old: 'foo', revision: 1 }
      const itemB = { guid: 'b', revision: 1 }
      const itemAUpdate = { guid: 'a', new: 'bar', revision: 2 } // new revision, ok
      // the update should merge instead of clobber
      const newItemA = { ...itemA, ...itemAUpdate }
      const state = { items: [itemA, itemB] }
      const expectedState = { items: [newItemA, itemB] }

      expect(upsertItem(state, itemAUpdate)).toEqual(expectedState)
    })

    it('ignores updates to an existing item when it has an outdated revision', () => {
      const itemA = { guid: 'a', revision: 2 }
      const itemB = { guid: 'b', revision: 1 }
      const newItemA = { guid: 'a', revision: 1 } // old revision, ignore
      const state = { items: [itemA, itemB] }

      expect(upsertItem(state, newItemA)).toEqual(state)
    })

    it('should update if both the new and old item have no revision', () => {
      const itemA = { guid: 'a', name: 'shib' }
      const newItemA = { guid: 'a', name: 'shibby' }
      const state = { items: [itemA] }

      expect(upsertItem(state, newItemA)).toEqual({
        items: [newItemA],
      })
    })

    it('should update if the old has no revision but the new one does', () => {
      const itemA = { guid: 'a', name: 'foo' }
      const newItemA = { guid: 'a', revision: 1, name: 'bar' }
      const state = { items: [itemA] }

      expect(upsertItem(state, newItemA)).toEqual({
        items: [newItemA],
      })
    })

    it('ignores the update if the old has a revision and the new one doesnt', () => {
      const itemA = { guid: 'a', revision: 1, name: 'bar' }
      const newItemA = { guid: 'a', name: 'foo' }
      const state = { items: [itemA] }

      expect(upsertItem(state, newItemA)).toEqual({
        items: [itemA],
      })
    })

    it('should merge item values if same revision', () => {
      const itemA = { guid: 'a', revision: 1, age: 30 }
      const newItemA = { guid: 'a', revision: 1, name: 'Sam' }

      const state = { items: [itemA] }

      expect(upsertItem(state, newItemA)).toEqual({
        items: [{ guid: 'a', name: 'Sam', revision: 1, age: 30 }],
      })
    })
  })
})

export class StorageConflictError extends Error {
  constructor() {
    super('The saved plan changed in another tab. Reload it before saving.');
    this.name = 'StorageConflictError';
  }
}

/**
 * A browser-local plan store that compares the last observed raw value before
 * changing it. Construction does not read or change storage. Call load() to
 * intentionally adopt an existing saved record before replacing it.
 */
export function createPlanStore(storage, key = 'nr-plan-v1') {
  let snapshot = null;

  return {
    load() {
      const raw = storage.getItem(key);
      snapshot = raw;
      return raw;
    },

    save(envelope) {
      const raw = JSON.stringify(envelope);
      if (typeof raw !== 'string') {
        throw new TypeError('The plan must have a JSON representation.');
      }
      if (storage.getItem(key) !== snapshot) {
        throw new StorageConflictError();
      }
      storage.setItem(key, raw);
      snapshot = raw;
      return raw;
    },

    forget() {
      const current = storage.getItem(key);
      if (current !== snapshot) {
        snapshot = null;
        return { removed: false, conflict: true };
      }
      if (snapshot === null) {
        return { removed: false, conflict: false };
      }
      storage.removeItem(key);
      snapshot = null;
      return { removed: true, conflict: false };
    }
  };
}

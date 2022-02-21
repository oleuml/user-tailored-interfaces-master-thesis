import { browser } from '$app/env';
import { writable } from 'svelte/store';

export const goneToTaskStore = () => {
  const lsGoneID = 'goneToTaskStore';

  let initialValue: boolean;
  if (browser) {
    let storedValue = localStorage.getItem(lsGoneID);
    if (storedValue !== undefined && storedValue !== null) {
      try {
        initialValue = JSON.parse(storedValue);
      } catch (e) {
        throw new Error('goneToTaskStore on localStorage can not be parsed to boolean');
      }
      if (typeof initialValue !== 'boolean') {
        throw new Error('goneToTaskStore on localStorage is not a boolean');
      }
    } else initialValue = false;
  }

  const { subscribe, set, update } = writable(initialValue);

  subscribe((value) => {
    if (browser) {
      localStorage.setItem(lsGoneID, JSON.stringify(value));
    }
  });
  return {
    subscribe,
    set,
    update
  };
};

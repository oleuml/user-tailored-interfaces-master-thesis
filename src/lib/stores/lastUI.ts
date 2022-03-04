import { browser } from '$app/env';
import { writable } from 'svelte/store';

export const lastUIStore = () => {
  const lsGoneID = 'lastUI';

  let initialValue: number;
  if (browser) {
    let storedValue = localStorage.getItem(lsGoneID);
    if (storedValue !== undefined && storedValue !== null) {
      try {
        initialValue = JSON.parse(storedValue);
      } catch (e) {
        throw new Error('lastUI on localStorage can not be parsed to number');
      }
      if (typeof initialValue !== 'number') {
        throw new Error('lastUI on localStorage is not a number');
      }
    } else initialValue = -1;
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

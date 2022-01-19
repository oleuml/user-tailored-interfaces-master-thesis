import { browser } from '$app/env';
import { writable } from 'svelte/store';

let task0Stored
if (browser) {
  task0Stored = localStorage.getItem('task0');
}
else {
  task0Stored = null
}
let initialValue;
if (task0Stored === null) {
  initialValue = {};
}
else {
  try {
    initialValue = JSON.parse(task0Stored);
  } catch (e) {
    initialValue = {};
  }
}
if (initialValue === null)
  initialValue = {};

export const task0 = writable(initialValue);
task0.subscribe((value) => {
  if (browser) {
    localStorage.setItem('task0', JSON.stringify(value));
  }
});

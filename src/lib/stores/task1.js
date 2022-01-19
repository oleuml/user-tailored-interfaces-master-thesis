import { browser } from '$app/env';
import { writable } from 'svelte/store';

let task1Stored
if (browser) {
  task1Stored = localStorage.getItem('task1');
}
else {
  task1Stored = null
}
let initialValue;
if (task1Stored === null) {
  initialValue = {};
}
else {
  try {
    initialValue = JSON.parse(task1Stored);
  } catch (e) {
    initialValue = {};
  }
}
if (initialValue === null)
  initialValue = {};

export const task1 = writable(initialValue);
task1.subscribe((value) => {
  if (browser) {
    localStorage.setItem('task1', JSON.stringify(value));
  }
});

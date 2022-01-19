import { browser } from '$app/env';
import { writable } from 'svelte/store';

let task2Stored
if (browser) {
  task2Stored = localStorage.getItem('task2');
}
else {
  task2Stored = null
}
let initialValue;
if (task2Stored === null) {
  initialValue = {};
}
else {
  try {
    initialValue = JSON.parse(task2Stored);
  } catch (e) {
    initialValue = {};
  }
}
if (initialValue === null)
  initialValue = {};

export const task2 = writable(initialValue);
task2.subscribe((value) => {
  if (browser) {
    localStorage.setItem('task2', JSON.stringify(value));
  }
});

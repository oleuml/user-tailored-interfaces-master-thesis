import { browser } from '$app/env';
import { writable } from 'svelte/store';

let task3Stored
if (browser) {
  task3Stored = localStorage.getItem('task3');
}
else {
  task3Stored = null
}
let initialValue;
if (task3Stored === null) {
  initialValue = {};
}
else {
  try {
    initialValue = JSON.parse(task3Stored);
  } catch (e) {
    initialValue = {};
  }
}
if (initialValue === null)
  initialValue = {};

export const task3 = writable(initialValue);
task3.subscribe((value) => {
  if (browser) {
    localStorage.setItem('task3', JSON.stringify(value));
  }
});

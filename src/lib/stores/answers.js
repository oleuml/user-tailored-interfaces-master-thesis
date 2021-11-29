import { browser } from '$app/env';
import { writable } from 'svelte/store';


let answersStored
if (browser) {
  answersStored = localStorage.getItem('answers');
}
else {
  answersStored = null
}
let initialValue;
if (answersStored === null) {
  initialValue = {};
}
else {
  try {
    initialValue = JSON.parse(answersStored);
  } catch (e) {
    initialValue = {};
  }
}
if (initialValue === null)
  initialValue = {};

export const answers = writable(initialValue);
if (browser) {
  answers.subscribe((value) => {
    localStorage.setItem('answers', JSON.stringify(value));
  });
}
import { browser } from '$app/env';
import type { Question, QuestionType } from '$lib/blocks';
import { writable } from 'svelte/store';

export const questionAnswered = (questionType: QuestionType, answer: object | object[]) => {
  switch (questionType) {
    case 'group-likert':
      if (Array.isArray(answer)) {
        return answer.reduce((prev, curr) => curr !== null && prev, true);
      } else if (answer === undefined) {
        return false;
      } else {
        throw new Error('group-likert questions need string[] as answers');
      }
    case 'likert':
      return answer !== null;
    case 'likert-vertical':
      return answer !== null;
    case 'single-choice':
      return answer !== null;
    case 'multiple-choice':
      if (Array.isArray(answer)) {
        return !answer.reduce((prev, curr) => curr === null && prev, true);
      } else if (answer === undefined) {
        return false;
      } else {
        throw new Error('multiple choice questions need string[] as answers');
      }
    case 'text':
      return true;
    default:
      return true;
  }
};

export const checkAllFulfilled = (questions: Question[], answers: object) => {
  return questions
    .map((q) => questionAnswered(q.type, answers[q.id]))
    .reduce((prev, curr) => prev && curr, true);
};

export const answerStore = (pageId: number) => {
  const lsAnswerID = `answers-${pageId}`;
  let initialValue: object;
  if (browser) {
    initialValue = JSON.parse(localStorage.getItem(lsAnswerID));
    if (initialValue === null || initialValue === undefined) initialValue = {};
  } else {
    initialValue = {};
  }
  const { subscribe, set, update } = writable(initialValue);
  subscribe((value) => {
    if (browser) {
      localStorage.setItem(lsAnswerID, JSON.stringify(value));
    }
  });

  return {
    subscribe,
    set,
    update,
    send: (questions: Question[]) => {
      let answers;
      subscribe((value) => {
        answers = value;
      })();

      let check = checkAllFulfilled(questions, answers);
      if (check) {
        // Submit data
        let responses: Response[] = [];
        Object.entries(answers).forEach(async ([key, value]) => {
          responses.push(
            await fetch(`/api/submit/answers/${key}`, {
              method: 'POST',
              body: JSON.stringify(value),
              headers: { 'Content-Type': 'application/json' }
            })
          );
        });
        if (responses.filter((res) => !res.ok || res.status !== 400).length === 0) {
          set(undefined);
          localStorage.removeItem(lsAnswerID);
        }
      }
      return check;
    }
  };
};

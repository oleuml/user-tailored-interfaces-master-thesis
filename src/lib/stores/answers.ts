import { browser } from '$app/env';
import type { Question, QuestionType } from '$lib/blocks';
import _ from 'lodash';
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

export const resendFailedAnswerSendings = async (numPages: number) => {
  for (let page = 0; page < numPages; page++) {
    const lsAnswerID = `answers-${page}`;
    const answers = JSON.parse(localStorage.getItem(lsAnswerID));
    if (answers === undefined || answers === null) {
      continue;
    }
    let submitted = await submit(answers);
    if (submitted) {
      localStorage.removeItem(lsAnswerID);
    }
    return submitted;
  }
};

export const submit = async (answers: any): Promise<boolean> => {
  if (answers === null) {
    return false;
  }
  let submitted: boolean[] = Object.entries(answers).map((_) => false);
  if (submitted.length === 0) return true;

  return Object.entries(answers)
    .map(async ([key, value]) => {
      try {
        const res = await fetch(`/api/submit/answers/${key}`, {
          method: 'POST',
          body: JSON.stringify(value),
          headers: { 'Content-Type': 'application/json' }
        });
        return res.ok || res.status === 400;
      } catch {
        return false;
      }
    })
    .reduce(async (a, b) => (await a) && (await b));
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
    send: async (questions: Question[]) => {
      let answers;
      subscribe((value) => {
        answers = value;
      })();

      let check = checkAllFulfilled(questions, answers);
      if (check) {
        const submitted = await submit(answers);
        if (submitted) {
          set(undefined);
          localStorage.removeItem(lsAnswerID);
        }
      }
      return check;
    }
  };
};

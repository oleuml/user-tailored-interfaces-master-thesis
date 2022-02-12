import { browser } from '$app/env';
import type { Condition, Exercise } from '$lib/exercises';
import type { Member } from '$lib/members';
import { writable } from 'svelte/store';

export type Action =
  | 'alert'
  | 'start'
  | 'end'
  | 'fulfilled'
  | 'send'
  | 'touchevent'
  | 'scroll'
  | 'restart'
  | 'open-group'
  | 'close-group'
  | 'select'
  | 'deselect'
  | 'select-group'
  | 'deselect-group'
  | 'select-defaults'
  | 'change-threshold'
  | 'change-threshold-group'
  | 'change-score'
  | 'select-all'
  | 'deselect-all'
  | 'open-modal'
  | 'close-modal';

export type TrackingData = {
  ui: number;
  taskid: number;
  action: Action;
  data?: any;
  timestamp: number;
};

export const taskTrackingStore = (
  ui: number,
  task: Exercise,
  members: Array<Member>,
  conditionChecker: (
    condition: Condition,
    members: Array<Member>,
    conditionBody?: object
  ) => boolean
) => {
  let localStored: null | string;
  let localStoredStarted: boolean = false;
  let localStoredSent: boolean = false;
  let localStoredFulfilled: boolean = false;
  let localStoredMembers: Array<Member> = [];
  if (browser) {
    localStored = localStorage.getItem(`U${ui}-T${task.id}`);
    localStoredStarted = JSON.parse(localStorage.getItem(`U${ui}-T${task.id}-started`));
    localStoredSent = JSON.parse(localStorage.getItem(`U${ui}-T${task.id}-sent`));
    localStoredFulfilled = JSON.parse(localStorage.getItem(`U${ui}-T${task.id}-fulfilled`));
    localStoredMembers = JSON.parse(localStorage.getItem(`U${ui}-T${task.id}-members`));
    if (typeof localStoredStarted !== 'boolean') {
      localStoredStarted = false;
      localStorage.setItem(`U${ui}-T${task.id}-started`, `${localStoredStarted}`);
    }
    if (typeof localStoredSent !== 'boolean') {
      localStoredSent = false;
      localStorage.setItem(`U${ui}-T${task.id}-sent`, `${localStoredSent}`);
    }
    if (typeof localStoredFulfilled !== 'boolean') {
      localStoredFulfilled = false;
      localStorage.setItem(`U${ui}-T${task.id}-fulfilled`, `${localStoredFulfilled}`);
    }
    if (localStoredMembers === undefined || localStoredMembers === null) {
      localStoredMembers = members;
    }
  } else {
    localStored = null;
  }
  let initialValue: object;
  if (localStored === null) {
    initialValue = [];
  } else {
    try {
      initialValue = JSON.parse(localStored);
    } catch (e) {
      initialValue = [];
    }
  }
  if (initialValue === null) initialValue = [];

  const { update: updateWritable, subscribe: subscribeWritable } = writable(
    initialValue as TrackingData[]
  );
  const startedStore = writable(localStoredStarted);
  const sentStore = writable(localStoredSent);
  const fulfilledStore = writable(localStoredFulfilled);
  const memberStore = writable(localStoredMembers);

  subscribeWritable((value) => {
    if (browser) {
      localStorage.setItem(`U${ui}-T${task.id}`, JSON.stringify(value));
    }
  });

  startedStore.subscribe((value) => {
    if (browser) {
      localStorage.setItem(`U${ui}-T${task.id}-started`, JSON.stringify(value));
    }
  });

  sentStore.subscribe((value) => {
    if (browser) {
      localStorage.setItem(`U${ui}-T${task.id}-sent`, JSON.stringify(value));
    }
  });

  fulfilledStore.subscribe((value) => {
    if (browser) {
      localStorage.setItem(`U${ui}-T${task.id}-fulfilled`, JSON.stringify(value));
    }
  });

  memberStore.subscribe((value) => {
    if (browser) {
      localStorage.setItem(`U${ui}-T${task.id}-members`, JSON.stringify(value));
    }
  });

  return {
    add: (action: Action, data?: any) => {
      let value: TrackingData = {
        ui: ui,
        taskid: task.id,
        action: action,
        data: data,
        timestamp: Date.now()
      };

      updateWritable((table) => {
        table.push(value);
        return table;
      });
    },
    start: () => {
      let started: boolean;
      startedStore.subscribe((value) => (started = value))();
      if (started) {
        throw new Error(`Task ${task.id} in user interface ${ui} already started!`);
      }
      startedStore.set(true);
      updateWritable((table) => {
        let value: TrackingData = {
          ui: ui,
          taskid: task.id,
          action: 'start',
          timestamp: Date.now()
        };
        table.push(value);
        return table;
      });
    },
    restart: () => {
      startedStore.set(true);
      sentStore.set(false);
      updateWritable((table) => {
        let value: TrackingData = {
          ui: ui,
          taskid: task.id,
          action: 'restart',
          timestamp: Date.now()
        };
        table.push(value);
        return table;
      });
    },
    send: () => {
      sentStore.set(true);
      if (browser) {
        localStorage.setItem(`U${ui}-T${task.id}-sent`, `true`);
      }
      updateWritable((table) => {
        let value: TrackingData = {
          ui: ui,
          taskid: task.id,
          action: 'send',
          timestamp: Date.now()
        };
        table.push(value);
        return table;
      });
      // Check task finished (task condition fulfilled)
      let members: Array<Member>;
      memberStore.subscribe((value) => (members = value))();
      if (conditionChecker(task.condition, members, task.conditionBody)) {
        fulfilledStore.set(true);
        updateWritable((table) => {
          let value: TrackingData = {
            ui: ui,
            taskid: task.id,
            action: 'fulfilled',
            timestamp: Date.now()
          };
          table.push(value);
          return table;
        });
        // TODO: Probably push data directly and clear localStorage and store.
      }
    },
    started: startedStore,
    fulfilled: fulfilledStore,
    sent: sentStore,
    members: memberStore
  };
};

export const activeExerciseStore = (ui: number, value: number) => {
  let init: number = value;
  if (browser) {
    init = JSON.parse(localStorage.getItem(`UI-${ui}-selected`));
    if (init === undefined || init === null) {
      init = value;
      localStorage.setItem(`UI-${ui}-selected`, `${init}`);
    }
  }
  const store = writable(init);
  store.subscribe((value) => {
    if (browser) {
      localStorage.setItem(`UI-${ui}-selected`, `${value}`);
    }
  });
  return store;
};

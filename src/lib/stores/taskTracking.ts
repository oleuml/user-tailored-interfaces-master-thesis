import { browser } from '$app/env';
import type { Condition, Exercise } from '$lib/exercises';
import type { Member } from '$lib/members';
import { Writable, writable } from 'svelte/store';

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
  | 'close-modal'
  | 'search-filter';

export type TaskTrackingStore = {
  add: (action: Action, data?: any) => void;
  start: () => void;
  restart: () => void;
  send: () => Promise<void>;
  started: Writable<boolean>;
  fulfilled: Writable<boolean>;
  sent: Writable<boolean>;
  members: Writable<Member[]>;
};
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
  members: Member[],
  conditionChecker: (condition: Condition, members: Member[], conditionBody?: object) => boolean
): TaskTrackingStore => {
  let localStoredTracking: null | string;
  let localStoredStarted: boolean = false;
  let localStoredSent: boolean = false;
  let localStoredFulfilled: boolean = false;
  let localStoredMembers: Member[] = [];

  const lsTrackingID = `U${ui}-T${task.id}-tracking`;
  const lsStartedID = `U${ui}-T${task.id}-started`;
  const lsSentID = `U${ui}-T${task.id}-sent`;
  const lsFulfilledID = `U${ui}-T${task.id}-fulfilled`;
  const lsMembersID = `U${ui}-T${task.id}-members`;

  if (browser) {
    localStoredTracking = localStorage.getItem(lsTrackingID);
    localStoredStarted = JSON.parse(localStorage.getItem(lsStartedID));
    localStoredSent = JSON.parse(localStorage.getItem(lsSentID));
    localStoredFulfilled = JSON.parse(localStorage.getItem(lsFulfilledID));
    localStoredMembers = JSON.parse(localStorage.getItem(lsMembersID));
    if (typeof localStoredStarted !== 'boolean') {
      localStoredStarted = false;
      localStorage.setItem(lsStartedID, `${localStoredStarted}`);
    }
    if (typeof localStoredSent !== 'boolean') {
      localStoredSent = false;
      localStorage.setItem(lsSentID, `${localStoredSent}`);
    }
    if (typeof localStoredFulfilled !== 'boolean') {
      localStoredFulfilled = false;
      localStorage.setItem(lsFulfilledID, `${localStoredFulfilled}`);
    }
    if (localStoredMembers === undefined || localStoredMembers === null) {
      localStoredMembers = members;
    }
  } else {
    localStoredTracking = null;
  }
  let initialValue: object;
  if (localStoredTracking === null) {
    initialValue = [];
  } else {
    try {
      initialValue = JSON.parse(localStoredTracking);
    } catch (e) {
      initialValue = [];
    }
  }
  if (initialValue === null) initialValue = [];

  const trackingStore = writable(initialValue as TrackingData[]);
  const startedStore = writable(localStoredStarted);
  const sentStore = writable(localStoredSent);
  const fulfilledStore = writable(localStoredFulfilled);
  const memberStore = writable(localStoredMembers);

  const unsubscribeTrackingStore = trackingStore.subscribe((value) => {
    if (browser) {
      localStorage.setItem(lsTrackingID, JSON.stringify(value));
    }
  });

  const unsubscribeStartedStore = startedStore.subscribe((value) => {
    if (browser) {
      localStorage.setItem(lsStartedID, JSON.stringify(value));
    }
  });

  sentStore.subscribe((value) => {
    if (browser) {
      localStorage.setItem(lsSentID, JSON.stringify(value));
    }
  });

  fulfilledStore.subscribe((value) => {
    if (browser) {
      localStorage.setItem(lsFulfilledID, JSON.stringify(value));
    }
  });

  const unsubscribeMemberStore = memberStore.subscribe((value) => {
    if (browser) {
      localStorage.setItem(lsMembersID, JSON.stringify(value));
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

      trackingStore.update((table) => {
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
      trackingStore.update((table) => {
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
      trackingStore.update((table) => {
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
    send: async () => {
      sentStore.set(true);
      trackingStore.update((table) => {
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
      let members: Member[];
      memberStore.subscribe((value) => (members = value))();
      if (conditionChecker(task.condition, members, task.conditionBody)) {
        fulfilledStore.set(true);
        trackingStore.update((table) => {
          let value: TrackingData = {
            ui: ui,
            taskid: task.id,
            action: 'fulfilled',
            timestamp: Date.now()
          };
          table.push(value);
          return table;
        });

        let trackingData: TrackingData[];
        trackingStore.subscribe((value) => (trackingData = value))();
        let data = {
          members: members,
          tracking: trackingData
        };
        let response = await fetch(`/api/submit/tasks/${ui}/${task.id}`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' }
        });

        // Clear localStorage and store if response ok.
        if (response.ok) {
          unsubscribeMemberStore();
          unsubscribeStartedStore();
          unsubscribeTrackingStore();

          trackingStore.set(undefined);
          startedStore.set(undefined);
          memberStore.set(undefined);

          localStorage.removeItem(lsMembersID);
          localStorage.removeItem(lsStartedID);
          localStorage.removeItem(lsTrackingID);
        }
        // TODO: if (!response.ok) retry() // when to start retry?
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

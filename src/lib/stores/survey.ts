import { browser } from '$app/env';
import { Block, type BlockData, type BlockInterface } from '$lib/blocks';
import { get, writable } from 'svelte/store';
import structure from '$lib/data/structure.json';

enum ID {
  SURVEY = 'current-survey-page'
}

// Loads the study based on the permutation seed and
// Jumps to the position which is stored in the localStorage.
export const blockStore = (permutationSeed: string) => {
  const blocks = Block.loadFrom(structure as unknown as BlockInterface, null, permutationSeed);

  let nextCount = 0;
  if (browser) {
    nextCount = JSON.parse(localStorage.getItem(ID.SURVEY));
    if (typeof nextCount !== 'number') {
      nextCount = 0;
      localStorage.setItem(ID.SURVEY, `${nextCount}`);
    }
  }

  const json = writable<BlockData>();
  const current = writable<BlockInterface>(blocks.next());

  current.subscribe((value: BlockInterface) => {
    json.set(value.json());
  });

  let nextBlock: BlockInterface = get(current);
  for (let currentCount = 0; nextCount > currentCount; currentCount++) {
    nextBlock = nextBlock.next();
  }
  current.set(nextBlock);

  const position = writable<number>(nextCount);
  position.subscribe((value) => {
    if (browser) {
      localStorage.setItem(ID.SURVEY, JSON.stringify(value));
    }
  });

  let lastAction = 'next';

  const getPage = () => {
    let page: number;
    position.subscribe((value) => (page = value))();
    return page;
  };

  return {
    next: () => {
      if (lastAction === 'previous') current.set(get(current).next());
      lastAction = null;

      let next: BlockInterface = get(current).next();
      if (next === null) return null;
      current.set(next);

      let count: number = get(position) + 1;
      if (0 <= count && count < blocks.length()) position.set(count);
      lastAction = 'next';
    },
    previous: () => {
      if (lastAction === 'next') current.set(get(current).previous());
      lastAction = null;

      let previous: BlockInterface = get(current).previous();
      if (previous === null) return null;
      current.set(previous);

      let count: number = get(position) - 1;
      if (0 <= count && count < blocks.length()) position.set(count);
      lastAction = 'previous';
    },
    subscribe: json.subscribe,
    length: blocks.length(),
    page: getPage
  };
};

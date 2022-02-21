import _ from 'lodash';
import seed from 'seed-random';

export type BlockType = 'normal' | 'permutation' | 'page' | 'jump';

export interface BlockInterface {
  parent: BlockInterface | null;
  readonly type: BlockType;
  next: () => BlockInterface;
  previous: () => BlockInterface;
  length: () => number;
}

export type QuestionType = 'likert' | 'text' | 'group-likert' | 'single-choice';
export type LegendType = 'none' | 'top' | 'top-rotated' | 'bottom' | 'bottom-rotated' | 'start-end';

export type Question = {
  question: string | [string, Array<string>];
  questionPrefix: string;
  type: QuestionType;
  answers: Array<string | Array<string>>;
  legendType: LegendType;
  answer: string | Array<string>;
  unfulfilledAlert: boolean;
  noStatement: boolean;
};

export class Page implements BlockInterface {
  parent: BlockInterface;
  readonly type: BlockType;
  title: string;
  description: string;
  questions: Question[];

  constructor(parent: Block, title: string, questions: Question[], description?: string) {
    this.type = 'page';
    this.parent = parent;
    this.title = title;
    this.description = description;
    this.questions = questions;
  }
  previous = () => {
    return this.parent.previous();
  };

  next = () => {
    return this.parent.next();
  };

  json = () => {
    return {
      type: this.type,
      title: this.title,
      description: this.description,
      questions: this.questions
    };
  };
  length = () => 1;
}

export class Block implements BlockInterface {
  parent: BlockInterface | null;
  readonly type: BlockType;
  private blocks: BlockInterface[];
  private blocksVisited: BlockInterface[];
  private current: BlockInterface;
  private random: () => number;

  constructor(
    parent: Block = null,
    type: 'normal' | 'permutation' = 'normal',
    random: () => number
  ) {
    this.type = type;
    this.parent = parent;
    this.blocks = [];
    this.blocksVisited = [];
    this.current = this;
    this.random = random;

    if (this.type !== 'normal' && this.type !== 'permutation') {
      throw new Error(`Block type must be 'normal' or 'permutation': ${this.type}`);
    }
  }

  static loadFrom = (
    structure: BlockInterface,
    parent: Block = null,
    permutationSeed: string = null
  ): BlockInterface => {
    let newBlock: BlockInterface;

    // If root block
    if (parent === null) {
      let rootType: 'normal' | 'permutation' = 'normal';
      if (structure['type'] !== undefined && structure['type'] !== null) {
        rootType = structure['type'] as 'normal' | 'permutation';
      }
      let random = seed(permutationSeed);
      newBlock = new Block(null, rootType, random);
    } else {
      switch (structure.type) {
        case 'normal':
          newBlock = new Block(parent, 'normal', parent.random);
          break;
        case 'permutation':
          newBlock = new Block(parent, 'permutation', parent.random);
          break;
        case 'page':
          let page = structure as Page;
          newBlock = new Page(parent, page.title, page.questions, page.description);
          break;
        case 'jump':
          let jump = structure as Jump;
          newBlock = new Jump(parent, jump.title, jump.path, jump.description);
          break;

        default:
          throw new Error(`Structure type not implemented: ${structure.type}`);
      }
    }

    if (
      (newBlock.type === 'normal' || newBlock.type === 'permutation') &&
      ((structure as Block).blocks !== undefined ||
        (structure as Block).blocks !== null ||
        (structure as Block).blocks.length > 0)
    ) {
      (structure as Block).blocks.forEach((b) => {
        (newBlock as Block).push(Block.loadFrom(b, newBlock as Block));
      });
    }

    return newBlock;
  };

  private push = (block: BlockInterface) => {
    if (this.type === 'permutation' && this.random() < 0.6) this.blocks.unshift(block);
    else this.blocks.push(block);
  };

  length = (): number => {
    let left = this.blocksVisited.map((b) => b.length()).reduceRight((a, b) => a + b, 0);
    let right = this.blocks.map((b) => b.length()).reduceRight((a, b) => a + b, 0);
    return left + right;
  };

  previous = () => {
    if (this.blocksVisited.length === 0) {
      if (this.parent === null) return null;
      return this.parent.previous();
    }

    let block = this.blocksVisited.pop();
    this.blocks.splice(0, 0, block);
    if (block.type === 'jump' || block.type === 'page') {
      return block;
    } else {
      return block.previous();
    }
  };

  next = () => {
    if (this.blocks.length === 0) {
      if (this.parent === null) return null;
      return this.parent.next();
    }
    this.blocksVisited.push(this.blocks[0]);
    let block = this.blocks.shift();

    if (block.type === 'jump' || block.type === 'page') {
      return block;
    } else {
      return block.next();
    }
  };

  json = () => {
    return {
      type: this.type,
      blocks: this.blocks.map((b) => b.json())
    };
  };
}

export class Jump implements BlockInterface {
  parent: BlockInterface;
  type: BlockType;
  title: string;
  description: string;
  path: string;

  constructor(parent: Block, title: string, path: string, description?: string) {
    this.type = 'jump';
    this.parent = parent;
    this.title = title;
    this.description = description;
    this.path = path;
  }

  previous = () => {
    return this.parent.previous();
  };

  next = () => {
    return this.parent.next();
  };

  json = () => {
    return {
      type: this.type,
      title: this.title,
      description: this.description,
      path: this.path
    };
  };
  length = () => 1;
}

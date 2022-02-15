export type Condition = 'all' | 'nobody' | 'select-one' | 'deselect-one' | 'selection-of-choice';

export type Exercise = {
  id: number;
  title: string;
  description: string;
  condition: Condition;
  conditionBody?: object;
  postImagePath: string;
  postDescription: string;
  riskValue: number;
  preloadMembers?: any;
};

export const checkCondition = (condition: Condition, members: any, conditionBody?: object) => {
  switch (condition) {
    case 'all':
      return members.filter((m) => !m.checked).length === 0;
    case 'nobody':
      return members.filter((m) => m.checked).length === 0;
    case 'select-one':
      throw new Error(`Unimplemented condition check: ${condition}`);
    case 'deselect-one':
      throw new Error(`Unimplemented condition check: ${condition}`);
    case 'selection-of-choice':
      throw new Error(`Unimplemented condition check: ${condition}`);
    default:
      throw new Error(`Unknown condition: ${condition}`);
  }
};

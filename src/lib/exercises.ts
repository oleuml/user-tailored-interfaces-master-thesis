import _ from 'lodash';
import type { Member } from './members';

export type Condition =
  | 'all'
  | 'nobody'
  | 'select-one'
  | 'deselect-one'
  | 'selection-of-choice'
  | 'select-only-one-of-group';

export type Exercise = {
  id: number;
  title: string;
  description: string;
  condition: Condition;
  conditionBody?: any;
  postImagePath: string;
  postDescription: string;
  sensitivityValue: number;
  preloadMembers?: any;
};

// Checks the condition of the tasks
export const checkCondition = (condition: Condition, members: Member[], conditionBody?: any) => {
  switch (condition) {
    case 'all':
      return members.filter((m) => !m.checked).length === 0;
    case 'nobody':
      return members.filter((m) => m.checked).length === 0;
    case 'select-only-one-of-group':
      return (
        members.find((m) => m.name === conditionBody.member).checked &&
        members.filter((m) => m.group === conditionBody.group && m.checked).length === 1
      );
    case 'select-one':
      return members.find((m) => m.name === conditionBody.member).checked;
    case 'deselect-one':
      return !members.find((m) => m.name === conditionBody.member).checked;
    case 'selection-of-choice': {
      const groupKeys = Object.keys(conditionBody);
      return groupKeys
        .map((key): boolean => {
          if (
            conditionBody[key] &&
            typeof conditionBody[key] === 'object' &&
            conditionBody[key] instanceof Object
          ) {
            let selected: string[] = conditionBody[key].selectedMembers;
            let deselected: string[] = conditionBody[key].deselectedMembers;
            let intersection = _.intersection(selected, deselected);
            if (intersection.length > 0) {
              throw new Error(
                `Same member(s) in selectedMembers and deselectedMembers: ${intersection}`
              );
            }
            console.log(
              members.filter(
                (m) =>
                  (selected.includes(m.name) && !m.checked) ||
                  (deselected.includes(m.name) && m.checked)
              )
            );
            return (
              members.filter(
                (m) =>
                  (selected.includes(m.name) && !m.checked) ||
                  (deselected.includes(m.name) && m.checked)
              ).length === 0
            );
          } else if (conditionBody[key] === 'all') {
            return members.filter((m) => m.group === key && !m.checked).length === 0;
          } else if (conditionBody[key] === 'nobody') {
            return members.filter((m) => m.group === key && m.checked).length === 0;
          } else throw new Error('Wrong condition body format!');
        })
        .reduce((a, b) => a && b);
    }
    default:
      throw new Error(`Unknown condition: ${condition}`);
  }
};

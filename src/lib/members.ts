import type Color from 'color';

export type Member = {
  name: string;
  group: string;
  color: Color | string;
  checked?: boolean;
  favorite?: boolean;
  riskScore?: number;
};

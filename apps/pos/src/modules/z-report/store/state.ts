import { ZReport } from '@fjord/core/models/z-report';

export interface State {
  zReport?: ZReport;
}

export const state: State = {
  zReport: undefined,
};

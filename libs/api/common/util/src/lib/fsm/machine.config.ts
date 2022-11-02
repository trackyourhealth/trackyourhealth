import { Transition } from './state.machine';

export type State = 'active' | 'draft' | 'retired';

export type Event = 'publish' | 'redraft' | 'retire';

export const transitions: Transition<State, Event>[] = [
  { from: 'draft', cause: 'publish', to: 'active' },
  { from: 'active', cause: 'retire', to: 'retired' },
  { from: 'active', cause: 'redraft', to: 'draft' },
];

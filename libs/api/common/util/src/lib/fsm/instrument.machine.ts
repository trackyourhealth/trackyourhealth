import { Instrument } from '@prisma/client';
import { err, Result } from 'neverthrow';

import { StateMachine, Transition } from './state.machine';

export type State = 'active' | 'draft' | 'retired';

export const createStates = (): State[] => ['active', 'draft', 'retired'];

export type Event = 'publish' | 'redraft' | 'retire';

export const createEvents = (): Event[] => ['publish', 'redraft', 'retire'];

export const createTransitions = (): Transition<State, Event>[] => [
  { from: 'draft', cause: 'publish', to: 'active' },
  { from: 'active', cause: 'retire', to: 'retired' },
  { from: 'active', cause: 'redraft', to: 'draft' },
];

export const createStateMachine = (): StateMachine<State, Event> =>
  new StateMachine(['draft'], createTransitions());

export const parseStateMachine = (
  instrument: Instrument,
): Result<StateMachine<State, Event>, Error> => {
  const fsm = instrument.state;
  if (!fsm || Array.isArray(fsm) || typeof fsm !== 'object') {
    return err(new Error('instrument state must be an object'));
  }
  return StateMachine.create<State, Event>(fsm, createStates(), createEvents());
};

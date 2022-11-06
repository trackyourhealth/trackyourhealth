import { Instrument } from '@prisma/client';
import { err, Result } from 'neverthrow';

import { StateMachine, Transition } from './state.machine';

const ALL_STATES = ['active', 'draft', 'retired'] as const;
type ALL_STATES_LIST_TYPE = typeof ALL_STATES;
export type State = ALL_STATES_LIST_TYPE[number];
export const createStates = (): State[] => [...ALL_STATES];

const ALL_EVENTS = ['publish', 'redraft', 'retire'] as const;
type ALL_EVENTS_LIST_TYPE = typeof ALL_EVENTS;
export type Event = ALL_EVENTS_LIST_TYPE[number];
export const createEvents = (): Event[] => [...ALL_EVENTS];

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

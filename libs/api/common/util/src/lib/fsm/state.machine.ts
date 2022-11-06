import { err, ok, Result } from 'neverthrow';

export type Transition<S, E> = { from: S; cause: E; to: S };

export interface StateMachineDTO<S, E> {
  history: S[];
  transitions: Transition<S, E>[];
}

export class StateMachine<S, E> {
  private history: S[];
  private readonly transitions: Transition<S, E>[];

  constructor(history: S[], transitions: Transition<S, E>[]) {
    if (!history || history.length === 0) {
      throw new Error('history must not be empty');
    }
    if (!transitions || transitions.length === 0) {
      throw new Error('transitions must not be empty');
    }
    this.history = [...history];
    this.transitions = [...transitions];
  }

  transition(event: E): boolean {
    const state = this.getState();
    const transition = this.transitions.find(
      (x) => x.from === state && x.cause === event,
    );
    if (transition === undefined) {
      return false;
    }
    this.history.push(transition.to);
    return true;
  }

  getState(): S {
    const state = this.history.at(-1);
    if (!state) {
      throw new Error('history must not be empty');
    }
    return state;
  }

  matches(state: S): boolean {
    return this.getState() === state;
  }

  can(event: E): boolean {
    const state = this.getState();
    return this.transitions.some((t) => t.from === state && t.cause === event);
  }

  matchesSome(states: S[]): boolean {
    const state = this.getState();
    return states.some((s) => s === state);
  }

  getHistory(): S[] {
    return [...this.history];
  }

  getTransitions(): Transition<S, E>[] {
    return [...this.transitions];
  }

  static create<S, E>(
    stateMachine: object,
    states: S[],
    events: E[],
  ): Result<StateMachine<S, E>, Error> {
    if (states.length === 0 || events.length === 0) {
      return err(new Error('States and events must be non-empty'));
    }
    const sm = stateMachine as StateMachineDTO<S, E>;
    if (
      !sm.history ||
      !sm.transitions ||
      !Array.isArray(sm.history) ||
      !Array.isArray(sm.transitions)
    ) {
      return err(new Error('History and transitions must be defined arrays'));
    }
    if (sm.history.length === 0 || sm.transitions.length === 0) {
      return err(new Error('History and transitions must be non-empty arrays'));
    }
    for (const state of sm.history) {
      if (!states.some((s) => state === s)) {
        return err(new Error(`History contains invalid state ${state}`));
      }
    }
    for (const transition of sm.transitions) {
      if (
        !states.some((s) => transition.from === s) ||
        !states.some((s) => transition.to === s) ||
        !events.some((e) => transition.cause === e)
      ) {
        return err(
          new Error(`Transitions contain invalid value ${transition}`),
        );
      }
    }
    return ok(new StateMachine(sm.history, sm.transitions));
  }
}

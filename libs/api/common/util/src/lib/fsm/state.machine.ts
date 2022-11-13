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
    return states.includes(state);
  }

  getHistory(): S[] {
    return [...this.history];
  }

  getTransitions(): Transition<S, E>[] {
    return [...this.transitions];
  }

  serialize(): object {
    const sm: StateMachineDTO<S, E> = {
      history: this.getHistory(),
      transitions: this.getTransitions(),
    };
    return sm;
  }

  private static validateHistory<S, E>(
    sm: StateMachineDTO<S, E>,
    states: S[],
  ): Result<StateMachineDTO<S, E>, Error> {
    const history = sm.history;
    if (history.length === 0) {
      return err(new Error('History must be non-empty arrays'));
    }
    for (const state of history) {
      if (!states.includes(state)) {
        return err(new Error(`History contains invalid state ${state}`));
      }
    }
    return ok(sm);
  }

  private static validateTransitions<S, E>(
    sm: StateMachineDTO<S, E>,
    states: S[],
    events: E[],
  ): Result<StateMachineDTO<S, E>, Error> {
    const transitions = sm.transitions;
    if (transitions.length === 0) {
      return err(new Error('Transitions must be non-empty arrays'));
    }
    for (const transition of transitions) {
      if (
        !states.includes(transition.from) ||
        !states.includes(transition.to) ||
        !events.includes(transition.cause)
      ) {
        return err(
          new Error(`Transitions contain invalid value ${transition}`),
        );
      }
    }
    return ok(sm);
  }

  private static validateStructure<S, E>(
    stateMachine: object,
  ): Result<StateMachineDTO<S, E>, Error> {
    const sm = stateMachine as StateMachineDTO<S, E>;
    const validStructure =
      sm.history &&
      sm.transitions &&
      Array.isArray(sm.history) &&
      Array.isArray(sm.transitions);
    return validStructure
      ? ok(sm)
      : err(new Error('History and transitions must be defined arrays'));
  }

  static validate<S, E>(
    stateMachine: object,
    states: S[],
    events: E[],
  ): Result<StateMachineDTO<S, E>, Error> {
    if (states.length === 0 || events.length === 0) {
      return err(new Error('States and events must be non-empty'));
    }
    return this.validateStructure<S, E>(stateMachine)
      .andThen((fsm) => this.validateHistory(fsm, states))
      .andThen((fsm) => this.validateTransitions(fsm, states, events));
  }

  static create<S, E>(
    stateMachine: object,
    states: S[],
    events: E[],
  ): Result<StateMachine<S, E>, Error> {
    return this.validate(stateMachine, states, events).map(
      (sm) => new StateMachine(sm.history, sm.transitions),
    );
  }
}

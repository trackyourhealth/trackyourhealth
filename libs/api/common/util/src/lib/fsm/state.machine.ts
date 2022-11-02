import { Prisma } from '@prisma/client';
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

  parseHistory(history: any[]): void {
    if (!history || !Array.isArray(history)) {
      throw new Error('History needs to be an array');
    }
    history = history as S[];
    for (const state of history) {
      if (!(state instanceof String) && typeof state !== 'string') {
        throw new Error('History must only contain strings');
      }
    }
    const currentState = history.at(-1);
    if (!currentState) {
      throw new Error('History must not be empty');
    }
    for (const t of this.transitions) {
      if (t.from === currentState || t.to === currentState) {
        this.history = history;
        return;
      }
    }
    throw new Error(
      `Given history with current state '${currentState}' is incompatible with SM`,
    );
  }

  persist(): string {
    return JSON.stringify(this);
  }

  static fromJson<S, E>(
    sm: Prisma.JsonValue,
  ): Result<StateMachine<S, E>, Error> {
    const isNotString = (value: unknown): boolean => {
      return !(value instanceof String) && typeof value !== 'string';
    };
    if (sm === null || Array.isArray(sm) || typeof sm !== 'object') {
      return err(new Error(`SM must be a JsonObject`));
    }
    const jsonHistory = sm['history'];
    if (
      jsonHistory === undefined ||
      jsonHistory === null ||
      !Array.isArray(jsonHistory)
    ) {
      return err(new Error(`History must be a defined array`));
    }
    const historyArray: Prisma.JsonValue[] = jsonHistory;
    if (historyArray.length === 0) {
      return err(new Error(`History must be a non-empty array`));
    }
    for (const state of historyArray) {
      if (
        state === null ||
        (!(state instanceof String) && typeof state !== 'string')
      ) {
        return err(new Error(`History must only contain strings`));
      }
    }
    // TODO: implement without as
    const history = historyArray as S[];

    const jsonTransitions = sm['transitions'];
    if (
      jsonTransitions === undefined ||
      jsonTransitions === null ||
      !Array.isArray(jsonTransitions)
    ) {
      return err(new Error(`Transitions must be a defined array`));
    }
    const transitionsArray: Prisma.JsonValue[] = jsonTransitions;
    if (transitionsArray.length === 0) {
      return err(new Error(`Transitions must be a non-empty array`));
    }
    for (const transition of transitionsArray) {
      if (
        transition === null ||
        Array.isArray(transition) ||
        typeof transition !== 'object'
      ) {
        return err(new Error(`Transitions has invalid structure`));
      }
      if (!transition['from'] || !transition['cause'] || !transition['to']) {
        return err(
          new Error(`Transitions contains item with invalid structure`),
        );
      }
      if (
        isNotString(transition['from']) ||
        isNotString(transition['cause']) ||
        isNotString(transition['to'])
      ) {
        return err(
          new Error(`Transitions contains item with invalid structure`),
        );
      }
    }
    // TODO: implement without as
    const transitions = transitionsArray as Transition<S, E>[];
    return ok(new StateMachine(history, transitions));
  }

  static create<S, E>(storedSM: string): Result<StateMachine<S, E>, Error> {
    const safeJsonParse = Result.fromThrowable(
      JSON.parse,
      () => new Error('JSON parsing failed'),
    );
    const notString = (s: unknown) =>
      !(s instanceof String) && typeof s !== 'string';
    const validateSM = (
      sm: StateMachineDTO<S, E>,
    ): Result<StateMachineDTO<S, E>, Error> => {
      const invalidStructure =
        !sm.history ||
        !sm.transitions ||
        !Array.isArray(sm.history) ||
        !Array.isArray(sm.transitions);
      if (invalidStructure) {
        return err(
          new Error(`JSON didn't contain valid history or transitions`),
        );
      }
      if (sm.history.length === 0 || sm.transitions.length === 0) {
        return err(new Error(`history and transitions must not be empty`));
      }
      const invalidHistoryStructure = sm.history.some(notString);
      if (invalidHistoryStructure) {
        return err(new Error(`history must only contain strings`));
      }
      const invalidTransitionsStructure = sm.transitions.some(
        (t) =>
          !t.from ||
          !t.cause ||
          !t.to ||
          notString(t.from) ||
          notString(t.cause) ||
          notString(t.to),
      );
      if (invalidTransitionsStructure) {
        return err(new Error(`history must only contain strings`));
      }
      return ok(sm);
    };
    return safeJsonParse(storedSM)
      .andThen(validateSM)
      .map((sm) => new StateMachine(sm.history, sm.transitions));
  }
}

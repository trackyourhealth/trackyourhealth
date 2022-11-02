import { Prisma } from '@prisma/client';

import { StateMachine, Transition } from './state.machine';

export type State = 'active' | 'draft' | 'retired';

export type Event = 'publish' | 'redraft' | 'retire';

const transitions: Transition<State, Event>[] = [
  { from: 'draft', cause: 'publish', to: 'active' },
  { from: 'active', cause: 'retire', to: 'retired' },
  { from: 'active', cause: 'redraft', to: 'draft' },
];

describe('StateMachine', () => {
  let machine: StateMachine<State, Event>;
  const initState: State[] = ['draft'];

  beforeEach(() => {
    machine = new StateMachine<State, Event>(initState, transitions);
  });

  it('should be defined', () => {
    expect(machine).toBeDefined();
  });

  describe('transitions', () => {
    it('should not transition with incorrect event', () => {
      expect(machine.getState()).toStrictEqual<State>('draft');
      expect(machine.transition('retire')).toBeFalsy();
      expect(machine.getState()).toStrictEqual<State>('draft');
    });

    it('should transition with correct event', () => {
      expect(machine.getState()).toStrictEqual<State>('draft');
      expect(machine.transition('publish')).toBeTruthy();
      expect(machine.getState()).toStrictEqual<State>('active');
    });
  });

  describe('history', () => {
    it('should not add state after incorrect event', () => {
      expect(machine.getHistory()).toStrictEqual<State[]>(initState);
      expect(machine.transition('retire')).toBeFalsy();
      expect(machine.getHistory()).toStrictEqual<State[]>(initState);
    });

    it('should add state after correct event', () => {
      expect(machine.getHistory()).toStrictEqual<State[]>(initState);
      expect(machine.transition('publish')).toBeTruthy();
      expect(machine.getHistory()).toStrictEqual<State[]>(['draft', 'active']);
    });

    it('should not be accessible from the outside', () => {
      const history = machine.getHistory();
      expect(history).toStrictEqual<State[]>(initState);
      history.push('draft');
      expect(history).toStrictEqual<State[]>(['draft', 'draft']);
      expect(machine.getHistory()).toStrictEqual<State[]>(initState);
    });
  });

  describe('persistance', () => {
    describe('success', () => {
      it('should parse from correct string', () => {
        const storedSM = machine.persist();
        const result = StateMachine.create<State, Event>(storedSM);
        expect(result).toBeDefined();
        expect(result.isOk()).toBeTruthy();
        const stateMachine = result._unsafeUnwrap();
        expect(stateMachine.getState()).toStrictEqual(machine.getState());
        expect(stateMachine.getHistory()).toStrictEqual(machine.getHistory());
        expect(stateMachine.transition('publish')).toBeTruthy();
        expect(stateMachine.getHistory()).toStrictEqual<State[]>([
          'draft',
          'active',
        ]);
      });
    });

    describe('fail', () => {
      it('should fail from empty string', () => {
        const result = StateMachine.create<State, Event>('');
        expect(result.isErr()).toBeTruthy();
      });

      it('should fail from string not containing transitions', () => {
        const obj = { history: initState };
        const persistedObj = JSON.stringify(obj);
        const result = StateMachine.create<State, Event>(persistedObj);
        expect(result.isErr()).toBeTruthy();
      });

      it('should fail from string not containing history', () => {
        const obj = { transitions: transitions };
        const persistedObj = JSON.stringify(obj);
        const result = StateMachine.create<State, Event>(persistedObj);
        expect(result.isErr()).toBeTruthy();
      });

      it('should fail from string not containing history as array', () => {
        const obj = { history: 'fail', transitions: transitions };
        const persistedObj = JSON.stringify(obj);
        const result = StateMachine.create<State, Event>(persistedObj);
        expect(result.isErr()).toBeTruthy();
      });

      it('should fail from string not containing transitions as array', () => {
        const obj = { history: initState, transitions: 'fail' };
        const persistedObj = JSON.stringify(obj);
        const result = StateMachine.create<State, Event>(persistedObj);
        expect(result.isErr()).toBeTruthy();
      });

      it('should fail from string containing empty transitions', () => {
        const obj = { history: initState, transitions: [] };
        const persistedObj = JSON.stringify(obj);
        const result = StateMachine.create<State, Event>(persistedObj);
        expect(result.isErr()).toBeTruthy();
      });

      it('should fail from string containing empty history', () => {
        const obj: Prisma.JsonValue = { history: [], transitions: transitions };
        const persistedObj = JSON.stringify(obj);
        const result = StateMachine.create<State, Event>(persistedObj);
        expect(result.isErr()).toBeTruthy();
      });

      it('should fail from string containing history without strings', () => {
        const obj = { history: ['draft', {}], transitions: transitions };
        const persistedObj = JSON.stringify(obj);
        const result = StateMachine.create<State, Event>(persistedObj);
        expect(result.isErr()).toBeTruthy();
      });

      it('should fail from string containing transitions with invalid structure', () => {
        const obj = {
          history: initState,
          transitions: [{ from: 'draft', to: 'active' }],
        };
        const persistedObj = JSON.stringify(obj);
        const result = StateMachine.create<State, Event>(persistedObj);
        expect(result.isErr()).toBeTruthy();
      });

      it('should fail from string containing transitions with invalid type', () => {
        const obj = {
          history: initState,
          transitions: [{ from: 'draft', cause: {}, to: 'active' }],
        };
        const persistedObj = JSON.stringify(obj);
        const result = StateMachine.create<State, Event>(persistedObj);
        expect(result.isErr()).toBeTruthy();
      });
    });
  });
});

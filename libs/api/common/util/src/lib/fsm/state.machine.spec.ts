import {
  createEvents,
  createStates,
  createTransitions,
  Event,
  State,
} from './instrument.machine';
import { StateMachine } from './state.machine';

describe('StateMachine', () => {
  let machine: StateMachine<State, Event>;
  const initialState: State[] = ['draft'];

  beforeEach(() => {
    machine = new StateMachine<State, Event>(initialState, createTransitions());
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

    it('should allow all instrument transitions', () => {
      expect(machine.getState()).toStrictEqual<State>('draft');
      expect(machine.transition('publish')).toBeTruthy();
      expect(machine.getState()).toStrictEqual<State>('active');
      expect(machine.transition('redraft')).toBeTruthy();
      expect(machine.getState()).toStrictEqual<State>('draft');
      expect(machine.transition('publish')).toBeTruthy();
      expect(machine.getState()).toStrictEqual<State>('active');
      expect(machine.transition('retire')).toBeTruthy();
      expect(machine.getState()).toStrictEqual<State>('retired');
    });
  });

  describe('history', () => {
    it('should not add state after incorrect event', () => {
      expect(machine.getHistory()).toStrictEqual<State[]>(initialState);
      expect(machine.transition('retire')).toBeFalsy();
      expect(machine.getHistory()).toStrictEqual<State[]>(initialState);
    });

    it('should add state after correct event', () => {
      expect(machine.getHistory()).toStrictEqual<State[]>(initialState);
      expect(machine.transition('publish')).toBeTruthy();
      expect(machine.getHistory()).toStrictEqual<State[]>(['draft', 'active']);
    });

    it('should not be accessible from the outside', () => {
      const history = machine.getHistory();
      expect(history).toStrictEqual<State[]>(initialState);
      history.push('draft');
      expect(history).toStrictEqual<State[]>(['draft', 'draft']);
      expect(machine.getHistory()).toStrictEqual<State[]>(initialState);
    });
  });

  describe('persistance', () => {
    const parseSM = (sm: object) =>
      StateMachine.create<State, Event>(sm, createStates(), createEvents());

    describe('success', () => {
      it('should parse from correct object', () => {
        const storedSM = { ...machine };
        const result = parseSM(storedSM);
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
      it('should fail from empty object', () => {
        const result = parseSM({});
        expect(result.isErr()).toBeTruthy();
      });

      it('should fail from object not containing transitions', () => {
        const obj = { history: initialState };
        const result = parseSM(obj);
        expect(result.isErr()).toBeTruthy();
      });

      it('should fail from object not containing history', () => {
        const obj = { transitions: createTransitions() };
        const result = parseSM(obj);
        expect(result.isErr()).toBeTruthy();
      });

      it('should fail from object not containing history as array', () => {
        const obj = { history: 'fail', transitions: createTransitions() };
        const result = parseSM(obj);
        expect(result.isErr()).toBeTruthy();
      });

      it('should fail from object not containing transitions as array', () => {
        const obj = { history: initialState, transitions: 'fail' };
        const result = parseSM(obj);
        expect(result.isErr()).toBeTruthy();
      });

      it('should fail from object containing empty transitions', () => {
        const obj = { history: initialState, transitions: [] };
        const result = parseSM(obj);
        expect(result.isErr()).toBeTruthy();
      });

      it('should fail from object containing empty history', () => {
        const obj = { history: [], transitions: createTransitions() };
        const result = parseSM(obj);
        expect(result.isErr()).toBeTruthy();
      });

      it('should fail from object containing history without strings', () => {
        const obj = {
          history: ['draft', {}],
          transitions: createTransitions(),
        };
        const result = parseSM(obj);
        expect(result.isErr()).toBeTruthy();
      });

      it('should fail from object containing transitions with invalid structure', () => {
        const obj = {
          history: initialState,
          transitions: [{ from: 'draft', to: 'active' }],
        };
        const result = parseSM(obj);
        expect(result.isErr()).toBeTruthy();
      });

      it('should fail from object containing transitions with invalid type', () => {
        const obj = {
          history: initialState,
          transitions: [{ from: 'draft', cause: {}, to: 'active' }],
        };
        const result = parseSM(obj);
        expect(result.isErr()).toBeTruthy();
      });
    });
  });
});

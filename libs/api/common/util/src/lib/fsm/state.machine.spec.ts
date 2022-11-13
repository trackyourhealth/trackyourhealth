import { StateMachine, Transition } from './state.machine';

const ALL_STATES = ['active', 'draft', 'retired'] as const;
type ALL_STATES_LIST_TYPE = typeof ALL_STATES;
type State = ALL_STATES_LIST_TYPE[number];
const createStates = (): State[] => [...ALL_STATES];

const ALL_EVENTS = ['publish', 'redraft', 'retire'] as const;
type ALL_EVENTS_LIST_TYPE = typeof ALL_EVENTS;
type Event = ALL_EVENTS_LIST_TYPE[number];
const createEvents = (): Event[] => [...ALL_EVENTS];

const createTransitions = (): Transition<State, Event>[] => [
  { from: 'draft', cause: 'publish', to: 'active' },
  { from: 'active', cause: 'retire', to: 'retired' },
  { from: 'active', cause: 'redraft', to: 'draft' },
];

describe('StateMachine', () => {
  let machine: StateMachine<State, Event>;
  const initialState: State[] = ['draft'];

  beforeEach(() => {
    machine = new StateMachine<State, Event>(initialState, createTransitions());
  });

  it('should be defined', () => {
    expect(machine).toBeDefined();
  });

  describe('transition', () => {
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

  describe('getHistory', () => {
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

  describe('validate', () => {
    const validateSM = (sm: object) =>
      StateMachine.validate<State, Event>(sm, createStates(), createEvents());

    it('should return DTO with correct object', () => {
      const storedSM = machine.serialize();
      const result = validateSM(storedSM);
      expect(result).toBeDefined();
      expect(result.isOk()).toBeTruthy();
      const stateMachine = result._unsafeUnwrap();
      expect(stateMachine.history).toStrictEqual(machine.getHistory());
      expect(stateMachine.transitions).toStrictEqual(machine.getTransitions());
    });

    it('should return Error with empty object', () => {
      const result = validateSM({});
      expect(result.isErr()).toBeTruthy();
    });

    it('should return Error with object not containing transitions', () => {
      const obj = { history: initialState };
      const result = validateSM(obj);
      expect(result.isErr()).toBeTruthy();
    });

    it('should return Error with object not containing history', () => {
      const obj = { transitions: createTransitions() };
      const result = validateSM(obj);
      expect(result.isErr()).toBeTruthy();
    });

    it('should return Error with object not containing history as array', () => {
      const obj = { history: 'fail', transitions: createTransitions() };
      const result = validateSM(obj);
      expect(result.isErr()).toBeTruthy();
    });

    it('should return Error with object not containing transitions as array', () => {
      const obj = { history: initialState, transitions: 'fail' };
      const result = validateSM(obj);
      expect(result.isErr()).toBeTruthy();
    });

    it('should return Error with object containing empty transitions', () => {
      const obj = { history: initialState, transitions: [] };
      const result = validateSM(obj);
      expect(result.isErr()).toBeTruthy();
    });

    it('should return Error with object containing empty history', () => {
      const obj = { history: [], transitions: createTransitions() };
      const result = validateSM(obj);
      expect(result.isErr()).toBeTruthy();
    });

    it('should return Error with object containing history without strings', () => {
      const obj = {
        history: ['draft', {}],
        transitions: createTransitions(),
      };
      const result = validateSM(obj);
      expect(result.isErr()).toBeTruthy();
    });

    it('should return Error with object containing transitions with invalid structure', () => {
      const obj = {
        history: initialState,
        transitions: [{ from: 'draft', to: 'active' }],
      };
      const result = validateSM(obj);
      expect(result.isErr()).toBeTruthy();
    });

    it('should return Error with object containing transitions with invalid type', () => {
      const obj = {
        history: initialState,
        transitions: [{ from: 'draft', cause: {}, to: 'active' }],
      };
      const result = validateSM(obj);
      expect(result.isErr()).toBeTruthy();
    });
  });

  describe('create', () => {
    it('should return StateMachine after successful validation', () => {
      const storedSM = machine.serialize();
      const result = StateMachine.create<State, Event>(
        storedSM,
        createStates(),
        createEvents(),
      );
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

    it('should return Error after failed validation', () => {
      const emptySM = {};
      const result = StateMachine.create<State, Event>(
        emptySM,
        createStates(),
        createEvents(),
      );
      expect(result.isErr()).toBeTruthy();
    });
  });
});

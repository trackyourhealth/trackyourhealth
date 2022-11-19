import { MAX_POSITIVE_INT, MIN_POSITIVE_INT } from './fhir.types';
import { Schedule } from './schedule';

describe('Schedule', () => {
  describe('validate', () => {
    it('should accept empty object', () => {
      const dto = {};
      const scheduleResult = Schedule.create(dto);
      expect(scheduleResult.isOk()).toBeTruthy();
      const schedule = scheduleResult._unsafeUnwrap();
      expect(schedule.serialize()).toStrictEqual(dto);
    });

    describe('count', () => {
      it('should accept object with valid count and undefined countMax', () => {
        const dto = { count: MIN_POSITIVE_INT };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isOk()).toBeTruthy();
        const schedule = scheduleResult._unsafeUnwrap();
        expect(schedule.serialize()).toStrictEqual(dto);
      });

      it('should accept object with valid count and valid countMax', () => {
        const dto = { count: MIN_POSITIVE_INT, countMax: MAX_POSITIVE_INT };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isOk()).toBeTruthy();
        const schedule = scheduleResult._unsafeUnwrap();
        expect(schedule.serialize()).toStrictEqual(dto);
      });

      it('should accept object with valid count and valid countMax being equal', () => {
        const dto = { count: MIN_POSITIVE_INT, countMax: MIN_POSITIVE_INT };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isOk()).toBeTruthy();
        const schedule = scheduleResult._unsafeUnwrap();
        expect(schedule.serialize()).toStrictEqual(dto);
      });

      it('should not accept object with out of range count and undefined countMax', () => {
        let dto = { count: MIN_POSITIVE_INT - 1 };
        let scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
        dto = { count: MAX_POSITIVE_INT + 1 };
        scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should not accept object with invalid count and undefined countMax', () => {
        const dto = { count: 'invalid' };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should not accept object with undefined count and valid countMax', () => {
        const dto = { countMax: MAX_POSITIVE_INT };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should not accept object with valid count and out of range countMax', () => {
        let dto = { count: MIN_POSITIVE_INT, countMax: MIN_POSITIVE_INT - 1 };
        let scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
        dto = { count: MIN_POSITIVE_INT, countMax: MAX_POSITIVE_INT + 1 };
        scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should not accept object with valid count and invalid countMax', () => {
        const dto = { count: MIN_POSITIVE_INT, countMax: 'invalid' };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should not accept object with valid count being bigger than valid countMax', () => {
        const dto = { count: MIN_POSITIVE_INT + 1, countMax: MIN_POSITIVE_INT };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });
    });
  });
});

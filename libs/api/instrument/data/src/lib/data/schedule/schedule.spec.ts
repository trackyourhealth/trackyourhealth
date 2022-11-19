import { TimingRepeat } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/timingRepeat';

import { DaysOfWeek, MAX_POSITIVE_INT, MIN_POSITIVE_INT } from './fhir.types';
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

      it('should reject object with out of range count and undefined countMax', () => {
        let dto = { count: MIN_POSITIVE_INT - 1 };
        let scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
        dto = { count: MAX_POSITIVE_INT + 1 };
        scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with invalid count and undefined countMax', () => {
        const dto = { count: 'invalid' };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with undefined count and valid countMax', () => {
        const dto = { countMax: MAX_POSITIVE_INT };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid count and out of range countMax', () => {
        let dto = { count: MIN_POSITIVE_INT, countMax: MIN_POSITIVE_INT - 1 };
        let scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
        dto = { count: MIN_POSITIVE_INT, countMax: MAX_POSITIVE_INT + 1 };
        scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid count and invalid countMax', () => {
        const dto = { count: MIN_POSITIVE_INT, countMax: 'invalid' };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid count being bigger than valid countMax', () => {
        const dto = { count: MIN_POSITIVE_INT + 1, countMax: MIN_POSITIVE_INT };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });
    });

    describe('duration', () => {
      const validDuration = 0.5;
      const validDurationUnit = TimingRepeat.DurationUnitEnum.A;
      const validDurationMax = 34.75;

      it('should reject object with undefined duration and valid unit and undefined max', () => {
        const dto = { durationUnit: validDurationUnit };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with undefined duration and undefined unit and valid max', () => {
        const dto = { durationMax: validDurationMax };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid duration and undefined unit and undefined max', () => {
        const dto = { duration: validDuration };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid duration and invalid unit code and undefined max', () => {
        const dto = { duration: validDuration, durationUnit: 'invalid' };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid duration and invalid unit type and undefined max', () => {
        const dto = {
          duration: validDuration,
          durationUnit: { key: 'invalid' },
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with invalid duration and valid unit and undefined max', () => {
        const dto = {
          duration: 'invalid',
          durationUnit: validDurationUnit,
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid duration and valid unit and invalid max type', () => {
        const dto = {
          duration: validDuration,
          durationUnit: validDurationUnit,
          durationMax: 'invalid',
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid duration bigger than max and valid unit', () => {
        const dto = {
          duration: validDuration + 1,
          durationUnit: validDurationUnit,
          durationMax: validDuration,
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should accept object with valid duration equal to max and valid unit', () => {
        const dto = {
          duration: validDuration,
          durationUnit: validDurationUnit,
          durationMax: validDuration,
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isOk()).toBeTruthy();
        const schedule = scheduleResult._unsafeUnwrap();
        expect(schedule.serialize()).toStrictEqual(dto);
      });

      it('should accept object with valid duration and valid unit and undefined max', () => {
        const dto = {
          duration: validDuration,
          durationUnit: validDurationUnit,
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isOk()).toBeTruthy();
        const schedule = scheduleResult._unsafeUnwrap();
        expect(schedule.serialize()).toStrictEqual(dto);
      });

      it('should accept object with valid duration and valid unit and valid max', () => {
        const dto = {
          duration: validDuration,
          durationUnit: validDurationUnit,
          durationMax: validDurationMax,
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isOk()).toBeTruthy();
        const schedule = scheduleResult._unsafeUnwrap();
        expect(schedule.serialize()).toStrictEqual(dto);
      });
    });

    describe('frequency', () => {
      it('should accept object with valid frequency and undefined frequencyMax', () => {
        const dto = { frequency: MIN_POSITIVE_INT };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isOk()).toBeTruthy();
        const schedule = scheduleResult._unsafeUnwrap();
        expect(schedule.serialize()).toStrictEqual(dto);
      });

      it('should accept object with valid frequency and valid frequencyMax', () => {
        const dto = {
          frequency: MIN_POSITIVE_INT,
          frequencyMax: MAX_POSITIVE_INT,
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isOk()).toBeTruthy();
        const schedule = scheduleResult._unsafeUnwrap();
        expect(schedule.serialize()).toStrictEqual(dto);
      });

      it('should accept object with valid frequency and valid frequencyMax being equal', () => {
        const dto = {
          frequency: MIN_POSITIVE_INT,
          frequencyMax: MIN_POSITIVE_INT,
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isOk()).toBeTruthy();
        const schedule = scheduleResult._unsafeUnwrap();
        expect(schedule.serialize()).toStrictEqual(dto);
      });

      it('should reject object with out of range frequency and undefined frequencyMax', () => {
        let dto = { frequency: MIN_POSITIVE_INT - 1 };
        let scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
        dto = { frequency: MAX_POSITIVE_INT + 1 };
        scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with invalid frequency and undefined frequencyMax', () => {
        const dto = { frequency: 'invalid' };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with undefined frequency and valid frequencyMax', () => {
        const dto = { frequencyMax: MAX_POSITIVE_INT };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid frequency and out of range frequencyMax', () => {
        let dto = {
          frequency: MIN_POSITIVE_INT,
          frequencyMax: MIN_POSITIVE_INT - 1,
        };
        let scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
        dto = {
          frequency: MIN_POSITIVE_INT,
          frequencyMax: MAX_POSITIVE_INT + 1,
        };
        scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid frequency and invalid frequencyMax', () => {
        const dto = { frequency: MIN_POSITIVE_INT, frequencyMax: 'invalid' };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid frequency being bigger than valid frequencyMax', () => {
        const dto = {
          frequency: MIN_POSITIVE_INT + 1,
          frequencyMax: MIN_POSITIVE_INT,
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });
    });

    describe('dayOfWeek', () => {
      it('should accept object with empty dayOfWeek', () => {
        const dto = { dayOfWeek: [] };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isOk()).toBeTruthy();
        const schedule = scheduleResult._unsafeUnwrap();
        expect(schedule.serialize()).toStrictEqual(dto);
      });

      it('should accept object with valid dayOfWeek-code', () => {
        const dto = { dayOfWeek: [DaysOfWeek[0]] };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isOk()).toBeTruthy();
        const schedule = scheduleResult._unsafeUnwrap();
        expect(schedule.serialize()).toStrictEqual(dto);
      });

      it('should accept object with all valid dayOfWeek-codes', () => {
        const dto = { dayOfWeek: DaysOfWeek };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isOk()).toBeTruthy();
        const schedule = scheduleResult._unsafeUnwrap();
        expect(schedule.serialize()).toStrictEqual(dto);
      });

      it('should reject object with invalid dayOfWeek-code', () => {
        const dto = { dayOfWeek: ['invalid'] };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with invalid dayOfWeek-code type', () => {
        const dto = { dayOfWeek: [{ key: 'invalid value' }] };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with invalid dayOfWeek', () => {
        const dto = { dayOfWeek: 'invalid' };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });
    });
  });
});

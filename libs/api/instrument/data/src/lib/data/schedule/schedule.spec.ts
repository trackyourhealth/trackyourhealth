import { Duration } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/duration';
import { Quantity } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/quantity';
import { TimingRepeat } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/timingRepeat';

import { Schedule } from './schedule';
import {
  DaysOfWeek,
  MAX_POSITIVE_INT,
  MAX_UNSIGNED_INT,
  MIN_POSITIVE_INT,
  MIN_UNSIGNED_INT,
  WhenCodes,
} from './schedule.types';

describe('Schedule', () => {
  describe('validate', () => {
    it('should accept empty object', () => {
      const dto = {};
      const scheduleResult = Schedule.create(dto);
      expect(scheduleResult.isOk()).toBeTruthy();
      const schedule = scheduleResult._unsafeUnwrap();
      expect(schedule.serialize()).toStrictEqual(dto);
    });

    describe('bounds', () => {
      const validDuration = {
        value: 0.5,
        code: TimingRepeat.DurationUnitEnum.D,
        comparator: Duration.ComparatorEnum.LessThanOrEqualTo,
      };
      const validPeriod = {
        start: new Date(),
        end: new Date(),
      };
      const validRange = {
        low: {
          value: 10,
          code: TimingRepeat.PeriodUnitEnum.Min,
          comparator: Quantity.ComparatorEnum.GreaterThan,
        },
      };

      it('should reject object with valid boundsDuration and boundsPeriod', () => {
        const dto = {
          boundsDuration: validDuration,
          boundsPeriod: validPeriod,
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid boundsDuration and boundsRange', () => {
        const dto = {
          boundsDuration: validDuration,
          boundsRange: validRange,
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid boundsPeriod and boundsRange', () => {
        const dto = {
          boundsPeriod: validPeriod,
          boundsRange: validRange,
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid boundsDuration, boundsPeriod and boundsRange', () => {
        const dto = {
          boundsDuration: validDuration,
          boundsPeriod: validPeriod,
          boundsRange: validRange,
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      describe('boundsDuration', () => {
        it('should reject object with invalid value and valid code', () => {
          const dto = {
            boundsDuration: { ...validDuration, value: 'invalid' },
          };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with valid value and undefined code and undefined comparator', () => {
          const dto = {
            boundsDuration: { value: validDuration.value },
          };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with undefined value and code and valid comparator', () => {
          const dto = {
            boundsDuration: { comparator: validDuration.comparator },
          };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with valid value and invalid code', () => {
          const dto = {
            boundsDuration: { ...validDuration, code: 'invalid' },
          };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with valid value and code and invalid comparator', () => {
          const dto = {
            boundsDuration: { ...validDuration, comparator: 'invalid' },
          };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should accept object with valid value and code and comparator', () => {
          const dto = { boundsDuration: validDuration };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isOk()).toBeTruthy();
          const schedule = scheduleResult._unsafeUnwrap();
          expect(schedule.serialize()).toStrictEqual(dto);
        });
      });

      describe('boundsPeriod', () => {
        const soonerDate = new Date('2021-05-11');
        const laterDate = new Date('2021-05-17');

        it('should accept object with undefined start and undefined end', () => {
          const dto = { boundsPeriod: {} };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isOk()).toBeTruthy();
          const schedule = scheduleResult._unsafeUnwrap();
          expect(schedule.serialize()).toStrictEqual(dto);
        });

        it('should reject object with invalid start and undefined end', () => {
          const dto = { boundsPeriod: { start: 'invalid' } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with invalid start object and undefined end', () => {
          const dto = { boundsPeriod: { start: { key: 'invalid' } } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with undefined start and invalid end', () => {
          const dto = { boundsPeriod: { end: 'invalid' } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with undefined start and invalid end object', () => {
          const dto = { boundsPeriod: { end: { key: 'invalid' } } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with valid start greater than valid end', () => {
          const dto = { boundsPeriod: { start: laterDate, end: soonerDate } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should accept object with valid start and undefined end', () => {
          const dto = { boundsPeriod: { start: soonerDate } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isOk()).toBeTruthy();
          const schedule = scheduleResult._unsafeUnwrap();
          expect(schedule.serialize()).toStrictEqual(dto);
        });

        it('should accept object with undefined start and valid end', () => {
          const dto = { boundsPeriod: { end: laterDate } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isOk()).toBeTruthy();
          const schedule = scheduleResult._unsafeUnwrap();
          expect(schedule.serialize()).toStrictEqual(dto);
        });

        it('should accept object with valid start equal to valid end', () => {
          const dto = { boundsPeriod: { start: laterDate, end: laterDate } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isOk()).toBeTruthy();
          const schedule = scheduleResult._unsafeUnwrap();
          expect(schedule.serialize()).toStrictEqual(dto);
        });

        it('should accept object with valid start smaller than valid end', () => {
          const dto = { boundsPeriod: { start: soonerDate, end: laterDate } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isOk()).toBeTruthy();
          const schedule = scheduleResult._unsafeUnwrap();
          expect(schedule.serialize()).toStrictEqual(dto);
        });
      });

      describe('boundsRange', () => {
        const lowerQuant = {
          value: 0.5,
          code: TimingRepeat.PeriodUnitEnum.D,
          comparator: Quantity.ComparatorEnum.GreaterThan,
        };
        const higherQuant = {
          value: 1.5,
          code: TimingRepeat.PeriodUnitEnum.D,
          comparator: Quantity.ComparatorEnum.GreaterThan,
        };

        it('should reject object with invalid low and undefined high', () => {
          const dto = { boundsRange: { low: 'invalid' } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with invalid low object and undefined high', () => {
          const dto = { boundsRange: { low: { key: 'invalid' } } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with low missing code and undefined high', () => {
          const dto = { boundsRange: { low: { value: lowerQuant.value } } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with low missing value and undefined high', () => {
          const dto = { boundsRange: { low: { code: lowerQuant.code } } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with invalid low value and undefined high', () => {
          const dto = {
            boundsRange: {
              low: { value: 'invalid', code: higherQuant.code },
            },
          };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with invalid low code and undefined high', () => {
          const dto = {
            boundsRange: {
              low: { value: higherQuant.value, code: 'invalid' },
            },
          };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with invalid low comparator and undefined high', () => {
          const dto = {
            boundsRange: {
              low: {
                value: higherQuant.value,
                code: higherQuant.code,
                comparator: 'invalid',
              },
            },
          };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with undefined low and invalid high', () => {
          const dto = { boundsRange: { high: 'invalid' } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with undefined low and invalid high object', () => {
          const dto = { boundsRange: { high: { key: 'invalid' } } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with undefined low and high missing code', () => {
          const dto = { boundsRange: { high: { value: lowerQuant.value } } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with undefined value and high missing value', () => {
          const dto = { boundsRange: { high: { code: lowerQuant.code } } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with undefined low and invalid high value', () => {
          const dto = {
            boundsRange: {
              high: { value: 'invalid', code: higherQuant.code },
            },
          };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with undefined low and invalid high code', () => {
          const dto = {
            boundsRange: {
              high: { value: higherQuant.value, code: 'invalid' },
            },
          };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with undefined low and invalid high comparator', () => {
          const dto = {
            boundsRange: {
              high: {
                value: higherQuant.value,
                code: higherQuant.code,
                comparator: 'invalid',
              },
            },
          };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should accept object with valid low and undefined high', () => {
          const dto = { boundsRange: { low: lowerQuant } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isOk()).toBeTruthy();
          const schedule = scheduleResult._unsafeUnwrap();
          expect(schedule.serialize()).toStrictEqual(dto);
        });

        it('should accept object with undefind low and valid high', () => {
          const dto = { boundsRange: { high: higherQuant } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isOk()).toBeTruthy();
          const schedule = scheduleResult._unsafeUnwrap();
          expect(schedule.serialize()).toStrictEqual(dto);
        });

        it('should accept object with valid low and valid high', () => {
          const dto = { boundsRange: { low: lowerQuant, high: higherQuant } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isOk()).toBeTruthy();
          const schedule = scheduleResult._unsafeUnwrap();
          expect(schedule.serialize()).toStrictEqual(dto);
        });
      });
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

    describe('period', () => {
      const validPeriod = 0.5;
      const validPeriodUnit = TimingRepeat.PeriodUnitEnum.A;
      const validPeriodMax = 34.75;

      it('should reject object with undefined period and valid unit and undefined max', () => {
        const dto = { periodUnit: validPeriodUnit };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with undefined period and undefined unit and valid max', () => {
        const dto = { periodMax: validPeriodMax };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid period and undefined unit and undefined max', () => {
        const dto = { period: validPeriod };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid period and invalid unit code and undefined max', () => {
        const dto = { period: validPeriod, periodUnit: 'invalid' };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid period and invalid unit type and undefined max', () => {
        const dto = {
          period: validPeriod,
          periodUnit: { key: 'invalid' },
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with invalid period and valid unit and undefined max', () => {
        const dto = {
          period: 'invalid',
          periodUnit: validPeriodUnit,
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid period and valid unit and invalid max type', () => {
        const dto = {
          period: validPeriod,
          periodUnit: validPeriodUnit,
          periodMax: 'invalid',
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should reject object with valid period bigger than max and valid unit', () => {
        const dto = {
          period: validPeriod + 1,
          periodUnit: validPeriodUnit,
          periodMax: validPeriod,
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      it('should accept object with valid period equal to max and valid unit', () => {
        const dto = {
          period: validPeriod,
          periodUnit: validPeriodUnit,
          periodMax: validPeriod,
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isOk()).toBeTruthy();
        const schedule = scheduleResult._unsafeUnwrap();
        expect(schedule.serialize()).toStrictEqual(dto);
      });

      it('should accept object with valid period and valid unit and undefined max', () => {
        const dto = {
          period: validPeriod,
          periodUnit: validPeriodUnit,
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isOk()).toBeTruthy();
        const schedule = scheduleResult._unsafeUnwrap();
        expect(schedule.serialize()).toStrictEqual(dto);
      });

      it('should accept object with valid period and valid unit and valid max', () => {
        const dto = {
          period: validPeriod,
          periodUnit: validPeriodUnit,
          periodMax: validPeriodMax,
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isOk()).toBeTruthy();
        const schedule = scheduleResult._unsafeUnwrap();
        expect(schedule.serialize()).toStrictEqual(dto);
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

    describe('timeOfDay and when', () => {
      it('should reject object with valid timeOfDay and valid when', () => {
        const dto = {
          timeOfDay: ['12:00:00', '23:59:59'],
          when: [WhenCodes[0]],
        };
        const scheduleResult = Schedule.create(dto);
        expect(scheduleResult.isErr()).toBeTruthy();
      });

      describe('timeOfDay', () => {
        it('should reject object with invalid timeOfDay', () => {
          const dto = { timeOfDay: { key: 'invalid' } };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with invalid timeOfDay code', () => {
          const dto = { timeOfDay: ['00:00:00', 'invalid'] };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with invalid timeOfDay code format HH:MM', () => {
          const dto = { timeOfDay: ['20:00'] };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with invalid timeOfDay code 24:00:00', () => {
          const dto = { timeOfDay: ['24:00:00'] };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with invalid timeOfDay code type', () => {
          const dto = { timeOfDay: [1200] };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should accept object with empty timeOfDay', () => {
          const dto = { timeOfDay: [] };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isOk()).toBeTruthy();
          const schedule = scheduleResult._unsafeUnwrap();
          expect(schedule.serialize()).toStrictEqual(dto);
        });

        it('should accept object with valid timeOfDay code format HH:MM:SS', () => {
          const dto = {
            timeOfDay: ['00:00:00', '01:10:43', '19:22:60', '23:59:59'],
          };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isOk()).toBeTruthy();
          const schedule = scheduleResult._unsafeUnwrap();
          expect(schedule.serialize()).toStrictEqual(dto);
        });
      });

      describe('when', () => {
        it('should reject object with invalid when', () => {
          const dto = { when: 'invalid' };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with invalid when code', () => {
          const dto = { when: ['invalid'] };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with invalid when code type', () => {
          const dto = { when: [{ key: '' }] };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should accept object with empty when', () => {
          const dto = { when: [] };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isOk()).toBeTruthy();
          const schedule = scheduleResult._unsafeUnwrap();
          expect(schedule.serialize()).toStrictEqual(dto);
        });

        it('should accept object with all valid when codes', () => {
          const dto = { when: WhenCodes };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isOk()).toBeTruthy();
          const schedule = scheduleResult._unsafeUnwrap();
          expect(schedule.serialize()).toStrictEqual(dto);
        });

        it('should reject object with undefined when and valid offset', () => {
          const dto = { offset: MIN_UNSIGNED_INT };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with valid when and invalid offset', () => {
          const dto = { when: WhenCodes, offset: 'invalid' };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should reject object with valid when and out of range offset', () => {
          let dto = { when: WhenCodes, offset: MIN_UNSIGNED_INT - 1 };
          let scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
          dto = { when: WhenCodes, offset: MAX_UNSIGNED_INT + 1 };
          scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isErr()).toBeTruthy();
        });

        it('should accept object with valid when and valid offset', () => {
          const dto = { when: WhenCodes, offset: MAX_UNSIGNED_INT };
          const scheduleResult = Schedule.create(dto);
          expect(scheduleResult.isOk()).toBeTruthy();
          const schedule = scheduleResult._unsafeUnwrap();
          expect(schedule.serialize()).toStrictEqual(dto);
        });
      });
    });
  });
});

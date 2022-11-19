import { TimingRepeat } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/timingRepeat';
import { err, ok, Result } from 'neverthrow';

import {
  isNotDayOfWeek,
  isNotInteger,
  MAX_POSITIVE_INT,
  MIN_POSITIVE_INT,
  outOfPositiveIntRange,
} from './fhir.types';

export class TimingRepeatValidator {
  private static validateDayOfWeek(
    timing: TimingRepeat,
  ): Result<TimingRepeat, Error> {
    const { dayOfWeek } = timing;
    if (dayOfWeek !== undefined) {
      for (const day of dayOfWeek) {
        if (isNotDayOfWeek(day)) {
          return err(new Error(`${day} is an invalid dayOfWeek-code`));
        }
      }
    }
    return ok(timing);
  }

  private static validateCount(
    timing: TimingRepeat,
  ): Result<TimingRepeat, Error> {
    const { count, countMax } = timing;
    if (count === undefined && countMax !== undefined) {
      return err(
        new Error('countMax must not be defined if count is undefined'),
      );
    }
    if (count !== undefined) {
      if (isNotInteger(count)) {
        return err(new Error('count must be an integer'));
      }
      if (outOfPositiveIntRange(count)) {
        return err(
          new Error(
            `count must be between ${MIN_POSITIVE_INT} and ${MAX_POSITIVE_INT}`,
          ),
        );
      }
      if (countMax !== undefined) {
        if (isNotInteger(countMax)) {
          return err(new Error('countMax must be an integer'));
        }
        if (outOfPositiveIntRange(countMax)) {
          return err(
            new Error(
              `countMax must be between ${MIN_POSITIVE_INT} and ${MAX_POSITIVE_INT}`,
            ),
          );
        }
        if (count > countMax) {
          return err(new Error('count must not be bigger than countMax'));
        }
      }
    }
    return ok(timing);
  }

  static validate(scheduleDto: TimingRepeat): Result<TimingRepeat, Error> {
    return this.validateCount(scheduleDto).andThen(this.validateDayOfWeek);
  }
}

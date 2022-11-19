import { TimingRepeat } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/timingRepeat';
import { err, ok, Result } from 'neverthrow';

import {
  isNotDayOfWeek,
  isNotDurationUnit,
  isNotInteger,
  MAX_POSITIVE_INT,
  MIN_POSITIVE_INT,
  outOfPositiveIntRange,
} from './fhir.types';

export class TimingRepeatValidator {
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

  private static validateDuration(
    timing: TimingRepeat,
  ): Result<TimingRepeat, Error> {
    const { duration, durationUnit, durationMax } = timing;
    if (
      duration === undefined &&
      (durationUnit !== undefined || durationMax !== undefined)
    ) {
      return err(
        new Error(
          'durationUnit and durationMax must not be defined if duration is undefined',
        ),
      );
    }
    if (duration !== undefined) {
      if (typeof duration !== 'number') {
        return err(new Error('duration must be a number'));
      }
      if (durationUnit === undefined) {
        return err(
          new Error(
            'durationUnit must not be undefined if duration is defined',
          ),
        );
      }
      if (isNotDurationUnit(durationUnit)) {
        return err(new Error(`${durationUnit} is not a valid durationUnit`));
      }
      if (durationMax !== undefined) {
        if (typeof durationMax !== 'number') {
          return err(new Error('durationMax must be a number'));
        }
        if (duration > durationMax) {
          return err(
            new Error('duration must not be a bigger than durationMax'),
          );
        }
      }
    }
    return ok(timing);
  }

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

  static validate(scheduleDto: TimingRepeat): Result<TimingRepeat, Error> {
    return this.validateCount(scheduleDto)
      .andThen(this.validateDuration)
      .andThen(this.validateDayOfWeek);
  }
}

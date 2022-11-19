import { TimingRepeat } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/timingRepeat';
import { err, ok, Result } from 'neverthrow';

import {
  isNotDayOfWeek,
  isNotDurationUnit,
  isNotInteger,
  isNotPeriodUnit,
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

  private static validateFrequency(
    timing: TimingRepeat,
  ): Result<TimingRepeat, Error> {
    const { frequency, frequencyMax } = timing;
    if (frequency === undefined && frequencyMax !== undefined) {
      return err(
        new Error('frequencyMax must not be defined if frequency is undefined'),
      );
    }
    if (frequency !== undefined) {
      if (isNotInteger(frequency)) {
        return err(new Error('frequency must be an integer'));
      }
      if (outOfPositiveIntRange(frequency)) {
        return err(
          new Error(
            `frequency must be between ${MIN_POSITIVE_INT} and ${MAX_POSITIVE_INT}`,
          ),
        );
      }
      if (frequencyMax !== undefined) {
        if (isNotInteger(frequencyMax)) {
          return err(new Error('frequencyMax must be an integer'));
        }
        if (outOfPositiveIntRange(frequencyMax)) {
          return err(
            new Error(
              `frequencyMax must be between ${MIN_POSITIVE_INT} and ${MAX_POSITIVE_INT}`,
            ),
          );
        }
        if (frequency > frequencyMax) {
          return err(
            new Error('frequency must not be bigger than frequencyMax'),
          );
        }
      }
    }
    return ok(timing);
  }

  private static validatePeriod(
    timing: TimingRepeat,
  ): Result<TimingRepeat, Error> {
    const { period, periodUnit, periodMax } = timing;
    if (
      period === undefined &&
      (periodUnit !== undefined || periodMax !== undefined)
    ) {
      return err(
        new Error(
          'periodUnit and periodMax must not be defined if period is undefined',
        ),
      );
    }
    if (period !== undefined) {
      if (typeof period !== 'number') {
        return err(new Error('period must be a number'));
      }
      if (periodUnit === undefined) {
        return err(
          new Error('periodUnit must not be undefined if period is defined'),
        );
      }
      if (isNotPeriodUnit(periodUnit)) {
        return err(new Error(`${periodUnit} is not a valid periodUnit`));
      }
      if (periodMax !== undefined) {
        if (typeof periodMax !== 'number') {
          return err(new Error('periodMax must be a number'));
        }
        if (period > periodMax) {
          return err(new Error('period must not be a bigger than periodMax'));
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
      .andThen(this.validateFrequency)
      .andThen(this.validatePeriod)
      .andThen(this.validateDayOfWeek);
  }
}

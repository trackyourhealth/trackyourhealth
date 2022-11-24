import { TimingRepeat } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4';
import { Result } from 'neverthrow';

import {
  Comparator,
  DayOfWeek,
  Decimal,
  DurationUnit,
  NonEmptyArray,
  Period,
  PeriodUnit,
  PositiveInt,
  Range,
  TimeOfDay,
  UnsignedInt,
  WhenCode,
} from './schedule.types';
import { TimingRepeatValidator } from './timing.repeat.validator';

export class Schedule {
  private timing: TimingRepeat;

  private constructor(timing?: TimingRepeat) {
    this.timing = { ...timing };
  }

  withBoundsDuration(
    duration: Decimal,
    unit: DurationUnit,
    comparator?: Comparator,
  ) {
    this.timing.boundsDuration = {
      value: duration,
      code: unit,
      comparator: comparator,
    };
    this.timing.boundsPeriod = undefined;
    this.timing.boundsRange = undefined;
    return this;
  }

  withBoundsPeriod(period: Period) {
    this.timing.boundsDuration = undefined;
    this.timing.boundsPeriod = period;
    this.timing.boundsRange = undefined;
    return this;
  }

  withBoundsRange(range: Range) {
    this.timing.boundsDuration = undefined;
    this.timing.boundsPeriod = undefined;
    this.timing.boundsRange = {
      low: {
        value: range.low?.value,
        code: range.low?.unit,
        comparator: range.low?.comparator,
      },
      high: {
        value: range.high?.value,
        code: range.high?.unit,
        comparator: range.high?.comparator,
      },
    };
    return this;
  }

  withCount<T extends number>(count: PositiveInt<T>, max?: PositiveInt<T>) {
    this.timing.count = count;
    this.timing.countMax = max;
    return this;
  }

  withDuration(duration: Decimal, unit: DurationUnit, max?: Decimal) {
    this.timing.duration = duration;
    this.timing.durationUnit = unit;
    this.timing.durationMax = max;
    return this;
  }

  withFrequency<T extends number>(
    frequency: PositiveInt<T>,
    max?: PositiveInt<T>,
  ) {
    this.timing.frequency = frequency;
    this.timing.frequencyMax = max;
    return this;
  }

  withPeriod(period: Decimal, unit: PeriodUnit, max?: Decimal) {
    this.timing.period = period;
    this.timing.periodUnit = unit;
    this.timing.periodMax = max;
    return this;
  }

  withDayOfWeek(dayOfWeek: DayOfWeek, ...daysOfWeek: DayOfWeek[]) {
    this.timing.dayOfWeek = [dayOfWeek, ...daysOfWeek];
    return this;
  }

  withTimeOfDay(timeOfDay: TimeOfDay, ...timesOfDay: TimeOfDay[]) {
    this.timing.timeOfDay = [timeOfDay, ...timesOfDay];
    this.timing.when = undefined;
    this.timing.offset = undefined;
    return this;
  }

  withWhen<T extends number>(
    when: NonEmptyArray<WhenCode>,
    offset?: UnsignedInt<T>,
  ) {
    this.timing.timeOfDay = undefined;
    this.timing.when = when;
    this.timing.offset = offset;
    return this;
  }

  serialize(): TimingRepeat {
    return { ...this.timing };
  }

  static validate(timing: object): Result<TimingRepeat, Error> {
    const schedule = timing as TimingRepeat;
    return TimingRepeatValidator.validate(schedule);
  }

  static create(timing: object): Result<Schedule, Error> {
    return this.validate(timing).map((s) => new Schedule(s));
  }

  static init(): Schedule {
    return new Schedule();
  }
}

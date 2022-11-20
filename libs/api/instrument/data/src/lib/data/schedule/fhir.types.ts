import * as Q from '@smile-cdr/fhirts/dist/FHIR-R4/classes/quantity';
import { TimingRepeat } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/timingRepeat';
import { NonNegativeInteger } from 'type-fest';
import { Zero } from 'type-fest/source/numeric';

export type Decimal = number;

export const isNotDurationUnit = (unit: string): boolean =>
  !Object.values(TimingRepeat.DurationUnitEnum).includes(
    unit as TimingRepeat.DurationUnitEnum,
  );

export const isNotPeriodUnit = (unit: string): boolean =>
  !Object.values(TimingRepeat.PeriodUnitEnum).includes(
    unit as TimingRepeat.PeriodUnitEnum,
  );

export const isNotInteger = (n: unknown): boolean =>
  typeof n !== 'number' || !Number.isSafeInteger(n);

export type PositiveInt<T extends number> = T extends Zero
  ? never
  : NonNegativeInteger<T>;
export const MIN_POSITIVE_INT = 1;
export const MAX_POSITIVE_INT = 2147483647;
export const outOfPositiveIntRange = (n: number): boolean =>
  n < MIN_POSITIVE_INT || n > MAX_POSITIVE_INT;

export type UnsignedInt<T extends number> = NonNegativeInteger<T>;
export const MIN_UNSIGNED_INT = 0;
export const MAX_UNSIGNED_INT = 2 ** 31 - 1;
export const outOfUnsignedIntRange = (n: number): boolean =>
  n < MIN_UNSIGNED_INT || n > MAX_UNSIGNED_INT;

// http://hl7.org/fhir/R4B/valueset-days-of-week.html
export const DaysOfWeek = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
] as const;
type DaysOfWeekType = typeof DaysOfWeek;
export type DayOfWeek = DaysOfWeekType[number];
export const isNotDayOfWeek = (day: string): boolean =>
  !DaysOfWeek.includes(day as DayOfWeek);

const isNotString = (obj: unknown): boolean =>
  !(typeof obj === 'string' || obj instanceof String);

// http://hl7.org/fhir/R4B/datatypes.html#time
const timeRegex = /([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?/;
export const isNotTimeOfDay = (time: string): boolean =>
  isNotString(time) || !timeRegex.test(time);

// http://hl7.org/fhir/R4B/codesystem-event-timing.html
// http://hl7.org/fhir/R4B/valueset-event-timing.html
export const WhenCodes = [
  'MORN',
  'MORN.early',
  'MORN.late',
  'NOON',
  'AFT',
  'AFT.early',
  'AFT.late',
  'EVE',
  'EVE.early',
  'EVE.late',
  'NIGHT',
  'PHS',
  //'IMD', only in FHIR 5.0
  'HS',
  'WAKE',
  'C',
  'CM',
  'CD',
  'CV',
  'AC',
  'ACM',
  'ACD',
  'ACV',
  'PC',
  'PCM',
  'PCD',
  'PCV',
] as const;
type WhenCodesType = typeof WhenCodes;
export type WhenCode = WhenCodesType[number];

interface PeriodWithoutStart {
  start?: never;
  end: Date;
}

interface PeriodWithoutEnd {
  start: Date;
  end?: never;
}

interface PeriodWithBoth {
  start: Date;
  end: Date;
}

export type Period = PeriodWithoutStart | PeriodWithoutEnd | PeriodWithBoth;

export type Quantity = {
  value: Decimal;
  unit: TimingRepeat.PeriodUnitEnum;
  comparator?: Q.Quantity.ComparatorEnum;
};

interface RangeWithoutLow {
  low?: never;
  high: Quantity;
}

interface RangeWithoutHigh {
  low: Quantity;
  high?: never;
}

interface RangeWithBoth {
  low: Quantity;
  high: Quantity;
}

export type Range = RangeWithoutLow | RangeWithoutHigh | RangeWithBoth;

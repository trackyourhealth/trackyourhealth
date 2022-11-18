import * as Q from '@smile-cdr/fhirts/dist/FHIR-R4/classes/quantity';
import { TimingRepeat } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/timingRepeat';
import { NonNegativeInteger } from 'type-fest';
import { Zero } from 'type-fest/source/numeric';

export type Decimal = number;
// 1 .. 2,147,483,647
export type PositiveInt<T extends number> = T extends Zero
  ? never
  : NonNegativeInteger<T>;
// 0 .. 2,147,483,647
export type UnsignedInt<T extends number> = NonNegativeInteger<T>;

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

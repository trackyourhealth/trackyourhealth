// TODO: Use actual positive integer type
export type PositiveInt = number;
export type Decimal = number;
export type UnsignedInt = number;

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

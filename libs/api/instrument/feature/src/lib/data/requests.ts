import { GenerateDataRequest } from '@trackyourhealth/api/core/util';
import {
  CreateInstrumentInput,
  UpdateInstrumentInput,
} from '@trackyourhealth/api/instrument/data';

export class CreateInstrumentRequest extends GenerateDataRequest(
  CreateInstrumentInput,
) {}

export class UpdateInstrumentRequest extends GenerateDataRequest(
  UpdateInstrumentInput,
) {}

import { GenerateDataRequest } from '@trackyourhealth/api/core/util';
import {
  CreateStudyInput,
  UpdateStudyInput,
} from '@trackyourhealth/api/study/data';

export class CreateStudyRequest extends GenerateDataRequest(CreateStudyInput) {}
export class UpdateStudyRequest extends GenerateDataRequest(UpdateStudyInput) {}

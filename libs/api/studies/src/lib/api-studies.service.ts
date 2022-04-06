import { Injectable } from '@nestjs/common';

import { StudyCrudService } from './study.crud.service';

@Injectable()
export class ApiStudiesService extends StudyCrudService {}

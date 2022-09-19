import { Study } from '@prisma/client';
import { CreateStudyInput } from '@trackyourhealth/api/study/data';

export const studies: Study[] = [
  {
    id: 'eabb4ea7-0ff9-47fc-bb5c-2d11d5273516',
    name: 'teststudy4321',
    createdAt: new Date(),
    updatedAt: new Date(),
    title: 'teststudy',
    description: 'study for testing',
    isActive: true,
    startsAt: new Date(),
    endsAt: new Date(),
  },
  {
    id: '89606099-b544-4c7c-a172-86951932a803',
    name: 'teststudy1234',
    createdAt: new Date(),
    updatedAt: new Date(),
    title: 'teststudy',
    description: 'study for testing',
    isActive: true,
    startsAt: new Date(),
    endsAt: new Date(),
  },
];

export const getCreateStudyInput = (
  input?: Partial<CreateStudyInput>,
): CreateStudyInput => {
  return {
    name: '',
    title: {},
    description: {},
    isActive: true,
    startsAt: new Date(),
    ...input,
  };
};

export const getStudyDateStringified = (study: Study) => {
  return {
    ...study,
    createdAt: study.createdAt.toJSON(),
    updatedAt: study.updatedAt.toJSON(),
    startsAt: study.startsAt.toJSON(),
    endsAt: study.endsAt?.toJSON(),
  };
};

export const defaultQueryValues = {
  orderBy: [{ id: 'asc' }],
  skip: 0,
  take: 20,
};

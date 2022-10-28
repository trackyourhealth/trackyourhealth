import { Study } from '@prisma/client';

export const studyFixtures: Study[] = [
  {
    id: 'eabb4ea7-0ff9-47fc-bb5c-2d11d5273516',
    name: 'test 1',
    createdAt: new Date(),
    updatedAt: new Date(),
    title: {
      de: 'de test title 1',
      en: 'en test title 1',
    },
    description: {
      de: 'de test description 1',
      en: 'en test description 1',
    },
    isActive: true,
    startsAt: new Date(),
    endsAt: new Date(),
  },
  {
    id: '89606099-b544-4c7c-a172-86951932a803',
    name: 'test 2',
    createdAt: new Date(),
    updatedAt: new Date(),
    title: {
      de: 'de test title 2',
      en: 'en test title 2',
    },
    description: {
      de: 'de test description 2',
      en: 'en test description 2',
    },
    isActive: true,
    startsAt: new Date(),
    endsAt: new Date(),
  },
];

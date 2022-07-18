import { Prisma, Study } from '@prisma/client';

const studies: Study[] = [
  {
    id: 'eabb4ea7-0ff9-47fc-bb5c-2d11d5273516',
    name: 'teststudy4321',
    createdAt: new Date(),
    updatedAt: new Date(),
    title: 'teststudy',
    description: 'study for testing',
    isActive: false,
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

const mockFindManyStudies = async (
  options?: Prisma.StudyFindManyArgs,
): Promise<Study[]> => {
  const whereOpts = options?.where;
  if (whereOpts) {
    if (typeof whereOpts.isActive === 'boolean') {
      return studies.filter((study) => study.isActive === whereOpts.isActive);
    }
  }
  return studies;
};

const mockFindUniqueStudy = async (
  options?: Prisma.StudyFindUniqueArgs,
): Promise<Study | null> => {
  const whereOpts = options?.where;
  if (whereOpts) {
    if (whereOpts.id != null) {
      const uniqueStudy = studies.filter((study) => study.id === whereOpts.id);
      if (uniqueStudy.length === 0) return null;
      if (uniqueStudy.length === 1) return uniqueStudy[0];
      throw new Error('Multiple elements are not possible for unique values');
    }
  }
  return null;
};

const mockStudyPrisma = {
  study: {
    findMany: mockFindManyStudies,
    findUnique: mockFindUniqueStudy,
    create: () => studies[0],
    delete: () => studies[0],
    update: () => studies[0],
  },
};

export const prismaStudyMock = {
  service: mockStudyPrisma,
  getAllStudies: (): Study[] => [...studies],
  getActiveStudies: (): Study[] => studies.filter((study) => study.isActive),
  getFirstStudy: (): Study => studies[0],
};

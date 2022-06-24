import { Study, Prisma } from '@prisma/client';

const studies: Study[] = [
  {
    id: '1234',
    name: 'teststudy1234',
    createdAt: new Date(),
    updatedAt: new Date(),
    title: 'teststudy',
    description: 'study for testing',
    isActive: true,
    startsAt: new Date(),
    endsAt: new Date(),
  },
  {
    id: '4321',
    name: 'teststudy4321',
    createdAt: new Date(),
    updatedAt: new Date(),
    title: 'teststudy',
    description: 'study for testing',
    isActive: false,
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
  },
};

export const prismaStudyMock = {
  service: mockStudyPrisma,
  getAllStudies: (): Study[] => [...studies],
  getActiveStudies: (): Study[] => studies.filter((study) => study.isActive),
  getFirstStudy: (): Study => studies[0],
};

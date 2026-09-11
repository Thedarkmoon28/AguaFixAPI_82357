import { Inject } from '@nestjs/common';

export function getRepositoryToken(entity: any): string {
  if (typeof entity === 'string') {
    return entity;
  }
  return `${entity.name}Repository`;
}

export function InjectRepository(entity: any) {
  return Inject(getRepositoryToken(entity));
}

export class TypeOrmModule {
  static forRoot(options?: any) {
    return {
      module: TypeOrmModule,
      providers: [],
    };
  }

  static forFeature(entities?: any[]) {
    return {
      module: TypeOrmModule,
      providers: [],
    };
  }
}

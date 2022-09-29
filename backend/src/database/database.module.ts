import { Global, Module } from '@nestjs/common';
import Knex from 'knex';
import { knexSnakeCaseMappers, Model } from 'objection';
import { ConstantsModule } from '../utils/constants/constants.module';
import { ConstantsService } from '../utils/constants/constants.service';
import { GymModel } from './models/gym.model';
import { PostModel } from './models/post.model';
import { TimingModel } from './models/timing.model';
import { TimingPostModel } from './models/timing_post.model';
import { UserModel } from './models/user.model';

const models = [GymModel, PostModel, TimingModel, TimingPostModel, UserModel];
const modelProviders = models.map((model) => ({
  provide: model.name,
  useValue: model,
}));

const providers = [
  ...modelProviders,
  {
    provide: 'KnexConnection',
    inject: [ConstantsService],
    useFactory: async (constantsService: ConstantsService) => {
      const knex = Knex({
        client: 'pg',
        connection: {
          host: constantsService.DATABASE_HOST,
          user: constantsService.DATABASE_USER,
          password: constantsService.DATABASE_PASSWORD,
          database: constantsService.DATABASE_NAME,
        },
        ...knexSnakeCaseMappers(),
      });

      Model.knex(knex);
      return knex;
    },
  },
];

@Global()
@Module({
  imports: [ConstantsModule],
  providers: [...providers],
  exports: [...providers],
})
export class DatabaseModule {}

import { Model } from 'objection';
import { BaseModel } from './base.model';
import { GymModel } from './gym.model';
import { TimingModel } from './timing.model';
import { UserModel } from './user.model';

export class PostModel extends BaseModel {
  static tableName = 'posts';

  readonly userId: string;
  readonly isBuy: boolean; // false means 'isSell'
  readonly numPasses: number;
  readonly price: number;
  readonly gymId: number;
  readonly date: Date;
  readonly openToClimbTogether: boolean;
  readonly optionalNote: string;

  readonly user: UserModel;
  readonly gym: GymModel;
  readonly timings: TimingModel[];

  static relationMappings = () => ({
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'posts.userId',
        to: 'users.id',
      },
    },
    gym: {
      relation: Model.BelongsToOneRelation,
      modelClass: GymModel,
      join: {
        from: 'posts.gymId',
        to: 'gyms.id',
      },
    },
    timings: {
      relation: Model.HasOneThroughRelation,
      modelClass: TimingModel,
      join: {
        from: 'posts.id',
        through: {
          from: 'timing_post.postId',
          to: 'timing_post.timingId',
        },
        to: 'timings.id',
      },
    },
  });
}

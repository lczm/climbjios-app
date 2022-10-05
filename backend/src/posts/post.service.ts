import { HttpException, Injectable } from '@nestjs/common';
import { GymsDaoService } from '../database/daos/gyms/gyms.dao.service';
import { PostsDaoService } from '../database/daos/posts/posts.dao.service';
import PatchPostDto from './dtos/patchPost.dto';
import CreatePostDto from './dtos/createPost.dto';
import SearchPostDto from './dtos/searchPost.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postsDaoService: PostsDaoService,
    private readonly gymsDaoService: GymsDaoService,
  ) {}

  getOwnPosts(userId: string) {
    return this.postsDaoService.getUserPosts(userId);
  }

  async createPost(userId: string, body: CreatePostDto) {
    /**
     * Pre-condition: DTO already checks that
     * - startDateTime and endDateTime fall on the same day
     * - startDateTime is before endDateTime
     * - both dates are after `new Date()`
     *  */

    const gym = await this.gymsDaoService.findById(body.gymId);
    if (!gym) {
      throw new HttpException('Invalid gym id!', 400);
    }

    return this.postsDaoService.create({
      userId,
      ...body,
      isClosed: false,
    });
  }

  async patchPost(userId: string, postId: string, body: PatchPostDto) {
    const post = await this.postsDaoService.getById(postId);
    if (post.userId !== userId) {
      throw new HttpException('Forbidden', 403);
    }

    const startDateTime = new Date(body.startDateTime ?? post.startDateTime);
    const endDateTime = new Date(body.endDateTime ?? post.endDateTime);

    if (startDateTime.toDateString() !== endDateTime.toDateString()) {
      // both start and end datetimes must be on same day
      return new HttpException(
        'startDateTime and endDateTime should fall on the same day!',
        400,
      );
    } else if (startDateTime > endDateTime) {
      // start comes before end datetime
      return new HttpException(
        'startDateTime should be before endDateTime!',
        400,
      );
    }

    return this.postsDaoService.patchById(postId, {
      ...body,
    });
  }

  searchPosts(query: SearchPostDto) {
    return this.postsDaoService.getUpcomingPosts(query);
  }
}

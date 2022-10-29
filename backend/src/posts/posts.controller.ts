import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import PatchPostDto from './dtos/patchPost.dto';
import CreatePostDto from './dtos/createPost.dto';
import { PostService } from './post.service';
import SearchPostDto from './dtos/searchPost.dto';
import { Public } from '../auth/jwtAuth/public.decorator';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getOwnPosts(@Req() req) {
    return this.postService.getOwnPosts(req.user.id);
  }

  @Post()
  createPost(@Req() req, @Body() body: CreatePostDto) {
    return this.postService.createPost(req.user.id, body);
  }

  @Get('search')
  searchPosts(
    @Query()
    query: SearchPostDto,
  ) {
    return this.postService.searchPosts(query);
  }

  @Public()
  @Get(':postId')
  getPost(@Param() params) {
    return this.postService.getPost(params.postId);
  }

  @Patch(':postId')
  patchPost(@Req() req, @Param() params, @Body() body: PatchPostDto) {
    return this.postService.patchPost(req.user.id, params.postId, body);
  }
}

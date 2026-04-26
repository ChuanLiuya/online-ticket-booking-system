import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie } from './entities/movie.entity';
import { DirectorsModule } from '../directors/directors.module';
import { ActorsModule } from '../actors/actors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), DirectorsModule, ActorsModule],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
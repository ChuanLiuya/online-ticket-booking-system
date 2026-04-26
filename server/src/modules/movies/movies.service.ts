import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { Director } from '../directors/entities/director.entity';
import { Actor } from '../actors/entities/actor.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const { director, actors, ...movieData } = createMovieDto;
    
    const movie = this.movieRepository.create(movieData);
    
    // 处理导演关联
    if (director) {
      const foundDirector = await this.directorRepository.findOne({ where: { id: director } });
      if (foundDirector) {
        movie.director = foundDirector;
      }
    }
    
    // 处理演员关联
    if (actors && actors.length > 0) {
      const foundActors = await this.actorRepository.findByIds(actors);
      movie.actors = foundActors;
    }
    
    return await this.movieRepository.save(movie);
  }

  async findAll(): Promise<Movie[]> {
    return await this.movieRepository.find({
      relations: ['director', 'actors'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['director', 'actors'],
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOne(id);
    const { director, actors, ...movieData } = updateMovieDto;
    
    Object.assign(movie, movieData);
    
    // 处理导演关联
    if (director) {
      const foundDirector = await this.directorRepository.findOne({ where: { id: director } });
      if (foundDirector) {
        movie.director = foundDirector;
      }
    }
    
    // 处理演员关联
    if (actors !== undefined) {
      if (actors.length > 0) {
        const foundActors = await this.actorRepository.findByIds(actors);
        movie.actors = foundActors;
      } else {
        movie.actors = [];
      }
    }
    
    return await this.movieRepository.save(movie);
  }

  async remove(id: string): Promise<void> {
    const movie = await this.findOne(id);
    await this.movieRepository.remove(movie);
  }

  async findByStatus(status: string): Promise<Movie[]> {
    return await this.movieRepository.find({
      where: { status: status as any },
      relations: ['director', 'actors'],
      order: { releasedAt: 'DESC' },
    });
  }
}
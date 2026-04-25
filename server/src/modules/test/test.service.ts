import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Test } from './entities/test.entity';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestService {
  constructor(
    @Inject('TEST_REPOSITORY')
    private testRepository: Repository<Test>,
  ) {}
  async create(test: CreateTestDto): Promise<Test> {
    return this.testRepository.save(test);
  }
  async findAll(): Promise<Test[]> {
    return this.testRepository.find();
  }
  async findOne(id: number): Promise<Test> {
    const test = await this.testRepository.findOne({ where: { id } });
    if (!test) {
      throw new NotFoundException(`Test with id ${id} not found`);
    }
    return test;
  }
  async update(id: number, test: UpdateTestDto): Promise<Test> {
    const result = await this.testRepository.update(id, test);
    if (result.affected === 0) {
      throw new NotFoundException(`Test with id ${id} not found`);
    }
    const updated = await this.testRepository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException(`Test with id ${id} not found`);
    }
    return updated;
  }
  async remove(id: number): Promise<true> {
    const result = await this.testRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Test with id ${id} not found`);
    }
    return true;
  }
}

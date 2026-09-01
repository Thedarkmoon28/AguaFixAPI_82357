import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from './entities/animal.entity';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
  ) {}

  async create(createAnimalDto: CreateAnimalDto): Promise<Animal> {
    const animal = this.animalRepository.create(createAnimalDto);
    return await this.animalRepository.save(animal);
  }

  async findAll(): Promise<Animal[]> {
    return await this.animalRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Animal> {
    const animal = await this.animalRepository.findOneBy({ id });
    if (!animal) {
      throw new NotFoundException(`Animal con ID ${id} no encontrado`);
    }
    return animal;
  }

  async update(id: number, updateAnimalDto: UpdateAnimalDto): Promise<Animal> {
    const animal = await this.findOne(id);
    const updatedAnimal = this.animalRepository.merge(animal, updateAnimalDto);
    return await this.animalRepository.save(updatedAnimal);
  }

  async remove(id: number): Promise<{ message: string }> {
    const animal = await this.findOne(id);
    await this.animalRepository.remove(animal);
    return { message: `Animal con ID ${id} eliminado correctamente` };
  }
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'animals' })
export class Animal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  especie: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  raza: string;

  @Column({ type: 'int' })
  edad: number;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    transformer: {
      to: (value?: number) => value,
      from: (value?: string) => (value !== null && value !== undefined ? parseFloat(value) : null),
    },
  })
  peso: number;
}

import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user with hashed password', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockImplementation((dto) =>
        Promise.resolve({ id: 1, ...dto }),
      );

      const createUserDto = {
        name: 'Carlos Gomez',
        email: 'carlos@municipio.gob',
        password: 'password123',
        isNotificationEnabled: true,
      };

      const result = await service.register(createUserDto);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(mockUsersService.create).toHaveBeenCalled();
      expect((result as any).password).toBeUndefined();
      expect(result.email).toBe(createUserDto.email);
      expect(result.id).toBe(1);
    });

    it('should throw BadRequestException if email already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: 1,
        email: 'carlos@municipio.gob',
      });

      const createUserDto = {
        name: 'Carlos Gomez',
        email: 'carlos@municipio.gob',
        password: 'password123',
      };

      await expect(service.register(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockUsersService.findByEmail.mockResolvedValue({
        id: 1,
        name: 'Carlos Gomez',
        email: 'carlos@municipio.gob',
        password: hashedPassword,
        isNotificationEnabled: true,
      });

      const result = await service.login({
        email: 'carlos@municipio.gob',
        password: 'password123',
      });

      expect(result.message).toBe('Inicio de sesión exitoso');
      expect(result.user.email).toBe('carlos@municipio.gob');
      expect((result.user as any).password).toBeUndefined();
    });

    it('should throw BadRequestException when user is not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'inexistente@municipio.gob',
          password: 'password123',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when password does not match', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockUsersService.findByEmail.mockResolvedValue({
        id: 1,
        name: 'Carlos Gomez',
        email: 'carlos@municipio.gob',
        password: hashedPassword,
        isNotificationEnabled: true,
      });

      await expect(
        service.login({
          email: 'carlos@municipio.gob',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});

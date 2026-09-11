import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockUser = {
    id: 1,
    name: 'Carlos Gomez',
    email: 'carlos@municipio.gob',
    isNotificationEnabled: true,
  };

  const mockAuthService = {
    register: jest.fn().mockResolvedValue(mockUser),
    login: jest.fn().mockResolvedValue({
      message: 'Inicio de sesión exitoso',
      user: mockUser,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('POST /auth/register should register a user', async () => {
    const dto = {
      name: 'Carlos Gomez',
      email: 'carlos@municipio.gob',
      password: 'password123',
    };

    const result = await controller.register(dto);
    expect(service.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockUser);
  });

  it('POST /auth/login should authenticate user', async () => {
    const dto = {
      email: 'carlos@municipio.gob',
      password: 'password123',
    };

    const result = await controller.login(dto);
    expect(service.login).toHaveBeenCalledWith(dto);
    expect(result.message).toBe('Inicio de sesión exitoso');
    expect(result.user).toEqual(mockUser);
  });
});

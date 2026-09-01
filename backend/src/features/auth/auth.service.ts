import { prisma } from '../../lib/prisma';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateToken } from '../../utils/jwt';
import { AppError } from '../../middleware/errorHandler';
import { AuthResponse, UserResponse } from './auth.types';
import { RegisterInput, LoginInput } from './auth.validator';

function sanitizeUser(user: { id: number; username: string; email: string; createdAt: Date }): UserResponse {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const existingEmail = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existingEmail) {
      throw new AppError('A user with this email address already exists.', 409);
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username: input.username },
    });
    if (existingUsername) {
      throw new AppError('A user with this username already exists.', 409);
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        username: input.username,
        email: input.email,
        passwordHash,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    return {
      user: sanitizeUser(user),
      token,
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const identifier = input.email || input.identifier;
    if (!identifier) {
      throw new AppError('Email or username is required.', 400);
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier },
        ],
      },
    });

    if (!user) {
      throw new AppError('Invalid email/username or password.', 401);
    }

    const isMatch = await comparePassword(input.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email/username or password.', 401);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    return {
      user: sanitizeUser(user),
      token,
    };
  }

  async getCurrentUser(userId: number): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User profile not found.', 404);
    }

    return sanitizeUser(user);
  }
}

export const authService = new AuthService();

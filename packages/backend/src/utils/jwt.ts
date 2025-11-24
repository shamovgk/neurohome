import jwt from 'jsonwebtoken';
import config from '@/config/env';

interface TokenPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload, 
    config.JWT_SECRET, 
    { expiresIn: config.JWT_EXPIRES_IN } as jwt.SignOptions
  );
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload, 
    config.JWT_SECRET, 
    { expiresIn: config.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
  );
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

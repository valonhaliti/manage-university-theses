import jwt from 'jsonwebtoken';

export const verifyToken = (authorization) => {
  const [authType, token] = authorization.trim().split(' ');
  if (authType !== 'Bearer') throw new Error('Expected a Bearer token');

  const decoded = jwt.verify(token, process.env.JWT_KEY);
  return decoded;
}

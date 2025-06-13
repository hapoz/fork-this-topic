import { User } from '../types/index.ts';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export class JWTAuth {
  private static readonly SECRET_KEY = Deno.env.get('JWT_SECRET') ||
    'your-secret-key';
  private static readonly EXPIRES_IN = '24h';

  static generateToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    // In a real application, you would use a proper JWT library
    // For this demo, we'll create a simple token structure
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadEncoded = btoa(JSON.stringify(payload));

    // Simple signature (in real app, use proper HMAC)
    const signature = btoa(this.SECRET_KEY + payloadEncoded);

    return `${header}.${payloadEncoded}.${signature}`;
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const [header, payload, signature] = parts;

      // Verify signature (simplified for demo)
      const expectedSignature = btoa(this.SECRET_KEY + payload);
      if (signature !== expectedSignature) {
        return null;
      }

      const decodedPayload = JSON.parse(atob(payload)) as JWTPayload;

      // Check expiration (simplified for demo)
      if (decodedPayload.exp && Date.now() > decodedPayload.exp * 1000) {
        return null;
      }

      return decodedPayload;
    } catch (error) {
      return null;
    }
  }

  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

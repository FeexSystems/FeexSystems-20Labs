import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

export function applyProductionSecurity(app: any) {
  // Use helmet for HTTP headers
  app.use(helmet());

  // CORS: restrict origins in production
  app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || false,
    credentials: true,
  }));

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 200, // limit each IP
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  // Enforce HTTPS in production
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}

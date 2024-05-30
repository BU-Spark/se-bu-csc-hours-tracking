import express, { Request, Response } from 'express';
import next from 'next';
import session from 'express-session';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { API_URL } from '../client/src/constants';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
  }));

  server.use('/api/auth', createProxyMiddleware({
    target: `${API_URL}`,
    changeOrigin: true,
    pathRewrite: {
      '^/api/auth': '/api/auth'
    },
  }));

  server.all('*', (req: Request, res: Response) => {
    return handle(req, res);
  });

  if (dev) {
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  }
});

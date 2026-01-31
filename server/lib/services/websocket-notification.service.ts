import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

export class WebSocketNotificationService {
  private io: SocketIOServer;

  constructor(httpServer: HttpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  public sendNotification(userId: string, notification: any) {
    this.io.to(`user:${userId}`).emit('notification', notification);
  }

  public sendBroadcast(event: string, data: any) {
    this.io.emit(event, data);
  }
}

export let websocketNotificationService: WebSocketNotificationService;
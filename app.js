import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

import './src/database';

import express from 'express';

import userRoutes from './src/routes/userRoutes';
import profileRoutes from './src/routes/profileRoutes';
import postRoutes from './src/routes/postRoutes';
import commentRoutes from './src/routes/commentRoutes';
import reactionRoutes from './src/routes/reactionRoutes';
import messageRoutes from './src/routes/messageRoutes';
import followRoutes from './src/routes/followRoutes';
import notificationRoutes from './src/routes/notificationRoutes';
import groupRoutes from './src/routes/groupRoutes';
import groupMemberRoutes from './src/routes/groupMemberRoutes';
import ratingRoutes from './src/routes/ratingRoutes';
import reportRoutes from './src/routes/reportRoutes';
import feedRoutes from './src/routes/feedRoutes';
import tokenRoutes from './src/routes/tokenRoutes';
import passwordResetRoutes from './src/routes/passwordResetRoutes';


class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(express.static(resolve(__dirname, 'uploads')));
  }

  routes() {
    this.app.use('/users', userRoutes);
    this.app.use('/profiles', profileRoutes);
    this.app.use('/posts', postRoutes);
    this.app.use('/comments', commentRoutes);
    this.app.use('/reactions', reactionRoutes);
    this.app.use('/messages', messageRoutes);
    this.app.use('/follow', followRoutes);
    this.app.use('/notifications', notificationRoutes);
    this.app.use('/groups', groupRoutes);
    this.app.use('/groups', groupMemberRoutes);
    this.app.use('/ratings', ratingRoutes);
    this.app.use('/reports', reportRoutes);
    this.app.use('/feed', feedRoutes);
    this.app.use('/tokens', tokenRoutes);
    this.app.use('/password', passwordResetRoutes);

  }
}

export default new App().app;

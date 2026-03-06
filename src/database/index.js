import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database';
import User from '../models/User';
import Comment from '../models/Comment';
import Follow from '../models/Follow';
import Group from '../models/Group';
import GroupMember from '../models/GroupMember';
import Hashtag from '../models/Hashtag';
import Message from '../models/Message';
import Notification from '../models/Notification';
import Post from '../models/Post';
import PostHashtag from '../models/PostHashtag';
import PostImage from '../models/PostImage';
import Profile from '../models/Profile';
import Rating from '../models/Rating';
import Reaction from '../models/Reaction';
import Report from '../models/Report';


const models = [User, Comment, Follow, Group, GroupMember,
  Hashtag, Message, Notification, Post, PostHashtag, PostImage, Profile, Rating, Reaction, Report];

const connection = new Sequelize(databaseConfig);

// Inicializa todos os models
models.forEach((model) => model.init(connection));

// Cria associações
models.forEach((model) => {
  if (model.associate) {
    model.associate({ User, Comment, Follow, Group, GroupMember, Hashtag, Message, Notification,
      Post,PostHashtag, PostImage, Profile, Rating, Reaction, Report });
  }
});

export { connection, User, Comment, Follow, Group, GroupMember, Hashtag, Message, Notification,
  Post, PostHashtag, PostImage, Profile, Rating,Reaction, Report };

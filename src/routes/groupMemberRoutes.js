import { Router } from 'express';
import GroupMemberController from '../controllers/GroupMemberController.js';

const router = new Router();

router.post('/:group_id/join',GroupMemberController.join);

router.delete('/:group_id/leave', GroupMemberController.leave);

router.get('/:group_id/members', GroupMemberController.members);

router.put('/:group_id/promote', GroupMemberController.promote);

export default router;

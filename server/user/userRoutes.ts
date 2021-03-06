/**
 * Created by Christopher on 17.06.2017.
 */
import UserController from './userController';

const express = require('express');
const router = express.Router();
const userController = new UserController();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const user = require('../middleware/user');

router.route('/').get(auth.required, admin.isAdmin, userController.getAll);
router.route('/').post(user.removeRole, userController.insert);

router.route('/:id').get(auth.required, user.isSelfOrAdmin, userController.get);
router.route('/:id').put(auth.required, user.isSelfOrAdmin, userController.update);
router.route('/:id').delete(auth.required, user.isSelfOrAdmin, userController.delete);

router.route('/login').post(userController.login);

module.exports = router;

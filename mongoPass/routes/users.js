const usersRouter = require('express').Router();
const { User, validateUser } = require('../models/users');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const auth = require('../middleware/auth');

usersRouter.get('/me', auth, async (req, res) => {
   //req.user._id
   const user = await User.findById(req.user._id).select('-password');
   res.json(user); //security problem...
});

usersRouter.post('/', async (req, res) => {
    const err = validateUser(req.body).error;

    if (err)
        return res.status(400).json({
            errors: err.details.map(d => d.message)
        })

    let user = await User.findOne({ email: req.body.email });

    if (user)
        return res.status(400).json({ message: `${user.email} already exists` });

    user = new User(req.body);

    user.password = await bcrypt.hash(req.body.password, 12);
    await user.save();

    res.status(201).json(_.pick(user, ['name', 'email', 'biz', '_id']));
});

module.exports = usersRouter;


 
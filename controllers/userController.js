const { User, Thought } = require('../models');

/*
// Aggregate function to get the number of students overall
const friendCount = async () => {
    const numberOfFriends = await User.aggregate()
      .count('numberOfFriends');
    return numberOfFriends;
  } */

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // update a user with new data
  async updateUser(req, res) {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json({ message: 'User updated deleted!' })
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a user and associated apps
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and associated thoughts where deleted!' })
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // add a new friend
  async addFriend(req, res) {
    //console.log("adding a friend");
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }

        res.json({ message: `${req.params.friendId} is now your friend!` })
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a friend from friend list
  async removeFriend(req, res) {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }

        await Thought.deleteMany({ _id: { $in: user.thoughts } });
        res.json({ message: `${req.params.friendId} is no longer your friend :'(` })
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

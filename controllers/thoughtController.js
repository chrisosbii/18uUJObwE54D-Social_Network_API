const { User, Thought, Reaction } = require('../models');

module.exports = {
    // Get all users
    async getThoughts(req, res) {
      try {
        const thoughts = await Thought.find();
        res.json(thoughts);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    // Get a single thought
    async getSingleThought(req, res) {
      try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId })
          .select('-__v');
  
        if (!thought) {
          return res.status(404).json({ message: 'No thought with that ID' });
        }
  
        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    // create a new thought
    async createThought(req, res) {
      try {
        const thought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { $addToSet: { thoughts: thought._id } },
            { runValidators: true, new: true }
        );
        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    // update a thought with new data
    async updateThought(req, res) {
      try {
          const thought = await Thought.findOneAndUpdate(
              { _id: req.params.thoughtId },
              { $set: req.body },
              { runValidators: true, new: true }
          );
  
        if (!thought) {
          return res.status(404).json({ message: 'No thought with that ID' });
        }
  
        res.json({ message: 'thought updated!' })
      } catch (err) {
        res.status(500).json(err);
      }
    },
    // Delete a thought and associated apps
    async deleteThought(req, res) {
      try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
  
        if (!thought) {
          return res.status(404).json({ message: 'No thought with that ID' });
        }
  
        res.json({ message: 'thought was deleted!' })
      } catch (err) {
        res.status(500).json(err);
      }
    },
    // add a new friend
    async createReaction(req, res) {
        try {
            const reaction = await Reaction.create(req.body);
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { thoughts: reaction } },
                { runValidators: true, new: true }
            );
    
            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }
    
            res.json(thought)
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Delete a friend from friend list
    async removeReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: req.params.reactionId } },
                { runValidators: true, new: true }
            );
    
            if (!thought) {
                return res.status(404).json({ message: 'Thought does not exist' });
            }
    
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
  };
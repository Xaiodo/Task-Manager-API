const express = require('express');
const { Group } = require('../models/group');

const router = express.Router();

router.get('/:userId', async (request, response) => {
  const groupList = await Group.find(
    {
      users: request.params.userId,
    },
  );
  if (!groupList) {
    response.status(500).json({ success: false });
  }
  response.send(groupList);
});

router.post('/:userId', async (request, response) => {
  const group = await Group.findOne(
    {
      name: request.body.name,
      secretWord: request.body.secretWord,
    },
  );
  if (!group) {
    response.status(404).json({ success: false, message: 'Group can not be found' });
  } else {
    const { users } = group;
    if (users.includes(request.params.userId)) {
      response.status(405).json({ success: false, message: 'You are already in the group' });
    } else {
      group.users.push(request.params.userId);
      const updatedGroup = await group.save();
      if (!updatedGroup) {
        response.status(500).json({ success: false, message: 'Something went wrong(' });
      } else { response.status(200).json({ success: true, message: `You are now in the ${group.name}` }); }
    }
  }
});

router.put('/:id', async (request, response) => {
  const updatedGroup = await Group.findById(
    request.params.id,
    {
      name: request.body.name,
      imageUrl: request.body.imageUrl,
    },
    { new: false },
  );
  if (!updatedGroup) {
    response.status(500).json({ success: false, message: 'Group can not be updated' });
  } else {
    const saveUpdatedGroup = await updatedGroup.save();
    if (!saveUpdatedGroup) {
      response.status(500).json({ success: false, message: 'Group can not be updated' });
    }
    response.status(200).json({ success: true, message: 'Group updated successfully' });
  }
});

router.post('/', async (request, response) => {
  try {
    const canCreate = await Group.findOne({ name: request.body.name });
    if (canCreate) response.status(409).json({ success: false, message: 'Group with this name already exists' });
    else {
      const group = new Group({
        name: request.body.name,
        ownerId: request.body.ownerId,
        imageUrl: request.body.imageUrl,
        users: [request.body.ownerId],
        secretWord: request.body.secretWord,
      });
      const createdGroup = await group.save();
      if (!createdGroup) response.status(404).json({ success: false, message: 'Group can not be created' });
      else response.status(200).json(createdGroup);
    }
  } catch (err) {
    response.status(500).json({ success: false, message: 'Something wrong with server' });
  }
});

router.delete('/:id', async (request, response) => {
  const group = await Group.findById(request.params.id);
  let { ownerId } = group;
  ownerId = ownerId.toString();
  if (ownerId !== request.body.ownerId) {
    response.status(401).json({ success: false, message: 'You are not the owner of this group' });
  } else {
    const deletedGroup = await Group.findByIdAndRemove(request.params.id);
    if (!deletedGroup) {
      response.status(500).json({ success: false, message: 'Group can not be deleted' });
    }
    response.status(200).json({ success: true, message: 'Group deleted successfully' });
  }
});

module.exports = router;

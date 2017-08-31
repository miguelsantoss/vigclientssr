import express from 'express';
import Client from '../models/clients';

const router = express.Router();
router.get('/', (req, res) => {
  // If user isnt authenticated, return 401 Unauthorized
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  const userId = req.user.id;
  Client.where({ id: userId })
    .fetch({ withRelated: ['contacts'] })
    .then(info => {
      // Just to be safe
      if (!info) {
        res.sendStatus(404);
        return;
      }
      const infoItem = info.toJSON();
      // --------------------------------------------------------
      // Clean up the contacts array by deleting any unnecessary
      // fields from the contact object
      // --------------------------------------------------------
      for (let i = 0; i < infoItem.contacts.length; i += 1) {
        const contact = infoItem.contacts[i];
        delete contact.client_id;
        delete contact.id;
        delete contact.emergency;
        delete contact.comment;
      }
      res.json({ info: infoItem });
    });
});

export default router;

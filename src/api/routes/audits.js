import express from 'express';
import Audits from '../models/audits';

const router = express.Router();

router.get('/all', (req, res) => {
  // If user isnt authenticated, return 401 Unauthorized
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  const userId = req.user.id;
  Audits.query({
    select: ['id', 'category', 'created_at', 'closed_at', 'serial_number'],
    where: { client_id: userId },
  })
    .fetchAll({ withRelated: ['scans', 'pages'] })
    .then(audits => {
      const auditList = audits.toJSON();
      // --------------------------------------------------------
      // No need to check for authorization: We fetch all the audits
      // that belong to the user's client_id
      // --------------------------------------------------------
      for (let i = 0; i < auditList.length; i += 1) {
        const auditItem = auditList[i];
        if (auditItem.scans) {
          for (let j = 0; j < auditItem.scans.length; j += 1) {
            const scan = auditItem.scans[j];
            delete scan.locked;
            delete scan.state;
            delete scan.audit_id;
            delete scan.client_id;
            delete scan.created_at;
            delete scan.updated_at;
          }
        }
        if (auditItem.pages) {
          for (let j = 0; j < auditItem.pages.length; j += 1) {
            const page = auditItem.pages[j];
            delete page.locked;
            delete page.state;
            delete page.audit_id;
            delete page.client_id;
            delete page.created_at;
            delete page.updated_at;
          }
        }
      }
      // Sort the audits by date server side
      auditList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      res.json({ audits: auditList });
    });
});

router.get('/:id', (req, res) => {
  // If user isnt authenticated, return 401 Unauthorized
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  const userId = req.user.id;
  Audits.query({
    select: [
      'id',
      'category',
      'created_at',
      'closed_at',
      'serial_number',
      'client_id',
    ],
    where: { id: req.params.id },
  })
    .fetch({ withRelated: ['scans', 'pages'] })
    .then(audit => {
      // If audit is null, doesn't exist, return 404 Not Found
      if (!audit) {
        res.sendStatus(404);
        return;
      }
      const auditItem = audit.toJSON();
      // Check user access
      if (auditItem.client_id === userId) {
        // --------------------------------------------------------
        // Populate audits object with the scan list or page list
        // to display in the frontend
        // --------------------------------------------------------
        // Additionaly, remove fields that client shouldn't have
        // access to, both in scan Item and page Item
        // --------------------------------------------------------
        if (auditItem.scans) {
          for (let i = 0; i < auditItem.scans.length; i += 1) {
            const scan = auditItem.scans[i];
            delete scan.locked;
            delete scan.state;
            delete scan.audit_id;
            delete scan.client_id;
            delete scan.created_at;
            delete scan.updated_at;
          }
        }
        if (auditItem.pages) {
          for (let i = 0; i < auditItem.pages.length; i += 1) {
            const page = auditItem.pages[i];
            delete page.locked;
            delete page.state;
            delete page.audit_id;
            delete page.client_id;
            delete page.created_at;
            delete page.updated_at;
          }
        }
        res.json({ audit: auditItem });
      } else {
        // --------------------------------------------------------
        // If the client_id from the user doesn't match the client_id
        // from the audit the user doesn't have access to that specific
        // audit. Return 404 Not Found to avoid giving internal information
        // --------------------------------------------------------
        res.sendStatus(404);
      }
    });
});

export default router;

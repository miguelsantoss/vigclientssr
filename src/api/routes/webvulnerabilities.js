import express from 'express';

import WebVulnerabilities from '../models/webVulnerabilities';

const router = express.Router();
router.get('/:id', (req, res) => {
  // If user isnt authenticated, return 401 Unauthorized
  if (!req.user) {
    res.sendStatus(401);
    return;
  }

  const id = req.params.id;
  const userId = req.user.id;
  WebVulnerabilities.query({
    select: [
      'affects',
      'cvss_score',
      'cwe',
      'client_id',
      'description',
      'id',
      'impact',
      'page_id',
      'request',
      'response',
      'risk_factor',
      'severity',
      'solution',
      'title',
    ],
    where: { id },
  })
    .fetch({ withRelated: 'pages.audits' })
    .then(vuln => {
      // If vuln does not exist, return 404 Not Found
      if (!vuln) {
        res.sendStatus(404);
        return;
      }
      const vulnItem = vuln.toJSON();
      // Check user access
      if (vulnItem.client_id === userId) {
        // --------------------------------------------------------
        // Add some audit/page info to the page item to facilitate the
        // breadcrumb creation in the frontend. Delete any
        // unnecessary or internally-used fields from the vuln item
        // --------------------------------------------------------
        vulnItem.audit_id = vulnItem.pages.audits.id;
        vulnItem.audit_date = vulnItem.pages.audits.created_at;
        vulnItem.page_url = vulnItem.pages.url;
        delete vulnItem.pages;
        delete vulnItem.client_id;
        delete vulnItem.created_at;
        delete vulnItem.updated_at;
        delete vulnItem.confirmed;
        delete vulnItem.content_revised;
        delete vulnItem.img_allowed;
        delete vulnItem.locked;
        delete vulnItem.params_allowed;
        delete vulnItem.source;
        delete vulnItem.source_id;
        delete vulnItem.status;
        // --------------------------------------------------------
        // Risk factors go from 0 to 3. Change any level 4
        // vulnerability to level 3, to help understanding
        // --------------------------------------------------------
        if (vulnItem.risk_factor > 3) vulnItem.risk_factor = 3;
        res.send({ webvulnerability: vulnItem });
      } else {
        // --------------------------------------------------------
        // If the client_id from the user doesn't match the client_id
        // from the audit the user doesn't have access to that specific
        // vulnerability. Return 404 Not Found to avoid giving internal
        // information
        // --------------------------------------------------------
        res.sendStatus(404);
      }
    });
});

export default router;

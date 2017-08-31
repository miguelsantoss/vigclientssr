import express from 'express';
import Pages from '../models/pages';

const router = express.Router();
router.get('/:id', (req, res) => {
  // If user isnt authenticated, return 401 Unauthorized
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  const id = req.params.id;
  const userId = req.user.id;
  Pages.query({
    select: ['id', 'url', 'client_id', 'audit_id'],
    where: { id },
  })
    .fetch({ withRelated: ['audits', 'webVulnerabilities'] })
    .then(page => {
      // If page is null, it doesn't exist. return 404 Not Found
      if (!page) {
        res.sendStatus(404);
        return;
      }
      const pageItem = page.toJSON();
      // Check user access to page
      if (pageItem.client_id === userId) {
        // --------------------------------------------------------
        // Add some audit info to the page item to facilitate the
        // breadcrumb creation in the frontend. Delete any
        // unnecessary or internally-used fields from the page item
        // --------------------------------------------------------
        pageItem.audit_date = pageItem.audits.created_at;
        delete pageItem.client_id;
        delete pageItem.audits;
        // --------------------------------------------------------
        // Delete unnecessary or internally-used fields from the
        // web vulnerabilities array
        // --------------------------------------------------------
        for (let i = 0; i < pageItem.webVulnerabilities.length; i += 1) {
          const vuln = pageItem.webVulnerabilities[i];
          // --------------------------------------------------------
          // Risk factors go from 0 to 3. Change any level 4
          // vulnerability to level 3, to help understanding
          // --------------------------------------------------------
          if (vuln.risk_factor > 3) vuln.risk_factor = 3;
          delete vuln.source;
          delete vuln.source_id;
          delete vuln.status;
          delete vuln.img_allowed;
          delete vuln.locked;
          delete vuln.params_allowed;
          delete vuln.confirmed;
          delete vuln.content_revised;
          delete vuln.created_at;
          delete vuln.updated_at;
        }
        // --------------------------------------------------------
        // Sort resulving vulnerabiltty array by the risk level
        // and by name, within the same level
        // --------------------------------------------------------
        pageItem.webVulnerabilities.sort((a, b) => {
          if (a.risk_factor < b.risk_factor) return 1;
          if (a.risk_factor > b.risk_factor) return -1;
          return a.title.localeCompare(b.title);
        });
        res.json({ page: pageItem });
      } else {
        // --------------------------------------------------------
        // If the client_id from the user doesn't match the client_id
        // from the page's audit the user doesn't have access to that
        // specific audit. Return 404 Not Found to avoid giving
        // internal information
        // --------------------------------------------------------
        res.sendStatus(404);
      }
    });
});

export default router;

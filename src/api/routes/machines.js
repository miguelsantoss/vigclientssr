import express from 'express';

import Machines from '../models/machines';

const router = express.Router();
router.get('/:id', (req, res) => {
  // If user isnt authenticated, return 401 Unauthorized
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  const id = req.params.id;
  const userId = req.user.id;
  Machines.query({
    select: ['*'],
    where: { id },
  })
    .fetch({ withRelated: ['scan.audits', 'vulnerabilities'] })
    .then(machine => {
      // If machine is null, it doesn't exist. return 404 Not Found
      if (!machine) {
        res.sendStatus(404);
        return;
      }
      const machineItem = machine.toJSON();
      // Check user access
      if (machineItem.client_id === userId) {
        // --------------------------------------------------------
        // Add some machine info to the page item to facilitate the
        // breadcrumb creation in the frontend. Delete unnecessary
        // or internally-used fields from the machine item
        // --------------------------------------------------------
        machineItem.audit_id = machineItem.scan.audit_id;
        machineItem.audit_date = machineItem.scan.audits.created_at;
        machineItem.scan_network = machineItem.scan.network;
        delete machineItem.scan;
        delete machineItem.confirmed;
        delete machineItem.content_filled;
        delete machineItem.locked;
        delete machineItem.low_vuln_nmbr;
        delete machineItem.medium_vuln_nmbr;
        delete machineItem.high_vuln_nmbr;
        delete machineItem.info_vuln_nmbr;
        delete machineItem.source;
        delete machineItem.source_id;
        delete machineItem.created_at;
        delete machineItem.updated_at;
        // --------------------------------------------------------
        // Delete unnecessary or internally-used fields from the
        // vulnerabilities array
        // --------------------------------------------------------
        for (let i = 0; i < machineItem.vulnerabilities.length; i += 1) {
          const vuln = machineItem.vulnerabilities[i];
          // --------------------------------------------------------
          // Risk factors go from 0 to 3. Change any level 4
          // vulnerability to level 3, to help understanding
          // --------------------------------------------------------
          if (vuln.risk_factor > 3) vuln.risk_factor = 3;
          delete vuln.created_at;
          delete vuln.updated_at;
          delete vuln.locked;
          delete vuln.source;
          delete vuln.source_id;
          delete vuln.confirmed;
          delete vuln.content_revised;
          delete vuln.output_allowed;
          delete vuln.added_manually;
        }
        res.json({ machine: machineItem });
      } else {
        // --------------------------------------------------------
        // If the client_id from the user doesn't match the client_id
        // from the machine's audit the user doesn't have access to that
        // specific machine. Return 404 Not Found to avoid giving
        // internal information
        // --------------------------------------------------------
        res.sendStatus(404);
      }
    });
});

export default router;

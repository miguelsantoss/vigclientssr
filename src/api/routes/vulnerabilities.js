import express from 'express';

import Vulnerabilities from '../models/vulnerabilities';

const router = express.Router();
router.get('/:id', (req, res) => {
  // If user isnt authenticated, return 401 Unauthorized
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  const id = req.params.id;
  const userId = req.user.id;
  Vulnerabilities.query({
    select: [
      'canvas_package',
      'category',
      'client_id',
      'cve',
      'cvss_score',
      'description',
      'edb_id',
      'example',
      'exploit_framework_canvas',
      'exploit_framework_core',
      'exploit_framework_metasploit',
      'exploitable',
      'id',
      'impact',
      'machine_id',
      'metasploit_name',
      'output',
      'port_number',
      'risk_factor',
      'solution',
      'summary',
      'title',
      'vid',
    ],
    where: { id },
  })
    .fetch({
      withRelated: ['clients', 'machines.scan'],
    })
    .then(vuln => {
      // If vuln does not exist, return 404 Not Found
      if (!vuln) {
        res.sendStatus(404);
        return;
      }
      const vulnItem = vuln.toJSON();
      // Check user access
      if (vulnItem.clients.id === userId) {
        // --------------------------------------------------------
        // Risk factors go from 0 to 3. Change any level 4
        // vulnerability to level 3, to help understanding
        // --------------------------------------------------------
        if (vulnItem.risk_factor > 3) vulnItem.risk_factor = 3;
        // --------------------------------------------------------
        // Add some audit/scan info to the page item to facilitate the
        // breadcrumb creation in the frontend. Delete any
        // unnecessary or internally-used fields from the vuln item
        // --------------------------------------------------------
        vulnItem.scan_id = vulnItem.machines.scan.id;
        vulnItem.scan_network = vulnItem.machines.scan.network;
        vulnItem.machine_ip = vulnItem.machines.ip_address;
        vulnItem.audit_id = vulnItem.machines.scan.audit_id;
        delete vulnItem.clients;
        delete vulnItem.created_at;
        delete vulnItem.updated_at;
        delete vulnItem.machines;
        // Prepare array of machines with the same vulnerability
        vulnItem.machinesWithVuln = [vulnItem.machine_id];
        // --------------------------------------------------------
        // Query DB for vulnerabilities with the same VID, to
        // in order to look for related machines belinging to
        // the client
        // --------------------------------------------------------
        Vulnerabilities.query({
          select: [
            'canvas_package',
            'category',
            'client_id',
            'cve',
            'cvss_score',
            'description',
            'edb_id',
            'example',
            'exploit_framework_canvas',
            'exploit_framework_core',
            'exploit_framework_metasploit',
            'exploitable',
            'id',
            'impact',
            'machine_id',
            'metasploit_name',
            'output',
            'port_number',
            'risk_factor',
            'solution',
            'summary',
            'title',
            'vid',
          ],
          where: { vid: vulnItem.vid },
        })
          .fetchAll({ withRelated: ['clients', 'machines'] })
          .then(vuln2 => {
            const vulnItem2 = vuln2.toJSON();
            for (let i = 0; i < vulnItem2.length; i += 1) {
              const vulnI = vulnItem2[i];
              if (vulnI.id !== vulnItem.id) {
                vulnItem.machinesWithVuln.push(vulnI.machine_id);
              }
            }
          });
        res.send({ vulnerability: vulnItem });
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

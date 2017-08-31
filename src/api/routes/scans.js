import express from 'express';
import Scans from '../models/scans';

const router = express.Router();
const vulnExists = (array, vid) => {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].vid === vid) return i;
  }
  return false;
};

router.get('/:id', (req, res) => {
  // If user isnt authenticated, return 401 Unauthorized
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  const id = req.params.id;
  const userId = req.user.id;
  Scans.query({
    select: ['id', 'category', 'audit_id', 'created_at', 'network'],
    where: { id },
  })
    .fetch({
      withRelated: [
        'machines.vulnerabilities',
        'machines.servicePorts',
        'audits',
      ],
    })
    .then(scan => {
      // If scan does not exist, return 404 Not Found
      if (!scan) {
        res.sendStatus(404);
        return;
      }
      const scanItem = scan.toJSON();
      // Check user access
      if (scanItem.audits.client_id === userId) {
        // --------------------------------------------------------
        // Add some audit info to the page item to facilitate the
        // breadcrumb creation in the frontend. Delete any
        // unnecessary or internally-used fields from the scan item
        // --------------------------------------------------------
        scanItem.audit_date = scanItem.audits.created_at;
        delete scanItem.audits;
        // --------------------------------------------------------
        // Create an empty list of vulnerabilities to put all the
        // vulnerabilities from all the machines in the scan
        // --------------------------------------------------------
        scanItem.vulnerabilities = [];
        for (let i = 0; i < scanItem.machines.length; i += 1) {
          const machine = scanItem.machines[i];
          // --------------------------------------------------------
          // Delete unnecessary or internally-used fields from each
          // machine item
          // --------------------------------------------------------
          delete machine.confirmed;
          delete machine.content_filled;
          delete machine.high_vuln_nmbr;
          delete machine.info_vuln_nmbr;
          delete machine.low_vuln_nmbr;
          delete machine.medium_vuln_nmbr;
          delete machine.locked;
          delete machine.source;
          delete machine.source_id;
          delete machine.client_id;
          delete machine.created_at;
          delete machine.updated_at;
          delete machine.group_id;
          delete machine.os_family;

          if (!machine.operating_system) {
            machine.operating_system = '';
          }

          // --------------------------------------------------------
          // For each machine item, iterate the vulnerability list
          // and check the scan's vulnerability list:
          //
          // If vulnerability is not present, create it, setting the
          // counter to 1 and add the machine associated to the field
          // of related machines.
          //
          // If the vulnerability already exists, then simply increase
          // the counter field and add the machine to the list of
          // related machines
          // --------------------------------------------------------
          // FIXME: machines in the same scan should make more sense
          // --------------------------------------------------------
          for (let j = 0; j < machine.vulnerabilities.length; j += 1) {
            const vuln = machine.vulnerabilities[j];
            // Search the scan's list of vulnerabilities
            const vulnIndex = vulnExists(scanItem.vulnerabilities, vuln.vid);
            if (vulnIndex !== -1 && !vulnIndex) {
              // --------------------------------------------------------
              // Risk factors go from 0 to 3. Change any level 4
              // vulnerability to level 3, to help understanding
              // --------------------------------------------------------
              if (vuln.risk_factor > 3) {
                vuln.risk_factor = 3;
              }
              // The counter and related machines list initialization
              vuln.count = 1;
              vuln.relatedMachines = [
                {
                  machine_id: machine.id,
                  vuln_id: vuln.id,
                },
              ];
              scanItem.vulnerabilities.push(vuln);
            } else {
              // If vuln exists, increase counter and add machine to list
              scanItem.vulnerabilities[vulnIndex].count += 1;
              scanItem.vulnerabilities[vulnIndex].relatedMachines.push({
                machine_id: machine.id,
                vuln_id: vuln.id,
              });
            }
          }
          // Remove the unnecessary or internally-used fields
          for (let j = 0; j < machine.servicePorts.length; j += 1) {
            const port = machine.servicePorts[j];
            delete port.locked;
            delete port.source;
            delete port.source_id;
            delete port.state;
            delete port.output_excel;
            delete port.created_at;
            delete port.updated_at;
          }
        }
        // --------------------------------------------------------
        // Sort the vulnerability list by risk levels
        // Inside the same risk, sort by vulnerability count
        // With vulnerabilities with the same risk and count,
        // sort by name
        // --------------------------------------------------------
        scanItem.vulnerabilities.sort((a, b) => {
          if (a.risk_factor < b.risk_factor) return 1;
          if (a.risk_factor > b.risk_factor) return -1;
          if (a.count < b.count) return 1;
          if (a.count > b.count) return -1;
          return a.title.localeCompare(b.title);
        });
        // Sort the vulnerability list in each of the machines as well
        scanItem.machines.forEach(machine => {
          machine.vulnerabilities.sort((a, b) => {
            if (a.risk_factor < b.risk_factor) return 1;
            if (a.risk_factor > b.risk_factor) return -1;
            if (a.count < b.count) return 1;
            if (a.count > b.count) return -1;
            return a.title.localeCompare(b.title);
          });
        });
        res.json({ scan: scanItem });
      } else {
        // --------------------------------------------------------
        // If the client_id from the user doesn't match the client_id
        // from the audit the user doesn't have access to that specific
        // scan. Return 404 Not Found to avoid giving internal information
        // --------------------------------------------------------
        res.sendStatus(404);
      }
    });
});

export default router;

import express from 'express';
import _ from 'lodash';

import authenticate from '../middlewares/authenticate';
import Audits from '../models/audits';

const router = express.Router();
router.use(authenticate);

router.get('/', (req, res) => {
  const userId = req.currentUser.id;
  Audits.query({
    select: ['id', 'category', 'created_at', 'closed_at', 'serial_number'],
    where: { client_id: userId },
  }).fetchAll({ withRelated: ['scans.machines.vulnerabilities'] }).then((audits) => {
    const auditList = audits.toJSON();
    auditList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const pieAllVulns = [];
    const pieLatestAuditVulns = [];
    const graphLatestVulns = [];
    for (let i = 0; i < 4; i += 1) {
      const vulnType = {
        risk_factor: i,
        totalVulns: 0,
      };
      const graphVulnType = {
        risk_factor: i,
        data: [],
      };
      pieAllVulns.push(_.cloneDeep(vulnType));
      pieLatestAuditVulns.push(_.cloneDeep(vulnType));
      graphLatestVulns.push(_.cloneDeep(graphVulnType));
    }

    auditList.forEach((audit) => {
      if (audit.category === 'web') {

      } else {
        audit.scans.forEach((scan) => {
          scan.machines.forEach((machine) => {
            machine.vulnerabilities.forEach((vuln) => {
              const risk = vuln.risk_factor === 4 ? 3 : vuln.risk_factor;
              pieAllVulns[risk].totalVulns += 1;
            });
          });
        });
      }
    });
    if (auditList[0].category === 'web') {

    } else {
      auditList[0].scans.forEach((scan) => {
        scan.machines.forEach((machine) => {
          machine.vulnerabilities.forEach((vuln) => {
            const risk = vuln.risk_factor === 4 ? 3 : vuln.risk_factor;
            pieLatestAuditVulns[risk].totalVulns += 1;
          });
        });
      });
    }
    const pieData = {
      all: pieAllVulns,
      latest: pieLatestAuditVulns,
    };
    const lineGraphData = {
      all: {},
      latest: graphLatestVulns,
    };
    const vizData = {
      pieData,
    };
    res.json(vizData);
  });
});

export default router;

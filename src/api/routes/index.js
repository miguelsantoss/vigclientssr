import express from 'express';
import users from './users';
import auth from './auth';
import events from './events';
import audits from './audits';
import profile from './profile';
import scans from './scans';
import pages from './pages';
import machines from './machines';
import vulnerabilities from './vulnerabilities';
import webvulnerabilities from './webvulnerabilities';
import viz from './viz';

const router = express.Router();

router.use('/users', users);
router.use('/auth', auth);
router.use('/events', events);
router.use('/audit', audits);
router.use('/profile', profile);
router.use('/scan', scans);
router.use('/page', pages);
router.use('/machine', machines);
router.use('/vulnerability', vulnerabilities);
router.use('/webvulnerability', webvulnerabilities);
router.use('/viz', viz);

export default router;

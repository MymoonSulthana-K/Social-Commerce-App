const express = require('express');
const router = express.Router();
const { startReferral, checkReferralStatus } = require('../controllers/referralController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startReferral);
router.get('/status/:productId', protect, checkReferralStatus);

module.exports = router;
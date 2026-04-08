const express = require('express');
const router = express.Router();
const { startReferral, checkReferralStatus, checkReferredUserDiscount } = require('../controllers/referralController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startReferral);
router.get('/status/:productId', protect, checkReferralStatus);
router.get('/check-referred-discount', protect, checkReferredUserDiscount);

module.exports = router;
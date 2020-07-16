const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: 'test api',
  });
});

router.post('/', (req, res) => {
  console.log(req.body);
  res.json({
    message: 'post a log',
  });
});
module.exports = router;

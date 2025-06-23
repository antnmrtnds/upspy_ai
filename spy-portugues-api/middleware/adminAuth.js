module.exports = (req, res, next) => {
    const token = req.get('authorization');
    const expected = process.env.ADMIN_TOKEN;
    if (expected && token === `Bearer ${expected}`) {
      return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
  };
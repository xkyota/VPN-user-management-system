const validateUser = (req, res, next) => {
  const { full_name, email, vpn_username, status, expiry_date } = req.body;

  const allowedStatuses = ['active', 'inactive', 'expired'];

  if (!full_name || full_name.trim() === '') {
    return res.status(400).json({
      message: 'Full name is required'
    });
  }

  if (!email || email.trim() === '') {
    return res.status(400).json({
      message: 'Email is required'
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return res.status(400).json({
      message: 'Invalid email format'
    });
  }

  if (!vpn_username || vpn_username.trim() === '') {
    return res.status(400).json({
      message: 'VPN username is required'
    });
  }

  if (status && !allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: 'Status must be active, inactive, or expired'
    });
  }

  if (!expiry_date) {
    return res.status(400).json({
      message: 'Expiry date is required'
    });
  }

  const parsedDate = new Date(expiry_date);

  if (Number.isNaN(parsedDate.getTime())) {
    return res.status(400).json({
      message: 'Invalid expiry date'
    });
  }

  next();
};

module.exports = validateUser;
const authorizeRole = (...allowedRoles) => {

    return (req, res, next) => {

        // Check user's role
        if (!allowedRoles.includes(req.user.role)) {

            return res.status(403).json({
                message: 'Access forbidden. You do not have permission.'
            });

        }

        // User has permission
        next();
    };
};

module.exports = { authorizeRole };

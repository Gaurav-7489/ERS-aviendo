// middleware/clerkAuth.js
const { requireSession, getAuth } = require('@clerk/clerk-sdk-node');

const authMiddleware = (roles = []) => async (req, res, next) => {
  try {
    // Use Clerk to get the session
    const { userId, sessionId, claims } = getAuth(req);

    if (!userId) return res.status(401).json({ msg: 'Unauthorized' });

    // Attach user info to request
    req.userId = userId;

    // Optional: role check if you store it in user metadata
    // e.g., claims.publicMetadata.role = 'student' | 'teacher' | etc.
    if (roles.length) {
      const userRole = claims?.publicMetadata?.role;
      if (!roles.includes(userRole)) {
        return res.status(403).json({ msg: 'Forbidden: insufficient role' });
      }
      req.role = userRole;
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: 'Invalid session' });
  }
};

// Export pre-configured middlewares
module.exports = {
  verify: authMiddleware(),
  verifyStudent: authMiddleware(['student']),
  verifyTeacher: authMiddleware(['teacher']),
  verifyCR: authMiddleware(['cr']),
  verifyHOD: authMiddleware(['hod']),
};

import jwt from "jsonwebtoken"

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }
        const decoded = jwt.verify(token, process.env.SECRETKEY);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }
        req.body.loggedInUserId = decoded.userId;
        req.body.loggedInUserEmail = decoded.email;
       
        next()
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


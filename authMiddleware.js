const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ 
                message: "No token provided or invalid format" 
            });
        }

        const token = authHeader.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ 
                message: "No token provided" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        console.log("Authenticated user:", req.user.id, "Role:", req.user.role);
        
        next();
    } catch (error) {
        console.error("Auth error:", error);
        
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ 
                message: "Token expired. Please login again." 
            });
        }
        
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ 
                message: "Invalid token. Please login again." 
            });
        }
        
        return res.status(401).json({ 
            message: "Authentication failed",
            error: error.message 
        });
    }
};

module.exports = authenticate;
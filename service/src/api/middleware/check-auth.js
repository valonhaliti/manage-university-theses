import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) throw new Error('You must send an authorization header.');
        
        const [authType, token] = authorization.trim().split(' ')
        if (authType !== 'Bearer') throw new Error('Expected a Bearer token')
        
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};

import jwt from 'jsonwebtoken';

const getUserIdFromToken = (token) => {
    try {
        const decoded = jwt.decode(token);
        
        if (!decoded) {
            throw new Error('invalid token');
        }

        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            throw new Error('token expired');
        }

        return decoded.user_id;
    } catch(error) {
        throw new Error('invalid token');
    }
};

export default getUserIdFromToken;
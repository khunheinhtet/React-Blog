import jwt from "jsonwebtoken";


export const checkAuth = (req, res, next) => {
    const auth = req.headers.authorization;
    if(!auth){
        return res.sendStatus(401);
    }

    try {
        const accessToken = auth.split(" ")[1];
        const user = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.email = user.email;

        next();
    } catch (error) {
        return res.sendStatus(401);
    }
}
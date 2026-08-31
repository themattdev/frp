import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
    const token = req.cookies.token;

    if (!token)
        return res.redirect(process.env.AUTH_LOGIN_PATH);

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.clearCookie("token", { path: "/" });
        return res.redirect(process.env.AUTH_LOGIN_PATH);
    }
}

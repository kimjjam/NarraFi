module.exports = {
    authMiddleware: (req, res, next) => {
        console.log("Middleware 호출됨");
        next();
    }
};

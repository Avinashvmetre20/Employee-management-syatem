const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        message: err.message || "Something went wrong",
        stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
};

const notFound = (req, res, next) => {
    res.status(404);
    next(new Error("Not Found"));
};

module.exports = { errorHandler, notFound };

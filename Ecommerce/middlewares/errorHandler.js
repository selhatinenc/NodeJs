// not found

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // passing error to errorHandler middleware
};
// Error Handler
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    // console.log(err);
    res.status(statusCode);
    res.json({
        message: err?.message,
        stack: err?.stack,
    });
};
module.exports = { errorHandler, notFound };
class ExpressError extends Error {
    constructor(message, statusCode){
        //calling basic class constructor
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;
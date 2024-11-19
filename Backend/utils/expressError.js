class ExpressError extends Error{
    constructor(status,message)
    {
        super();
        this.status=status;
        this.message=message;
        this.isOperational=true;

    }
}

// errors/AuthenticationError.js
class SocketAuthenticationError extends Error {
    constructor(message, statusCode = 401) { // default status code 401 (Unauthorized)
      super(message);
      this.name = "AuthenticationError";
      this.code = "AUTH_ERROR";     // Custom code for easy identification
      this.statusCode = statusCode; // Custom status code
    }
  }
  

  

module.exports={ExpressError,SocketAuthenticationError};
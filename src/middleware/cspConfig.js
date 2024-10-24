const cspConfig = {
    defaultPolicy: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "connect-src 'self'",
      "media-src 'self'",
      "object-src 'none'"
    ]
  };


  export const cspConfigMiddleware=(req, res, next) => {
    res.setHeader('Content-Security-Policy', cspConfig.defaultPolicy);
    next();
  }
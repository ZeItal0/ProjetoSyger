import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

export const securityMiddleware = (app) => {
  app.use(helmet());

  app.use(express.json({ limit: "600kb" }));
  app.use(express.urlencoded({ extended: true, limit: "600kb" }));

  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "tente novamente mais tarde" },
  });

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "tente novamente mais tarde" },
  });

  app.use(generalLimiter);

  app.use("/login", loginLimiter);

  app.use(morgan("dev"));

  app.use((req, res, next) => {
    const suspiciousPatterns = ["<script", "SELECT ", "DROP ", "--", "/*", "*/", " OR "];
    const bodyStr = req.body ? JSON.stringify(req.body).toUpperCase() : "";

    if (suspiciousPatterns.some((p) => bodyStr.includes(p.trim().toUpperCase()))) {
      console.warn("tentativa suspeita encontrada", {
        ip: req.ip,
        path: req.originalUrl,
        method: req.method,
        body: req.body,
      });
    }
    next();
  });
  
};

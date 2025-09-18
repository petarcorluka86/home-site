import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "8000");

// 1. CORS middleware
app.use(cors());

// 2. JSON middleware
app.use(express.json());

// 3. Request logging middleware
app.use((req: express.Request, _, next: express.NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 4. Specific route handlers
app.get("/", (_, res: express.Response) => {
  res.json({
    message: "Node.js server is up and running!",
    day: new Date().toLocaleDateString("hr-HR", { weekday: "long" }),
    date: new Date().toLocaleDateString("hr-HR"),
    time: new Date().toLocaleTimeString("hr-HR"),
  });
});

app.use("/api/tasks", taskRoutes);

// 5. 404 handler (standardized shape)
app.use("*", (req: express.Request, res: express.Response) => {
  res
    .status(404)
    .json({ error: { type: "NotFoundError", message: "Route not found" } });
});

// 6. Centralized error handling middleware
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // Known domain errors
    if (error?.name === "TaskValidationError") {
      return res.status(400).json({
        error: { type: "TaskValidationError", message: error.message },
      });
    }
    if (error?.name === "TaskNotFoundError") {
      return res
        .status(404)
        .json({ error: { type: "TaskNotFoundError", message: error.message } });
    }

    // Fallback
    console.error("Unhandled error:", error);
    return res.status(500).json({
      error: {
        type: "InternalServerError",
        message: "Internal server error",
      },
    });
  }
);

async function startServer() {
  try {
    app.listen(port, hostname, () =>
      console.log(`Server running at http://${hostname}:${port}/`)
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

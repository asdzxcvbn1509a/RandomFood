import app from "./app.js";

const port = Number(process.env.PORT ?? 8787);

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

// Export for Vercel
export default app;
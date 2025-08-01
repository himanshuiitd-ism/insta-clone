import("./backend/index.js")
  .then(() => {
    console.log("Server started successfully");
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });

const serverURL =
  process.env.NODE_ENV === "production"
    ? "https://garden-app-server.vercel.app"
    : "http://localhost:5003";

export { serverURL };

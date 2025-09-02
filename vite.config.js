export default {
  root: "public",
  server: {
    port: 5173,
    open: "/index.html",
    proxy: {
      "/track": "http://127.0.0.1:8000",
      "/metrics": "http://127.0.0.1:8000"
    }
  }
}

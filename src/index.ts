import app from "./app";

const host = process.env.IP || "0.0.0.0";
const port = Number(process.env.PORT) || 3000 ;

app.listen(port, host, () => {
  console.log(`Server listening on port ${port} in the host ${host}`);
});

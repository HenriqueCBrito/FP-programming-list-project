import app from "./src/app.js";
import { getHost, getPort } from "./src/utils/config.js";

const port = getPort();
const host = getHost();

app.listen(port, host, () => {
  console.log(`Feedback API listening on http://${host}:${port}`);
});

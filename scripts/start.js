const app = require('../server')

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`server started at localhost:${port} 😎`);
  console.log("");
  console.log("");
  console.log(`http://localhost:${port}`);
  console.log("");
  console.log("");
});
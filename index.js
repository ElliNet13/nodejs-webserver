const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

function br(input) {
    return input.replace(/\n/g, "<br>");
}

function executeScript(scriptPath) {
  return new Promise((resolve, reject) => {
    exec(`node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${br(error.message)}`);
        return;
      }
      if (stderr) {
        reject(`stderr: ${bf(stderr)}`);
        return;
      }
      resolve(br(stdout));
    });
  });
}

app.use((req, res, next) => {
  let scriptPath;

  if (req.path === '/') {
    scriptPath = './scripts/index.js';
  } else {
    scriptPath = `./scripts${req.path}.js`;
  }

  if (!fs.existsSync(scriptPath)) {
    const notFoundScriptPath = './scripts/404.js';
    if (fs.existsSync(notFoundScriptPath)) {
      scriptPath = notFoundScriptPath;
    } else {
      res.status(404).send('404 Not Found');
      return;
    }
  }

  executeScript(scriptPath)
    .then((output) => {
      res.send(output);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.listen(PORT, () => {
  console.log("Webserver made by ElliNet13.")
  console.log(`Server is running on port ${PORT}`);
});
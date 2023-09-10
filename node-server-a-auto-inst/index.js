
import express from 'express';
import http from 'http';

const PORT = parseInt(process.env.PORT || '8080');
const app = express();

async function makeGetRequest() {
    return new Promise((resolve, reject) => {
      http.get('http://localhost:8090/rolldice', (response) => {
        let data = '';
  
        // Handle data chunks as they come in
        response.on('data', (chunk) => {
          data += chunk;
        });
  
        // Handle the end of the response
        response.on('end', () => {
          if (response.statusCode === 200) {
            resolve(data);
          } else {
            reject(`HTTP Request Failed with status code ${response.statusCode}`);
          }
        });
  
        // Handle errors
        response.on('error', (error) => {
          reject(error);
        });
      });
    });
  }

  function test1 () {
    return new Promise(resolve => {
        resolve(makeGetRequest());
    });
}

app.get('/rolldice', (req, res) => {
    const response = test1();
  res.send(response);
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});

console.log("hi")
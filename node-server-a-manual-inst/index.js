
const express = require('express');
const http = require('http');

const PORT = parseInt(process.env.PORT || '8080');
const app = express();

const opentelemetry = require('@opentelemetry/api');

const tracer = opentelemetry.trace.getTracer('dice-server', '0.1.0');

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

function mid1 () {
  return tracer.startActiveSpan('rollTheDice', (span) => {
    //const aa = opentelemetry.context.active();

    const ctx = opentelemetry.propagation.setBaggage(
      opentelemetry.context.active(),
      opentelemetry.propagation.createBaggage({ 'vendorId': { value: 'A0001' } })
    );  

    opentelemetry.context.with(ctx, () => {
      tracer.startActiveSpan('childSpan', (childSpan) => {
        test1();
        childSpan.end();
      });
    });
    //span.setAttribute('attr1', 'attr1_value');

    //const res = test1();
    span.end();
    return "fixed value";
  });
}

app.get('/rolldice', (req, res) => {
  const response = mid1();
  res.send(response);
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});

console.log("hi")
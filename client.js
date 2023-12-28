const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const serverUrl = "localhost:4000";
const echoProto = protoLoader.loadSync("echo.proto");
const echoDefinition = grpc.loadPackageDefinition(echoProto);
const { echo } = echoDefinition;
// make connection with server
//about echoUnary in echo.proto file
const client = new echo.echoService(
  serverUrl,
  grpc.credentials.createInsecure()
);
const echoData = {
  value: "test for developing",
};
client.echoUnary(echoData, (err, response) => {
  if (err) console.log(`error message : ${err}`);
  console.log(`response message : ${JSON.stringify(response)}`);
});
/// __________________________echoServerStream________________________________ ///
const serverStream = client.echoServerStream();
serverStream.on("data", (data) => {
  console.log(data);
});
serverStream.on("end", (error) => {
  console.log("client side Error ", error);
});
/// _________________________echoClientStream________________________________ ///
const echos = [
  { value: "value1" },
  { value: "value2" },
  { value: "value3" },
  { value: "value4" },
];
const clientStream = client.echoClientStream({}, (err, res) => {});
let index = 0;
/*
Make sure that the clientStream.write() function is not called more than once every 500 milliseconds, 
otherwise it may lead to multiple function calls and potentially problems.
*/

// this another way to do this
/*
for (let i = 0; i < echos.length; i++) {
  setTimeout(() => {
  clientStream.write(echos[i]);
  }, 500 );
  }
*/

setInterval(function () {
  // clientStream.write => clientStream.emit("data", echos[index])
  clientStream.write(echos[index]);
  index++;
  if (index == echos.length) {
    clientStream.end();
    clearImmediate(this);
  }
}, 500);

/// _________________________echoBidiStream________________________________ ///

const echoBidiStream = client.echoBidiStream();
setInterval(() => {
  echoBidiStream.write({ value: new Date().toLocaleString() });
}, 1000);
echoBidiStream.on('data' , data =>{
  console.log("data That Comes From server :",data);
})
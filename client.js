const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const serverUrl = "localhost:4000";
const echoProto = protoLoader.loadSync("echo.proto");
const echoDefinition = grpc.loadPackageDefinition(echoProto);
const { echo } = echoDefinition;
// make connection with server
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

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
/// __________________________________________________________ ///
const serverStream = client.echoServerStream();
serverStream.on("data", (data) => {
  console.log(data);
});
serverStream.on("end", (error) => {
  console.log("client side Error ", error);
});

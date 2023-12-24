const serverUrl = "localhost:4000";
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
//load echo proto file
const echoProto = protoLoader.loadSync("echo.proto");
// parse the loaded protobuf file
const echoDefinition = grpc.loadPackageDefinition(echoProto);
// extract the package from file
const { echo } = echoDefinition;
// create grpc server
const server = new grpc.Server();
function echoUnary(call, callback) {}
function echoClientStream(call, callback) {}
function echoServerStream(call, callback) {}
function echoBidiStream(call, callback) {}
server.addService(echo.echoService.service, {
  /* methode : (call, callback) => {
        some actions
    };*/
  echoUnary,
  echoClientStream,
  echoServerStream,
  echoBidiStream,
});
// run server
server.bindAsync(
  serverUrl,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) console.log(`failed to bind server ${error}`);
    console.log(`server running on port ${port}`);
    server.start();
  }
);

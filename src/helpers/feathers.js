const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');
const io = require('socket.io-client');
const auth = require('@feathersjs/authentication-client');

const production = !true;
const productionHost = "";
// const localHost = "http://localhost";
const localHost = "http://192.168.1.2";

const host = production ? productionHost : localHost;

const socket = io(`${host}:3030`);
const app = feathers();
// Setup the transport (Rest, Socket, etc.) here
app.configure(socketio(socket));
app.configure(auth({ storage: window.localStorage }));
export default app;

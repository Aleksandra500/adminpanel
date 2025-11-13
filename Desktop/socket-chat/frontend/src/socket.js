import { io } from "socket.io-client"

const socket = io("https://aleksandra-socket.alwaysdata.net");

export default socket;
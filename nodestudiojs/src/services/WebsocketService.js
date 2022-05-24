import { io } from "socket.io-client";
import { ActionTypes } from "../state/AppReducers";

export const createWebsocketServer = (dispatch) => {
    const sio = io("ws://localhost:8000", { path: "/ws/socket.io/", transports: ['websocket', 'polling'] });

    sio.on('connect', () => {
        //console.log('connected');
    });
    
    sio.on('disconnect', () => {
        //console.log('disconnected');
    });

    sio.on('status', data => { 
        //console.log('status:', data); 
        dispatch({ type:ActionTypes.UPDATE_WEBSOCKET, message:data });
    });
}

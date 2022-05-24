import socketio

def create_websocket(app):
    origins = ['http://localhost:3000', 'http://localhost:3001']
    sio = socketio.AsyncServer(
                cors_allowed_origins=origins,
                async_mode="asgi",
                logger=False,
                engineio_logger=False,
            )
    sapp = socketio.ASGIApp(sio)
    manager.sio = sio

    @sio.event
    def connect(sid, environ):
        print(sid, 'connected')

    @sio.event
    def disconnect(sid):
        print(sid, 'disconnected')
    
    app.mount('/ws', sapp)
    return sio


class WebsocketManager:
    def __init__(self):
        self.sio = None

    async def emit(self, eventName, message):
        await self.sio.emit(eventName, message)
        await self.sio.emit(eventName, message)

manager = WebsocketManager()


import time
import threading
import socketio

def create_websocket(app):
    origins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4000']
    sio = socketio.AsyncServer(
                cors_allowed_origins=origins,
                async_mode="asgi",
                logger=False,
                engineio_logger=False,
                ping_timeout=200000,
            )
    sapp = socketio.ASGIApp(sio)

    @sio.event
    def connect(sid, environ):
        print(sid, 'connected')

    @sio.event
    def disconnect(sid):
        print(sid, 'disconnected')
    
    app.mount('/ws', sapp)
    return sio

class WebsocketManager(threading.Thread):

    def run(self):
        
        self.sio = create_websocket(self.app)
        self.sessionActive = False
        self.history = None

        #while True:
            #time.sleep(1)
            #if(self.sessionActive):
            #    asyncio.run(self.message())
                
    def init(self, app):
            self.app = app
    
    async def startSession(self, id):
        print('Start Sesson')
        self.sessionActive = True
        await self.emit('status', { 'session_id':id, 'status':'compute', 'message':'Computing Nodes ...' })

    async def stopSession(self, id, process_time):
        print('Sesson Complete')
        self.sessionActive = False
        await self.emit('status', { 'session_id':id, 'status':'end', 'message':'Computation complete', 'time': process_time })

    async def errorSession(self, id, nodeid, error_message):
        self.sessionActive = False
        await self.emit('status', { 'session_id': id, 'nodeid': nodeid, 'status': 'error', 'message': "Error", 'error': error_message })

    async def updateSessionStatus(self, id, node_index, node_count, node_process_time, nodeid, nodeType):
        await self.emit('status', {'session_id':id, 'status':'compute', 'message': f'Node {node_index+1} of {node_count} Computed', 'time': node_process_time, 'id': nodeid, 'name': nodeType })

    async def message(self):
        print('Active Session')
        await self.emit('status', {'status':'compute', 'message': '....' })

    async def emit(self, eventName, message):
        await self.sio.emit(eventName, message)
        await self.sio.sleep(0)

_socket = WebsocketManager()

def init(app): 
    _socket.init(app)
    _socket.start()

async def emit(eventName, message):
    await _socket.emit(eventName, message)

async def startSession(id):
    await _socket.startSession(id)

async def stopSession(id, process_time):
    await _socket.stopSession(id, process_time)

async def errorSession(id, nodeid, error_message):
    await _socket.errorSession(id, nodeid, error_message)

async def updateSessionStatus(id, node_index, node_count, node_process_time, nodeid, nodeType):
    await _socket.updateSessionStatus(id, node_index, node_count, node_process_time, nodeid, nodeType)

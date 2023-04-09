import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket, OnGatewayConnection } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'


type Player = {
    id: string
}

type ConnectedPlayers = {
    [key: string]: Player
  }

@WebSocketGateway({})
export class SocketGateway implements OnGatewayConnection {

    @WebSocketServer()
    server: Server

    connectedPlayers: ConnectedPlayers

    constructor() {
        this.connectedPlayers = {}
    }

    handleConnection(client: any, ...args: any[]) {

        this.connectedPlayers[client.id] = ({ id: client.id })
        
        this.server.emit('actor::connected', {
            actor: client.id,
            connectedPlayers: Object.values(this.connectedPlayers)
        })        
    }

    handleDisconnect(client: Socket){
        console.log(`client disconnected ${client.id}`)

        this.server.emit('actor::disconnected', {
            actor: client.id,
        })

        delete this.connectedPlayers[client.id]
    }

    @SubscribeMessage('player::moved')
    onMovePlayer(
        @MessageBody() body: any, 
        @ConnectedSocket() client: Socket
    ) {
        const { payload } = body

        this.server.emit('actor::moved', {
            payload,
            actor: client.id,
        })
    }
}
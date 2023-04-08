import { OnModuleInit } from '@nestjs/common'
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket, OnGatewayConnection } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'

@WebSocketGateway({})
export class SocketGateway implements OnGatewayConnection {

    @WebSocketServer()
    server: Server


    handleConnection(client: any, ...args: any[]) {
        console.log(client.id)

        this.server.emit('actor::connected', {
            actor: client.id,
        })
    }

    handleDisconnect(client: Socket){
        console.log(`client disconnected ${client.id}`)

        this.server.emit('actor::disconnected', {
            actor: client.id,
        })
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
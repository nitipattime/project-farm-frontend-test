// src/composables/useRealtime.ts
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { onUnmounted, ref } from 'vue'

interface ServerToClientEvents {
  scales_data: (data: any) => void
}

interface ClientToServerEvents {
  join_house: (houseId: number) => void
}

// reactive state สำหรับ data ที่ได้
const scalesData = ref<any>(null)

export function useRealtime(houseId: number) {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('https://jrlheater.com', {
    path: '/realtime',

    // path: '/socket/join-house',
    auth: {
      token: import.meta.env.VITE_SOCKET_IO_TOKEN, // ใส่ token จาก env
    },
  })

  socket.on('connect', () => {
    socket.emit('join_house', houseId)
  })

  socket.on('scales_data', data => {
    scalesData.value = data
  })

  socket.on('disconnect', () => {
    // console.log('Disconnected')
  })

  onUnmounted(() => {
    socket.disconnect()
  })

  return { scalesData, socket }
}

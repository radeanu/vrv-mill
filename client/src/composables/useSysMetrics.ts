import { onMounted, ref } from 'vue'

type SysMetrics = {
  cpu: string
  ram: {
    serverTotal: string
    nodeAppUsed: string
    nodeAppUsedPercent: string
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin

export function useSysMetrics() {
  const metrics = ref<SysMetrics>()

  onMounted(() => {
    const eventSource = new EventSource(API_BASE_URL + '/api/v1/sys-metrics')

    eventSource.onmessage = function (event) {
      metrics.value = JSON.parse(event.data) as SysMetrics
      console.info(
        `CPU: ${metrics.value.cpu} | RAM ${metrics.value.ram.serverTotal} / ${metrics.value.ram.nodeAppUsed}  ${metrics.value.ram.nodeAppUsedPercent}`,
      )
    }
  })

  return {
    metrics,
  }
}

import { onMounted, ref } from 'vue'

type SysMetrics = {
  cpu: string
  ram: {
    serverTotal: string
    nodeAppUsed: string
    nodeAppUsedPercent: string
  }
}

export function useSysMetrics() {
  const metrics = ref<SysMetrics>()

  onMounted(() => {
    const eventSource = new EventSource('http://localhost:3000/api/v1/sys-metrics')

    eventSource.onmessage = function (event) {
      metrics.value = JSON.parse(event.data) as SysMetrics
      console.log(
        `CPU: ${metrics.value.cpu} | RAM ${metrics.value.ram.serverTotal} / ${metrics.value.ram.nodeAppUsed}  ${metrics.value.ram.nodeAppUsedPercent}`,
      )
    }
  })

  return {
    metrics,
  }
}

let bizkaibusIntervalId: NodeJS.Timeout | null = null;
let metroBilbaoIntervalId: NodeJS.Timeout | null = null;

export function setIntervalBizkaibus(callback: () => void, ms: number) {
  bizkaibusIntervalId = setInterval(callback, ms);
}
export function setIntervalMetroBilbao(callback: () => void, ms: number) {
  metroBilbaoIntervalId = setInterval(callback, ms);
}

export function clearIntervals() {
    console.log('Limpiando intervalos');
  if (bizkaibusIntervalId) clearInterval(bizkaibusIntervalId);
  if (metroBilbaoIntervalId) clearInterval(metroBilbaoIntervalId);
}
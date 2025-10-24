let bizkaibusIntervalId: NodeJS.Timeout | null = null;
let metroBilbaoIntervalId: NodeJS.Timeout | null = null;
let renfeIntervalId: NodeJS.Timeout | null = null;
let euskotrenIntervalId: NodeJS.Timeout | null = null;

function getIntervalMs(refreshRate: string): number {
  switch (refreshRate) {
    case 'Cada minuto':
      return 60000; // 1 minute
    case 'Cada 2 minutos':
      return 120000; // 2 minutes
    case 'Nunca':
      return 0; // No interval
    default:
      return 60000; // Default to 1 minute
  }
}

export function setIntervalBizkaibus(callback: () => void, refreshRate: string) {
  if (bizkaibusIntervalId) clearInterval(bizkaibusIntervalId);
  const intervalMs = getIntervalMs(refreshRate);
  if (intervalMs > 0) {
    bizkaibusIntervalId = setInterval(callback, intervalMs);
  }
}
export function setIntervalRenfe(callback: () => void, refreshRate: string) {
  if (renfeIntervalId) clearInterval(renfeIntervalId);
  const intervalMs = getIntervalMs(refreshRate);
  if (intervalMs > 0) {
    renfeIntervalId = setInterval(callback, intervalMs);
  }
}
export function setIntervalMetroBilbao(callback: () => void, refreshRate: string) {
  if (metroBilbaoIntervalId) clearInterval(metroBilbaoIntervalId);
  const intervalMs = getIntervalMs(refreshRate);
  if (intervalMs > 0) {
    metroBilbaoIntervalId = setInterval(callback, intervalMs);
  }
}
export function setIntervalEuskotren(callback: () => void, refreshRate: string) {
  if (euskotrenIntervalId) clearInterval(euskotrenIntervalId);
  const intervalMs = getIntervalMs(refreshRate);
  if (intervalMs > 0) {
    euskotrenIntervalId = setInterval(callback, intervalMs);
  }
}

export function clearIntervals() {
  if (bizkaibusIntervalId) clearInterval(bizkaibusIntervalId);
  if (metroBilbaoIntervalId) clearInterval(metroBilbaoIntervalId);
  if (renfeIntervalId) clearInterval(renfeIntervalId);
  if (euskotrenIntervalId) clearInterval(euskotrenIntervalId);
}
/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  sendMessage: (message: string) => void
  saveApps: (apps: string) => void
  windowAction: (type: string) => void
  ping: () => void
  load: () => void
  forcePing: (object: string) => void
}

declare global {
  interface Window {
    electronAPI: ElectronApi,
  }
}

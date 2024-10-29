declare interface FetchRequestOptions {
  url: string
  method?: string
  header?: Record<string, string>
  data?: any
  responseType?: 'json' | 'text' | 'arraybuffer'
}

declare module '@system.prompt'

declare module '@system.fetch' {
  interface FetchResponse {
    data: any
    code: number
    headers: Record<string, string>
  }

  function fetch(options: FetchRequestOptions): Promise<FetchResponse>

  export { fetch }
}

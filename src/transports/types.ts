import type { BaseTransportOptions } from '@sentry/types'

export interface BrowserTransportOptions extends BaseTransportOptions {
  fetchOptions?: RequestInit
  headers?: { [key: string]: string }
}

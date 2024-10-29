import { SDK_VERSION, init as browserInit } from '@sentry/browser'
import type { Client } from '@sentry/types'
import { BrowserOptions } from '@sentry/browser'
import { makeFetchTransport } from './transports/fetch'
import { defaultStackParser } from './stack-parsers'

/**
 * Inits the Vue SDK
 */
export function init(config: BrowserOptions = {}): Client | undefined {
  const options = {
    _metadata: {
      sdk: {
        name: 'sentry.javascript.quickapp',
        packages: [
          {
            name: 'npm:@sentry/quickapp',
            version: SDK_VERSION
          }
        ],
        version: SDK_VERSION
      }
    },
    transport: makeFetchTransport,
    stackParser: defaultStackParser,
    defaultIntegrations: [],
    ...config
  }

  return browserInit(options)
}

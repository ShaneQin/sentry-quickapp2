import fetch from '@system.fetch'
import { createTransport } from '@sentry/core'
import type {
  Transport,
  TransportMakeRequestResponse,
  TransportRequest
} from '@sentry/types'
import { rejectedSyncPromise } from '@sentry/utils'
import type { BrowserTransportOptions } from './types'

export function makeFetchTransport(
  options: BrowserTransportOptions,
  nativeFetch: typeof fetch.fetch | undefined = fetch.fetch
): Transport {
  function makeRequest(
    request: TransportRequest
  ): PromiseLike<TransportMakeRequestResponse> {
    const requestOptions: FetchRequestOptions = {
      url: options.url,
      data: request.body,
      method: 'POST',
      header: options.headers,
      ...options.fetchOptions
    }

    if (!nativeFetch) {
      return rejectedSyncPromise('No fetch implementation available')
    }

    try {
      return nativeFetch(requestOptions).then(response => {
        return {
          statusCode: response.code
        }
      })
    } catch (e) {
      return rejectedSyncPromise(e)
    }
  }

  return createTransport(options, makeRequest)
}

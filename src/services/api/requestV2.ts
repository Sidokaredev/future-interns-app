import { HOST } from "../../pages/administrators/performance/[id]/constants"

type FailRequest = {
  success: boolean
  error: string
  message: string
}

export class RequestAPIV2 {
  private host: string = HOST.main
  private port: number = 3000
  private request_body: FormData | string | undefined

  constructor() {

  }

  private async DelayRequest(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  FormDataRequest<T>(body: T) {
    this.request_body = new FormData()
    for (const prop in body) {
      this.request_body.append(prop, body[prop] as string | Blob)
    }

    return this
  };

  JSONRequest<T>(body: T) {
    this.request_body = JSON.stringify(body)

    return this
  };

  async Send<T>(path: string, requestInit?: RequestInit): Promise<[T?, FailRequest?]> {
    const endpoint: string = this.host + ":" + this.port + path
    try {
      await this.DelayRequest(1000)
      let init: RequestInit
      if (this.request_body != undefined) {
        init = {
          ...requestInit,
          body: this.request_body,
        }
      } else {
        init = {
          ...requestInit,
        }
      }
      const request: Response = await fetch(endpoint, init)
      let response: any = await request.json()
      if (!response.success) {
        return [undefined, response as FailRequest]
      }

      return [response.data as T, undefined]

    } catch (err) {
      let error = err as Error
      return [undefined, { success: false, error: error.name, message: error.message }]
    }
  }
}
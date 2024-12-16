type FailRequest = {
  success: boolean
  error: string
  message: string
}

export default class RequestAPI {
  private static host: string = 'http://localhost'
  private static port: number = 3000
  private static request_body: FormData | string | undefined
  constructor() {

  }

  private static async DelayRequest(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  static FormDataRequest<T>(body: T) {
    this.request_body = new FormData()
    for (const prop in body) {
      this.request_body.append(prop, body[prop] as string | Blob)
    }

    return this
  }

  static JSONRequest<T>(body: T) {
    this.request_body = JSON.stringify(body)

    return this
  }

  static async Send<T>(path: string, requestInit?: RequestInit): Promise<[T?, FailRequest?]> {
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
        this.request_body = undefined // set to undefined
        return [undefined, response as FailRequest]
      }

      this.request_body = undefined // set to undefined
      return [response.data as T, undefined]

    } catch (err) {
      let error = err as Error
      this.request_body = undefined // set to undefined
      return [undefined, { success: false, error: error.name, message: error.message }]
    }
  }
}
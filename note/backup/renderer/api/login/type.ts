// login parameter format
export interface LoginReqParams {
  username: string
  password: string
}

interface LoginResParamsDataType {
  userId?: string
  token?: string
  role?: string[]
  message?: string
}

export interface LoginResParams {
  code: number
  data: LoginResParamsDataType
}

export interface UserResParams {
  code: number
  data: {
    username: string
    roles?: string[]
  }
}

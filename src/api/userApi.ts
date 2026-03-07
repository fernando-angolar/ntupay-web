import { AxiosError } from "axios"
import { api } from "./client"
import type { 
  ApiErrorResponse, 
  LoginAuditMetadata,
  LoginRequest,
  LoginResponse,
  LoginStatusResponse,
  TwoFactorVerifyRequest,
  UserRegistrationRequest, 
  UserRegistrationResponse,

} from '../types'

  
function extractApiError(error: unknown, fallbackMessage: string): Error {
  const apiError = error as AxiosError<ApiErrorResponse>
  const message = apiError.response?.data?.message ?? fallbackMessage
  return new Error(message)
}

// async function tryRegisterOnEndpoint(endpoint: string,  payload: UserRegistrationRequest): Promise<UserRegistrationResponse> {
//   const response = await api.post<UserRegistrationResponse>(endpoint, payload)
//   return response.data
// }

// Register


export async function registerUser(
  payload: UserRegistrationRequest, 
): Promise<UserRegistrationResponse> {

  try {
    const response = await api.post<UserRegistrationResponse>('/users/register', payload)
    return response.data
  } catch ( error ) {
    throw extractApiError(error, "Erro ao criar conta")
  }
}

export async function loginUser(payload : LoginRequest): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/users/login', payload)
    return response.data
  } catch ( error ) {
    throw extractApiError(error, "Erro foi possível inciar sessão")
  }
}

export async function verifyTwoFactor(
  identifier: string,
  password: string,
  twoFactorCode: string,
  twoFactorSessionToken: string
): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/users/login', {
      identifier,
      password,
      twoFactorCode,
      twoFactorSessionToken
    }  satisfies LoginRequest)

    return response.data
  } catch (error) {
    throw extractApiError(error, 'Código de autenticação inválido')
  }
}
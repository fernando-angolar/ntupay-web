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

// export async function registerUser(payload: UserRegistrationRequest) : Promise<UserRegistrationResponse> {
  
function extractApiError(error: unknown, fallbackMessage: string): Error {
  const apiError = error as AxiosError<ApiErrorResponse>
  const message = apiError.response?.data?.message ?? fallbackMessage
  return new Error(message)
  // try {
  //   const response = await api.post<UserRegistrationResponse>("/users/register", payload)
  //   return response.data
  // } catch (error) {
  //   const apiError = error as AxiosError<ApiErrorResponse>
  //   throw new Error(apiError.response?.data?.message || "Erro ao criar conta")
  // }
}

async function tryRegisterOnEndpoint(endpoint: string,  payload: UserRegistrationRequest): Promise<UserRegistrationResponse> {
  const response = await api.post<UserRegistrationResponse>(endpoint, payload)
  return response.data
}

export async function registerUser(payload: UserRegistrationRequest): Promise<UserRegistrationResponse> {
  const endpoints = ['/users/register', '/auth/register']

  for (const endpoint of endpoints) {
    try {
      return await tryRegisterOnEndpoint(endpoint, payload)
    } catch (error) {
      const apiError = error as AxiosError<ApiErrorResponse>
      const status = apiError.response?.status

      if (status === 404 && endpoint !== endpoints[endpoints.length - 1]) {
        continue
      }

      throw extractApiError(error, 'Erro ao criar conta')
    }
  }

  throw new Error('Erro ao criar conta')
}

export async function loginUser(payload: LoginRequest, metadata?: LoginAuditMetadata): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/auth/login', payload, {
      headers: {
        ...(metadata?.ipAddress ? { 'X-Client-IP': metadata.ipAddress } : {}),
        ...(metadata?.userAgent ? { 'X-Client-User-Agent': metadata.userAgent } : {}),
      },
    })

    return response.data
  } catch (error) {
    throw extractApiError(error, 'Não foi possível iniciar sessão')
  }
}

export async function verifyTwoFactorCode(
  payload: TwoFactorVerifyRequest,
  metadata?: LoginAuditMetadata,
): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/auth/login/2fa/verify', payload, {
      headers: {
        ...(metadata?.ipAddress ? { 'X-Client-IP': metadata.ipAddress } : {}),
        ...(metadata?.userAgent ? { 'X-Client-User-Agent': metadata.userAgent } : {}),
      },
    })

    return response.data
  } catch (error) {
    throw extractApiError(error, 'Código de autenticação inválido')
  }
}

export async function getLoginStatus(identifier: string): Promise<LoginStatusResponse> {
  try {
    const response = await api.get<LoginStatusResponse>('/auth/login/status', {
      params: { identifier },
    })

    return response.data
  } catch {
    return {
      remainingAttempts: 5,
      lockUntil: null,
      isLocked: false,
      retryAfterSeconds: 2,
    }
  }
}
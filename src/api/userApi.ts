import { AxiosError } from 'axios'
import { api } from './client'
import type { 
  ApiErrorResponse,
  CompletePasswordResetRequest,
  LoginRequest,
  LoginResponse,
  // UserRegistrationRequest,
  PasswordResetRequest,
  PasswordResetResponse,
  ResetPasswordTokenValidationResponse,
  UserRegistrationRequest,
  UserRegistrationResponse,

} from '../types'

  
function extractApiError(error: unknown, fallbackMessage: string): Error {
  const apiError = error as AxiosError<ApiErrorResponse>
  const message = apiError.response?.data?.message ?? fallbackMessage
  return new Error(message)
}


export async function registerUser(
  payload: UserRegistrationRequest,
): Promise<UserRegistrationResponse> {

  try {
    const response = await api.post<UserRegistrationResponse>('/users/register', payload)
    return response.data
  } catch (error) {
    throw extractApiError(error, 'Erro ao criar conta')
  }
}

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/users/login', payload)
    return response.data
  } catch (error) {
    throw extractApiError(error, 'Não foi possível iniciar sessão')
  }
}

export async function verifyTwoFactor(
  identifier: string,
  password: string,
  twoFactorCode: string,
  twoFactorSessionToken: string,
): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/users/login', {
      identifier,
      password,
      twoFactorCode,
      twoFactorSessionToken,
    }  satisfies LoginRequest)

    return response.data
  } catch (error) {
    throw extractApiError(error, 'Código de autenticação inválido')
  }
}
export async function requestPasswordReset(
  payload: PasswordResetRequest,
): Promise<PasswordResetResponse> {
  try {
    const response = await api.post<PasswordResetResponse>('/users/password-reset/request', payload)
    return response.data
  } catch (error) {
    throw extractApiError(error, 'Não foi possível processar o pedido de recuperação')
  }
}

export async function validatePasswordResetToken(
  token: string,
): Promise<ResetPasswordTokenValidationResponse> {
  try {
    const response = await api.get<ResetPasswordTokenValidationResponse>(
      `/users/password-reset/${token}/validate`,
    )
    return response.data
  } catch (error) {
    throw extractApiError(error, 'Link de recuperação inválido ou expirado. Solicite um novo link.')
  }
}

export async function completePasswordReset(
  payload: CompletePasswordResetRequest,
): Promise<PasswordResetResponse> {
  try {
    const response = await api.post<PasswordResetResponse>('/users/password-reset/complete', payload)
    return response.data
  } catch (error) {
    throw extractApiError(error, 'Não foi possível atualizar a senha')
  }
}
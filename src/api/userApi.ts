import { AxiosError } from "axios";
import { api } from "./client";
import type { ApiErrorResponse, UserRegistrationRequest, UserRegistrationResponse } from '../types'

export async function registerUser(payload: UserRegistrationRequest) : Promise<UserRegistrationResponse> {
  
  try {
    const response = await api.post<UserRegistrationResponse>("/users/register", payload)
    return response.data
  } catch (error) {
    const apiError = error as AxiosError<ApiErrorResponse>
    throw new Error(apiError.response?.data?.message || "Erro ao criar conta")
  }
}
import { apiClient } from '../../../lib/apiClient'
import type { Pet, PetCreate, PetUpdate } from '../types/pet'

const PETS_ENDPOINT = '/pets'

export const petsApi = {
  list: () => apiClient.get<Pet[]>(PETS_ENDPOINT),

  create: (data: PetCreate) =>
    apiClient.post<Pet>(PETS_ENDPOINT, data),

  update: (id: number, data: PetUpdate) =>
    apiClient.patch<Pet>(`${PETS_ENDPOINT}/${id}`, data),

  remove: (id: number) =>
    apiClient.delete(`${PETS_ENDPOINT}/${id}`),
}
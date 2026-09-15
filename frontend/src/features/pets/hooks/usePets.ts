import { useCallback, useEffect, useState } from 'react'
import { petsApi } from '../api/petsApi'
import type { Pet, PetCreate, PetUpdate } from '../types/pet'

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong'

export const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPets = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      setPets(await petsApi.list())
    } catch (error: unknown) {
      setError(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadPets()
  }, [loadPets])

  const createPet = useCallback(async (data: PetCreate): Promise<Pet> => {
    setIsLoading(true)
    setError(null)

    try {
      const createdPet = await petsApi.create(data)
      await loadPets()
      return createdPet
    } catch (error: unknown) {
      const message = getErrorMessage(error)
      setError(message)
      setIsLoading(false)
      throw error instanceof Error ? error : new Error(message)
    }
  }, [loadPets])

  const uploadPetImage = useCallback(async (id: number, image: File): Promise<Pet> => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedPet = await petsApi.uploadImage(id, image)
      await loadPets()
      return updatedPet
    } catch (error: unknown) {
      const message = getErrorMessage(error)
      setError(message)
      setIsLoading(false)
      throw error instanceof Error ? error : new Error(message)
    }
  }, [loadPets])

  const updatePet = useCallback(async (id: number, data: PetUpdate): Promise<Pet> => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedPet = await petsApi.update(id, data)
      await loadPets()
      return updatedPet
    } catch (error: unknown) {
      const message = getErrorMessage(error)
      setError(message)
      setIsLoading(false)
      throw error instanceof Error ? error : new Error(message)
    }
  }, [loadPets])

  const deletePet = useCallback(async (id: number) => {
    setIsLoading(true)
    setError(null)

    try {
      await petsApi.remove(id)
      await loadPets()
    } catch (error: unknown) {
      setError(getErrorMessage(error))
      setIsLoading(false)
    }
  }, [loadPets])

  return {
    pets,
    isLoading,
    error,
    loadPets,
    createPet,
    uploadPetImage,
    updatePet,
    deletePet,
  }
}

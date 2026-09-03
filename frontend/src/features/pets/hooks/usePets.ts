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

  const createPet = useCallback(async (data: PetCreate) => {
    setIsLoading(true)
    setError(null)

    try {
      await petsApi.create(data)
      await loadPets()
    } catch (error: unknown) {
      setError(getErrorMessage(error))
      setIsLoading(false)
    }
  }, [loadPets])

  const updatePet = useCallback(async (id: number, data: PetUpdate) => {
    setIsLoading(true)
    setError(null)

    try {
      await petsApi.update(id, data)
      await loadPets()
    } catch (error: unknown) {
      setError(getErrorMessage(error))
      setIsLoading(false)
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
    updatePet,
    deletePet,
  }
}

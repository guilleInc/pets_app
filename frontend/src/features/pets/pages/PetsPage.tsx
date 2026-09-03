import { useState } from 'react'
import { PetForm } from '../components/PetForm'
import { PetList } from '../components/PetList'
import { usePets } from '../hooks/usePets'
import type { Pet, PetFields } from '../types/pet'

export const PetsPage = () => {
  const { pets, isLoading, error, createPet, updatePet, deletePet } = usePets()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | undefined>()
  const [petToDelete, setPetToDelete] = useState<number | null>(null)

  const handleCreate = () => {
    setSelectedPet(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (pet: Pet) => {
    setSelectedPet(pet)
    setIsFormOpen(true)
  }

  const handleSubmit = async (data: PetFields) => {
    if (selectedPet) {
      await updatePet(selectedPet.id, data)
    } else {
      await createPet(data)
    }

    setIsFormOpen(false)
    setSelectedPet(undefined)
  }

  const handleDelete = async () => {
    if (petToDelete === null) {
      return
    }

    await deletePet(petToDelete)
    setPetToDelete(null)
  }

  return (
    <main>
      <header>
        <div>
          <p>Pet management</p>
          <h1>Pets</h1>
        </div>
        <button type="button" onClick={handleCreate}>
          Add pet
        </button>
      </header>

      <PetList
        pets={pets}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={setPetToDelete}
      />

      {isFormOpen && (
        <section aria-label={selectedPet ? 'Edit pet' : 'Add pet'}>
          <PetForm
            pet={selectedPet}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false)
              setSelectedPet(undefined)
            }}
          />
        </section>
      )}

      {petToDelete !== null && (
        <div role="dialog" aria-modal="true" aria-labelledby="delete-title">
          <h2 id="delete-title">Delete pet?</h2>
          <p>This action cannot be undone.</p>
          <button type="button" onClick={() => setPetToDelete(null)}>
            Cancel
          </button>
          <button type="button" onClick={() => void handleDelete()}>
            Delete
          </button>
        </div>
      )}
    </main>
  )
}

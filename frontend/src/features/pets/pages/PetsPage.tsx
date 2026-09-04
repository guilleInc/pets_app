import { useEffect, useState } from 'react'
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

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedPet(undefined)
  }

  useEffect(() => {
    if (!isFormOpen && petToDelete === null) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isFormOpen) {
          handleCloseForm()
        } else {
          setPetToDelete(null)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isFormOpen, petToDelete])

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
        <div
          aria-labelledby="pet-form-title"
          aria-modal="true"
          className="pet-form-modal"
          role="dialog"
        >
          <div className="pet-form-modal__content">
            <div className="pet-form-modal__header">
              <h2 id="pet-form-title">{selectedPet ? 'Edit pet' : 'Add pet'}</h2>
              <button
                aria-label="Close form"
                className="pet-form-modal__close"
                type="button"
                onClick={handleCloseForm}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <PetForm
              pet={selectedPet}
              onSubmit={handleSubmit}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}

      {petToDelete !== null && (
        <div
          aria-describedby="delete-description"
          aria-labelledby="delete-title"
          aria-modal="true"
          className="pet-form-modal"
          role="alertdialog"
        >
          <div className="pet-form-modal__content delete-dialog">
            <div className="pet-form-modal__header">
              <h2 id="delete-title">Delete pet?</h2>
              <button
                aria-label="Close delete dialog"
                className="pet-form-modal__close"
                type="button"
                onClick={() => setPetToDelete(null)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <p id="delete-description">This action cannot be undone.</p>
            <div className="pet-form__actions">
              <button type="button" onClick={() => setPetToDelete(null)}>
                Cancel
              </button>
              <button className="button--danger" type="button" onClick={() => void handleDelete()}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

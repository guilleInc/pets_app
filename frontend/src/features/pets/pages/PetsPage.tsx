import { useEffect, useState } from 'react'
import { PetDetails } from '../components/PetDetails'
import { PetForm } from '../components/PetForm'
import { PetList } from '../components/PetList'
import { PetToolbar } from '../components/PetToolbar'
import { useAuth } from '../../auth/context/useAuth'
import { usePets } from '../hooks/usePets'
import type { Pet, PetFields } from '../types/pet'

const PETS_PER_BATCH = 6

export const PetsPage = () => {
  const { logout } = useAuth()
  const { pets, isLoading, error, createPet, updatePet, deletePet } = usePets()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | undefined>()
  const [petToView, setPetToView] = useState<Pet | undefined>()
  const [petToDelete, setPetToDelete] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PETS_PER_BATCH)

  const handleCreate = () => {
    setSelectedPet(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (pet: Pet) => {
    setSelectedPet(pet)
    setIsFormOpen(true)
  }

  const handleViewDetails = (pet: Pet) => {
    setPetToView(pet)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedPet(undefined)
  }

  useEffect(() => {
    if (!isFormOpen && petToDelete === null && !petToView) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isFormOpen) {
          handleCloseForm()
        } else if (petToDelete !== null) {
          setPetToDelete(null)
        } else {
          setPetToView(undefined)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isFormOpen, petToDelete, petToView])

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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setVisibleCount(PETS_PER_BATCH)
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredPets = normalizedQuery
    ? pets.filter(
        (pet) =>
          pet.name.toLowerCase().includes(normalizedQuery) ||
          pet.owner_name.toLowerCase().includes(normalizedQuery),
      )
    : pets
  const visiblePets = filteredPets.slice(0, visibleCount)
  const hasMorePets = visibleCount < filteredPets.length

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
        <button type="button" onClick={logout}>
          Log out
        </button>
      </header>

      <PetToolbar searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <PetList
        pets={visiblePets}
        isLoading={isLoading}
        error={error}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={setPetToDelete}
      />

      {!isLoading && !error && filteredPets.length > 0 && (
        <div className="pet-list-footer">
          <p aria-live="polite">
            Showing {visiblePets.length} of {filteredPets.length} pets
          </p>
          {hasMorePets && (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PETS_PER_BATCH)}
            >
              Load more
            </button>
          )}
        </div>
      )}

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

      {petToView && (
        <div
          aria-labelledby="pet-details-title"
          aria-modal="true"
          className="pet-form-modal"
          role="dialog"
        >
          <div className="pet-form-modal__content">
            <div className="pet-form-modal__header">
              <h2 id="pet-details-title">{petToView.name}</h2>
              <button
                aria-label="Close pet details"
                className="pet-form-modal__close"
                type="button"
                onClick={() => setPetToView(undefined)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <PetDetails pet={petToView} />
          </div>
        </div>
      )}
    </main>
  )
}

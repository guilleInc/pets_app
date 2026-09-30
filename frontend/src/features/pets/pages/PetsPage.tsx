import { useEffect, useState } from 'react'
import { PetDetails } from '../components/PetDetails'
import { PetForm } from '../components/PetForm'
import { PetList } from '../components/PetList'
import { PetSidebar } from '../components/PetSidebar'
import { PetToolbar } from '../components/PetToolbar'
import { useAuth } from '../../auth/context/useAuth'
import { usePets } from '../hooks/usePets'
import type { Pet, PetFields } from '../types/pet'

const PETS_PER_BATCH = 6
const CHILD_MAX_AGE = 2
const SPECIES_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'dog', label: 'Dog' },
  { id: 'cat', label: 'Cat' },
] as const
const AGE_TABS = [
  { id: 'all', label: 'All' },
  { id: 'child', label: 'Staying' },
  { id: 'adult', label: 'Booked' },
] as const
const SORT_OPTIONS = ['none', 'name-asc', 'name-desc', 'age-asc', 'age-desc'] as const

type SpeciesFilter = (typeof SPECIES_FILTERS)[number]['id']
type AgeTab = (typeof AGE_TABS)[number]['id']
type SortOrder = (typeof SORT_OPTIONS)[number]

export const PetsPage = () => {
  const { logout, username } = useAuth()
  const { pets, isLoading, error, createPet, uploadPetImage, updatePet, deletePet } = usePets()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [createdPet, setCreatedPet] = useState<Pet | null>(null)
  const [selectedPet, setSelectedPet] = useState<Pet | undefined>()
  const [petToView, setPetToView] = useState<Pet | undefined>()
  const [petToDelete, setPetToDelete] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesFilter>('all')
  const [selectedAge, setSelectedAge] = useState<AgeTab>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('none')
  const [visibleCount, setVisibleCount] = useState(PETS_PER_BATCH)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleCreate = () => {
    setSelectedPet(undefined)
    setCreatedPet(null)
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
    setCreatedPet(null)
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

  const handleSubmit = async (data: PetFields, image?: File) => {
    if (selectedPet) {
      await updatePet(selectedPet.id, data)
      if (image) {
        await uploadPetImage(selectedPet.id, image)
      }
    } else {
      const pet = createdPet ?? await createPet(data)
      setCreatedPet(pet)

      if (image) {
        await uploadPetImage(pet.id, image)
      }
    }

    handleCloseForm()
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

  const handleSpeciesChange = (species: SpeciesFilter) => {
    setSelectedSpecies(species)
    setVisibleCount(PETS_PER_BATCH)
  }

  const handleAgeChange = (age: AgeTab) => {
    setSelectedAge(age)
    setVisibleCount(PETS_PER_BATCH)
  }

  const handleSortChange = (sort: string) => {
    if (!SORT_OPTIONS.includes(sort as SortOrder)) {
      return
    }

    setSortOrder(sort as SortOrder)
    setVisibleCount(PETS_PER_BATCH)
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredPets = pets.filter((pet) => {
    const matchesSpecies =
      selectedSpecies === 'all' || pet.species.toLowerCase() === selectedSpecies
    const matchesAge =
      selectedAge === 'all' ||
      (selectedAge === 'child' && pet.age <= CHILD_MAX_AGE) ||
      (selectedAge === 'adult' && pet.age > CHILD_MAX_AGE)
    const matchesSearch =
      !normalizedQuery ||
      pet.name.toLowerCase().includes(normalizedQuery) ||
      pet.owner_name.toLowerCase().includes(normalizedQuery)

    return matchesSpecies && matchesAge && matchesSearch
  })
  const sortedPets = [...filteredPets].sort((firstPet, secondPet) => {
    if (sortOrder === 'none') {
      return 0
    }

    if (sortOrder === 'name-asc' || sortOrder === 'name-desc') {
      const direction = sortOrder === 'name-asc' ? 1 : -1
      return firstPet.name.localeCompare(secondPet.name) * direction
    }

    const direction = sortOrder === 'age-asc' ? 1 : -1
    return (firstPet.age - secondPet.age) * direction
  })
  const visiblePets = sortedPets.slice(0, visibleCount)
  const hasMorePets = visibleCount < sortedPets.length

  return (
    <main className={`pets-app${isSidebarCollapsed ? ' pets-app--sidebar-collapsed' : ''}`}>
      <PetSidebar
        isCollapsed={isSidebarCollapsed}
        onAddPet={handleCreate}
        onToggle={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
      />

      <div className="pets-main">
        <header className="page-header">
          <div className="page-header__inner">
            <div className="page-header__content">
              <p>Pet management</p>
              <h1>Pets</h1>
            </div>
            <div className="page-header__actions">
              {username && (
                <span className="page-header__username">
                  <span aria-hidden="true" className="page-header__status" />
                  {username}
                </span>
              )}
              <button type="button" onClick={logout}>
                Log out
              </button>
            </div>
          </div>
        </header>

        <div className="pets-page__content">
          <PetToolbar
            searchQuery={searchQuery}
            sortOrder={sortOrder}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
          />

          <div className="pet-filter-row">
            <div aria-label="Pet age" className="pet-tabs" role="tablist">
              {AGE_TABS.map((tab) => (
                <button
                  aria-controls="pets-panel"
                  aria-selected={selectedAge === tab.id}
                  className="pet-tabs__tab"
                  id={`pet-tab-${tab.id}`}
                  key={tab.id}
                  role="tab"
                  type="button"
                  onClick={() => handleAgeChange(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div aria-label="Pet species" className="pet-species-filter" role="group">
              {SPECIES_FILTERS.map((filter) => (
                <button
                  aria-pressed={selectedSpecies === filter.id}
                  className="pet-species-filter__button"
                  key={filter.id}
                  type="button"
                  onClick={() => handleSpeciesChange(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div
            aria-labelledby={`pet-tab-${selectedAge}`}
            className="pet-tabs__panel"
            id="pets-panel"
            role="tabpanel"
          >
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
                  Showing {visiblePets.length} of {sortedPets.length} pets
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
          </div>
        </div>
      </div>

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

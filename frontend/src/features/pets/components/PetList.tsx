import type { Pet } from '../types/pet'
import { PetCard } from './PetCard'

type PetListProps = {
  pets: Pet[]
  isLoading: boolean
  error: string | null
  onViewDetails: (pet: Pet) => void
  onEdit: (pet: Pet) => void
  onDelete: (id: number) => void
}

export const PetList = ({
  pets,
  isLoading,
  error,
  onViewDetails,
  onEdit,
  onDelete,
}: PetListProps) => {
  if (isLoading) {
    return <p role="status">Loading pets...</p>
  }

  if (error) {
    return (
      <p role="alert">
        Unable to load pets: {error}
      </p>
    )
  }

  if (pets.length === 0) {
    return <p>No pets found.</p>
  }

  return (
    <section aria-label="Pets" className="pet-list">
      {pets.map((pet) => (
        <PetCard
          key={pet.id}
          pet={pet}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  )
}

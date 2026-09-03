import type { Pet } from '../types/pet'

type PetCardProps = {
  pet: Pet
  onEdit: (pet: Pet) => void
  onDelete: (id: number) => void
}

export const PetCard = ({ pet, onEdit, onDelete }: PetCardProps) => (
  <article className="pet-card">
    <div className="pet-card__content">
      <h2>{pet.name}</h2>
      <dl>
        <div>
          <dt>Species</dt>
          <dd>{pet.species}</dd>
        </div>
        <div>
          <dt>Breed</dt>
          <dd>{pet.breed}</dd>
        </div>
        <div>
          <dt>Color</dt>
          <dd>{pet.color}</dd>
        </div>
        <div>
          <dt>Age</dt>
          <dd>{pet.age}</dd>
        </div>
        <div>
          <dt>Owner</dt>
          <dd>{pet.owner_name}</dd>
        </div>
      </dl>
    </div>
    <div className="pet-card__actions">
      <button type="button" onClick={() => onEdit(pet)}>
        Edit
      </button>
      <button type="button" onClick={() => onDelete(pet.id)}>
        Delete
      </button>
    </div>
  </article>
)

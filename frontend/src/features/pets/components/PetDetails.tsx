import type { Pet } from '../types/pet'

type PetDetailsProps = {
  pet: Pet
}

export const PetDetails = ({ pet }: PetDetailsProps) => (
  <dl className="pet-details">
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
)

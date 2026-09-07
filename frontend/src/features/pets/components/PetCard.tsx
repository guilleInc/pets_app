import { useEffect, useRef, useState } from 'react'
import type { Pet } from '../types/pet'

type PetCardProps = {
  pet: Pet
  onViewDetails: (pet: Pet) => void
  onEdit: (pet: Pet) => void
  onDelete: (id: number) => void
}

export const PetCard = ({ pet, onViewDetails, onEdit, onDelete }: PetCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = `pet-menu-${pet.id}`

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown)
    }
  }, [isMenuOpen])

  const handleEdit = () => {
    setIsMenuOpen(false)
    onEdit(pet)
  }

  const handleDelete = () => {
    setIsMenuOpen(false)
    onDelete(pet.id)
  }

  return (
    <article
      aria-label={`View details for ${pet.name}`}
      className="pet-card"
      role="button"
      tabIndex={0}
      onClick={() => onViewDetails(pet)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onViewDetails(pet)
        }
      }}
    >
      <div className="pet-card__content">
        <div className="pet-card__header">
          <h2>{pet.name}</h2>
          <div
            ref={menuRef}
            className="pet-card__menu-wrapper"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <button
              aria-controls={menuId}
              aria-expanded={isMenuOpen}
              aria-label={`More options for ${pet.name}`}
              className="pet-card__menu"
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span aria-hidden="true">&#8942;</span>
            </button>
            {isMenuOpen && (
              <div className="pet-card__menu-dropdown" id={menuId} role="menu">
                <button type="button" role="menuitem" onClick={handleEdit}>
                  Edit
                </button>
                <button type="button" role="menuitem" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
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
    </article>
  )
}

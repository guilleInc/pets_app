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
  const [hasImageError, setHasImageError] = useState(false)
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

  const imageSrc =
    hasImageError || !pet.image_url
      ? '/pet-placeholder.svg'
      : `${import.meta.env.VITE_API_URL}${pet.image_url}`

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
      <div className="pet-card__image-wrapper">
        <img
          alt={pet.image_url ? `${pet.name}, ${pet.species}` : `No image available for ${pet.name}`}
          className="pet-card__image"
          loading="lazy"
          src={imageSrc}
          onError={() => setHasImageError(true)}
        />
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
        <h2 className="pet-card__title">{pet.name}</h2>
      </div>
      <div className="pet-card__content">
        <dl>
          <div>
            <dt>Species</dt>
            <dd>{pet.species}</dd>
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

import type { ReactNode } from 'react'

type PetToolbarProps = {
  children?: ReactNode
  onSearchChange: (value: string) => void
  searchQuery: string
}

export const PetToolbar = ({ children, onSearchChange, searchQuery }: PetToolbarProps) => (
  <section aria-label="Pet toolbar" className="pet-toolbar">
    <label>
      Search pets
      <input
        type="search"
        value={searchQuery}
        placeholder="Search by name or owner"
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </label>
    {children}
  </section>
)

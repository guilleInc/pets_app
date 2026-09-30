type PetToolbarProps = {
  onSearchChange: (value: string) => void
  onSortChange: (value: string) => void
  searchQuery: string
  sortOrder: string
}

export const PetToolbar = ({
  onSearchChange,
  onSortChange,
  searchQuery,
  sortOrder,
}: PetToolbarProps) => (
  <section aria-label="Pet toolbar" className="pet-toolbar">
    <div className="pet-toolbar__controls">
      <label className="pet-toolbar__search-field">
        <span className="pet-toolbar__search">
          <span aria-hidden="true" className="pet-toolbar__search-icon">
            <svg
              fill="none"
              height="18"
              viewBox="0 0 24 24"
              width="18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </span>
          <input
            aria-label="Search pets"
            type="search"
            value={searchQuery}
            placeholder="Search by name or owner"
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </span>
      </label>
      <label className="pet-toolbar__sort-field">
        <select
          aria-label="Sort pets"
          value={sortOrder}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="none">Sort by</option>
          <option value="name-asc">A-Z</option>
          <option value="name-desc">Z-A</option>
          <option value="age-asc">Youngest</option>
          <option value="age-desc">Oldest</option>
        </select>
      </label>
    </div>
  </section>
)

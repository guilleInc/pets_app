type PetSidebarProps = {
  isCollapsed: boolean
  onAddPet: () => void
  onLogout: () => void
  onToggle: () => void
}

export const PetSidebar = ({ isCollapsed, onAddPet, onLogout, onToggle }: PetSidebarProps) => (
  <aside className={`pet-sidebar${isCollapsed ? ' pet-sidebar--collapsed' : ''}`}>
    <div className="pet-sidebar__header">
      {!isCollapsed && <strong>Pet management</strong>}
      <button
        aria-controls="pet-navigation"
        aria-expanded={!isCollapsed}
        aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        className="pet-sidebar__toggle"
        type="button"
        onClick={onToggle}
      >
        <span aria-hidden="true">☰</span>
      </button>
    </div>
    <nav aria-label="Main navigation" className="pet-sidebar__nav" id="pet-navigation">
      {!isCollapsed && <p className="pet-sidebar__section-title">Actions</p>}
      <button className="pet-sidebar__link" type="button" onClick={onAddPet}>
        <span aria-hidden="true">+</span>
        {!isCollapsed && <span>Add pet</span>}
      </button>
      <button className="pet-sidebar__link" type="button">
        <span aria-hidden="true">
          <svg
            fill="none"
            height="18"
            viewBox="0 0 24 24"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect height="16" rx="2" stroke="currentColor" strokeWidth="2" width="18" x="3" y="5" />
            <path d="M16 3v4M8 3v4M3 10h18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
        </span>
        {!isCollapsed && <span>New booking</span>}
      </button>
    </nav>
    <div className="pet-sidebar__footer">
      <button className="pet-sidebar__link" type="button" onClick={onLogout}>
        <span aria-hidden="true">
          <svg
            fill="none"
            height="18"
            viewBox="0 0 24 24"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M14 5h5v14h-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M14 12H4m0 0 4-4m-4 4 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </span>
        {!isCollapsed && <span>Log out</span>}
      </button>
    </div>
  </aside>
)

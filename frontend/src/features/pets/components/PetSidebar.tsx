type PetSidebarProps = {
  isCollapsed: boolean
  onAddPet: () => void
  onToggle: () => void
}

export const PetSidebar = ({ isCollapsed, onAddPet, onToggle }: PetSidebarProps) => (
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
      <a aria-current="page" className="pet-sidebar__link" href="/">
        <span aria-hidden="true">⌂</span>
        {!isCollapsed && <span>Pets</span>}
      </a>
      <button className="pet-sidebar__link" type="button" onClick={onAddPet}>
        <span aria-hidden="true">+</span>
        {!isCollapsed && <span>Add pet</span>}
      </button>
    </nav>
  </aside>
)

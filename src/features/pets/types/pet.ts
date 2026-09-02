export type Pet = {
  id: number
  name: string
  species: string
  breed: string
  color: string
  owner_name: string
  age: number
}

export type PetCreate = Omit<Pet, 'id'>

export type PetUpdate = Partial<PetCreate>

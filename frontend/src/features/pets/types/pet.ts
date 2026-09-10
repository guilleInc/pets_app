export type PetFields = {
  name: string
  species: string
  breed: string
  color: string
  owner_name: string
  age: number
}

export type Pet = PetFields & {
  id: number
  image_url: string | null
}

export type PetCreate = PetFields

export type PetUpdate = Partial<PetFields>

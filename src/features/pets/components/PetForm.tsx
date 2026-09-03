import { useEffect, useState, type FormEvent } from 'react'
import type { Pet, PetFields } from '../types/pet'

type PetFormProps = {
  pet?: Pet
  onSubmit: (data: PetFields) => Promise<void>
  onCancel?: () => void
}

type FormValues = Omit<PetFields, 'age'> & {
  age: string
}

const emptyForm: FormValues = {
  name: '',
  species: '',
  breed: '',
  color: '',
  owner_name: '',
  age: '',
}

const getFormValues = (pet?: Pet): FormValues =>
  pet
    ? {
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        color: pet.color,
        owner_name: pet.owner_name,
        age: String(pet.age),
      }
    : emptyForm

export const PetForm = ({ pet, onSubmit, onCancel }: PetFormProps) => {
  const [values, setValues] = useState<FormValues>(() => getFormValues(pet))
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setValues(getFormValues(pet))
    setError(null)
  }, [pet])

  const handleChange = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const age = Number(values.age)

    if (!values.name.trim() || !values.species.trim() || !values.age || !Number.isInteger(age) || age < 0) {
      setError('Enter a name, species, and a valid non-negative age.')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      await onSubmit({
        name: values.name.trim(),
        species: values.species.trim(),
        breed: values.breed.trim(),
        color: values.color.trim(),
        owner_name: values.owner_name.trim(),
        age,
      })
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Unable to save pet.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="pet-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          required
          value={values.name}
          onChange={(event) => handleChange('name', event.target.value)}
        />
      </label>
      <label>
        Species
        <input
          required
          value={values.species}
          onChange={(event) => handleChange('species', event.target.value)}
        />
      </label>
      <label>
        Breed
        <input
          value={values.breed}
          onChange={(event) => handleChange('breed', event.target.value)}
        />
      </label>
      <label>
        Color
        <input
          value={values.color}
          onChange={(event) => handleChange('color', event.target.value)}
        />
      </label>
      <label>
        Owner name
        <input
          value={values.owner_name}
          onChange={(event) => handleChange('owner_name', event.target.value)}
        />
      </label>
      <label>
        Age
        <input
          required
          min="0"
          step="1"
          type="number"
          value={values.age}
          onChange={(event) => handleChange('age', event.target.value)}
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <div className="pet-form__actions">
        {onCancel && (
          <button disabled={isSubmitting} type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Saving...' : pet ? 'Update pet' : 'Add pet'}
        </button>
      </div>
    </form>
  )
}

import styled from "styled-components"
import { CatCard } from "./card"
export const CatList = ({
  externalCats,
  currentUser,
  locationFilter,
  genderFilter,
  onCreateComment,
  onEdit,
  onDelete,
  onDeleteComment,
}) => {
  const validCats = (externalCats || []).filter((cat) => {
    return cat && (cat._id || cat.id)
  })

  // Apply location/gender filters
  const filteredCats = validCats.filter((cat) => {
    const matchesLocation =
      !locationFilter || cat.location === locationFilter
    const matchesGender = !genderFilter || cat.gender === genderFilter
    return matchesLocation && matchesGender
  })

  if (filteredCats.length === 0) {
    return <p>No cats found matching your filters.</p>
  }

  return (
    <Grid>
      {filteredCats.map((cat) => (
        <CatCard
          key={cat._id || cat.id}
          cat={cat}
          currentUser={currentUser}
          onEdit={onEdit}
          onDelete={onDelete}
          onCreateComment={onCreateComment}
          onDeleteComment={onDeleteComment}
        />
      ))}
    </Grid>
  )
}

export default CatList

const Grid = styled.section`
  display: grid;
  gap: 20px;

  /* Mobile: 1 column (default) */
  grid-template-columns: 1fr;

  /* Tablet: 2 columns */
  @media (min-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* Desktop: 3 columns */
  @media (min-width: 1120px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  /* Desktop: 4 columns */
  @media (min-width: 1470px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`
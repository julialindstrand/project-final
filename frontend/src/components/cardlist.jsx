import styled from "styled-components"
import { CatCard } from "./card"

export const CatList = ({ externalCats, currentUser, onEdit, locationFilter = "", genderFilter = "", onCreateComment, onDelete, onDeleteComment }) => {

  const filteredCats = externalCats.filter(cat => {
    const matchesLocation =
      locationFilter === "" || cat.location === locationFilter
    const matchesGender =
      genderFilter === "" || cat.gender === genderFilter
    return matchesLocation && matchesGender
  })

  return (
    <Grid>
      {filteredCats.length === 0 ? (
        <EmptyMessage>No cats match the selected filters</EmptyMessage>
      ) : filteredCats.map(cat => (
        <CatCard
          key={cat._id}
          cat={cat}
          currentUser={currentUser}
          onCreateComment={onCreateComment}
          onEdit={onEdit}
          onDelete={onDelete}
          onDeleteComment={onDeleteComment}
        />
      ))}
    </Grid>
  )
}

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

const EmptyMessage = styled.p`
  grid-column: 1 / -1;
  text-align: center;
  color: #555;
  font-style: italic;
`
import styled from "styled-components"
import { CatCard } from "./card"

export const CatList = ({ externalCats, currentUser, onEdit, onCreateComment, onDelete, onDeleteComment }) => (
  <Grid>
    {externalCats.map((cat) => (
      <CatCard
        key={cat._id}
        cat={cat}
        currentUser={currentUser}
        onCreateComment={onCreateComment}
        onEdit={onEdit}
        onDelete={onDelete}
        onDeleteComment={onDeleteComment} />
    ))}
  </Grid>
)

const Grid = styled.section`
  display: grid;
  gap: 20px;

  /* Mobile – 1 column (default) */
  grid-template-columns: 1fr;

  /* Tablet – ≥ 600 px wide → 2 columns */
  @media (min-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* Desktop 1400 */
  @media (min-width: 1120px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  /* Desktop – ≥ 1024 px wide → 4 columns */
  @media (min-width: 1470px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`
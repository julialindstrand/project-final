import styled from "styled-components"
import { CatCard } from "./card"

export const CatList = ({ externalCats, currentUser }) => (
  <Grid>
    {externalCats.map((cat) => (
      <CatCard key={cat._id} cat={cat} currentUser={currentUser} />
    ))}
  </Grid>
)

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`
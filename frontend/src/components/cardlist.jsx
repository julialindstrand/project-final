import { useEffect, useState } from "react"
import styled from "styled-components"
import { CatCard } from "./card"
import { API_URL } from "../App"

export const CatList = () => {
  const [cats, setCats] = useState([])

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch(`${API_URL}/cats`)
        const data = await res.json()
        setCats(data)
      } catch (error) {
        console.error("Failed to load cats:", error)
      }
    }
    fetchCats()
  }, [])

  return (
    <Grid>
      {cats.map((cat) => (
        <CatCard key={cat._id} cat={cat} />
      ))}
    </Grid>
  )
}

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`
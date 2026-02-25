import React, { useEffect } from "react"
import { CatForm } from "../components/catForm"
import { CatList } from "../components/cardlist"
import styled from "styled-components"

export const Dashboard = ({
  cats,
  setCats,
  handleNewCat,
  loadCats,
  logout,
  user,
}) => {
  useEffect(() => {
    loadCats()
  }, [])

  return (
    <PageWrapper>
      <Header>Cat. Archive. Tracking. System.</Header>
      {user && (
        <UserBar>
          <span>Welcome, {user.name}!</span>
          <button onClick={logout}>Logout</button>
        </UserBar>
      )}
      <CatForm onSuccess={handleNewCat} />
      <SectionTitle>All Cats</SectionTitle>
      <CatList externalCats={cats} setExternalCats={setCats} />
    </PageWrapper>
  )
}


const PageWrapper = styled.main`
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
`

const Header = styled.h1`
  text-align: center;
  margin-bottom: 30px;
`

const SectionTitle = styled.h2`
  margin-top: 40px;
  margin-bottom: 10px;
`

const UserBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`
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
  onCreateComment,
  onEdit,
  onDelete,
  onDeleteComment,
}) => {
  useEffect(() => {
    loadCats()
  }, [])

  return (
    <PageWrapper role="main">
      <Header role="banner">Cat. Archive. Tracking. System.</Header>
      {user && (
        <UserBar>
          <span>Welcome, {user.name}!</span>
          <StyledBtn onClick={logout}>Logout</StyledBtn>
        </UserBar>
      )}
      <CatForm onSuccess={handleNewCat} />
      <SectionTitle>All Cats</SectionTitle>
      <CatList
        externalCats={cats}
        currentUser={user}
        onCreateComment={onCreateComment}
        onEdit={onEdit}
        onDelete={onDelete}
        onDeleteComment={onDeleteComment} />
    </PageWrapper>
  )
}


const PageWrapper = styled.main`
  max-width: 345px;
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

const StyledBtn = styled.button`
  background-color: #b0cebd;
  border: 2px solid #3f895c;
  border-radius: 8px;
  padding: 4px;
  
  &:hover {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);  padding: 4px;
    cursor: pointer;
  }
`
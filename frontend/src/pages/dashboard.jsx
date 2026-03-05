import React, { useEffect, useState } from "react"
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

  const [locationFilter, setLocationFilter] = useState("")
  const [genderFilter, setGenderFilter] = useState("")

  useEffect(() => {
    loadCats()
  }, [])

  return (
    <PageWrapper role="main">
      <TopPart>
        <Header role="banner">Cat. Archive. Tracking. System.</Header>
        {user && (
          <UserBar>
            <SectionTitle>Welcome, {user.name}!</SectionTitle>
            <StyledBtn onClick={logout}>Logout</StyledBtn>
          </UserBar>
        )}
        <CatForm onSuccess={handleNewCat} />
      </TopPart>
      <SectionTitle>All Cats</SectionTitle>
      <FiltersWrapper>
        <label>
          Location:
          <select
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="adopted">Adopted</option>
            <option value="animalshelter">Animal Shelter</option>
            <option value="fosterhome">Foster Home</option>
            <option value="outdoor">Outdoor</option>
          </select>
        </label>

        <label>
          Gender:
          <select
            value={genderFilter}
            onChange={e => setGenderFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
      </FiltersWrapper>
      <CatList
        externalCats={cats}
        currentUser={user}
        locationFilter={locationFilter}
        genderFilter={genderFilter}
        onCreateComment={onCreateComment}
        onEdit={onEdit}
        onDelete={onDelete}
        onDeleteComment={onDeleteComment} />
    </PageWrapper>
  )
}


const PageWrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TopPart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  flex-direction: column;
  margin-bottom: 30px;
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

const FiltersWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  label {
    font-size: 0.9rem;
    display: flex;
    flex-direction: column;
  }

  select {
    margin-top: 0.2rem;
    padding: 0.2rem 0.4rem;
  }
`
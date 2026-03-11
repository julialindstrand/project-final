import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../components/authenticate"
import styled from "styled-components"
import CatForm from "../components/catForm"
import CatList from "../components/cardlist"

export const Dashboard = ({
  cats,
  onNewCat,
  onEdit,
  onDelete,
  onCreateComment,
  onDeleteComment,
}) => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Filter state
  const [locationFilter, setLocationFilter] = useState("")
  const [genderFilter, setGenderFilter] = useState("")

  return (
    <PageWrapper>
      <TopPart>
        <Header>Cat Archive Tracking System</Header>

        {user && (
          <UserBar>
            <Greeting>Welcome, {user.name}!</Greeting>
            {user.role === "admin" && (
              <Link to="/admin" style={{ textDecoration: "none" }}>
                <StyledBtn>Admin Panel</StyledBtn>
              </Link>
            )}
            <StyledBtn onClick={handleLogout}>Logout</StyledBtn>
          </UserBar>
        )}

        <CatForm onSuccess={onNewCat} />
      </TopPart>

      <FilterPart>
        <SectionTitle>All Cats</SectionTitle>
        <FiltersWrapper>
          <StyledLabel>
            Location:
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="adopted">Adopted</option>
              <option value="animalshelter">Animal Shelter</option>
              <option value="fosterhome">Foster Home</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </StyledLabel>

          <StyledLabel>
            Gender:
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </StyledLabel>
        </FiltersWrapper>

        <CatList
          externalCats={cats}
          currentUser={user}
          locationFilter={locationFilter}
          genderFilter={genderFilter}
          onCreateComment={onCreateComment}
          onEdit={onEdit}
          onDelete={onDelete}
          onDeleteComment={onDeleteComment}
        />
      </FilterPart>
    </PageWrapper>
  )
}

export default Dashboard

const PageWrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TopPart = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
  padding: 20px;
  box-sizing: border-box;
`

const Header = styled.h1`
  margin-bottom: 30px;
  font-size: clamp(1.2rem, 5vw, 2rem);
`

const UserBar = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`

const Greeting = styled.span`
  margin-right: 12px;
`

const StyledBtn = styled.button`
  background-color: #b0cebd;
  border: 2px solid #3f895c;
  border-radius: 8px;
  padding: 8px;
  display: block;
  
  &:hover {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);  padding: 8px;
    cursor: pointer;
  }
`

const AdminLink = styled(Link)`
  margin-top: 20px;
  display: inline-block;
`

const FilterPart = styled.section`
  width: 100%;
  max-width: 800px;
  padding: 20px;
  box-sizing: border-box;
`

const SectionTitle = styled.h2`
  margin-bottom: 15px;
`

const FiltersWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
`
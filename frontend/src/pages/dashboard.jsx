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
            <StyledBtn onClick={handleLogout}>Logout</StyledBtn>
          </UserBar>
        )}

        {/* Admin button - only shown for admins */}
        {user?.role === "admin" && (
          <AdminLink to="/admin">
            <StyledBtn>Go to Admin Panel</StyledBtn>
          </AdminLink>
        )}

        <CatForm onSuccess={onNewCat} />
      </TopPart>

      <FilterPart>
        <SectionTitle>All Cats</SectionTitle>
        <FiltersWrapper>
          <label>
            Location:
            <StyledSelected
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="adopted">Adopted</option>
              <option value="animalshelter">Animal Shelter</option>
              <option value="fosterhome">Foster Home</option>
              <option value="outdoor">Outdoor</option>
            </StyledSelected>
          </label>

          <label>
            Gender:
            <StyledSelected
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </StyledSelected>
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
  width: 100%;
  max-width: 800px;
  padding: 20px;
`

const Header = styled.h1`
  margin-bottom: 30px;
`

const UserBar = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
`

const Greeting = styled.span`
  margin-right: 12px;
`

const StyledBtn = styled.button`
  background-color: #b0cebd;
  border: 2px solid #3f895c;
  border-radius: 8px;
  padding: 4px;
  display: block;
  margin-left: auto;
  
  &:hover {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);  padding: 4px;
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
`

const SectionTitle = styled.h2`
  margin-bottom: 15px;
`

const FiltersWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`

const StyledSelected = styled.select`
  margin-left: 5px;
`
import React from "react";
import styled from "styled-components";
import { GlobalStyle } from "./styling/GlobalStyles"
import { CatForm } from "./components/catForm";
import { CatList } from "./components/cardlist";

export const API_URL = "http://localhost:8080";

export const App = () => {
  const [cats, setCats] = React.useState([])
  const handleNewCat = (newCat) => {
    setCats((prev) => [newCat, ...prev])
  }

  return (
    <>
      <GlobalStyle />
      <PageWrapper>
        <Header>Cat. Archive. Tracking. System.</Header>
        <CatForm onSuccess={handleNewCat} />
        <SectionTitle>All Cats</SectionTitle>
        <CatList externalCats={cats} setExternalCats={setCats} />
      </PageWrapper>
    </>
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
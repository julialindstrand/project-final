import { createGlobalStyle } from "styled-components"

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    font-family: "roboto";
  }
  
  body {
    display: flex;
    flex-direction: column;
    margin: auto;
    width: 70%;
    max-width: 500px;
    padding: 30px;
}
`
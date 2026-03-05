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
    padding: 30px;

    background-color: #e4ede2;
}
`
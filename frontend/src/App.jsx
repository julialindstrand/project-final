// import React, { useState, useRef } from 'react'
import { GlobalStyle } from "./styling/GlobalStyles"
import { CatCardForm } from './components/add'

const API_URL = 'http://localhost:8080/cats'

export const App = () => {
  // const fileInput = useRef()
  // const [name, setName] = useState('')

  // const handleFormSubmit = (e) => {
  //   e.preventDefault()
  //   const formData = new FormData()
  //   formData.append('image', fileInput.current.files[0])
  //   formData.append('name', name)

  //   fetch(API_URL, { method: 'POST', body: formData })
  //     .then((res) => res.json())
  //     .then((json) => {
  //       console.log(json)
  //     })
  // }

  return (
    <>
    <GlobalStyle />
    <CatCardForm />
    </>
)}
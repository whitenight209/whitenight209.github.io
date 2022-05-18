import * as React from "react"
import {Container} from "@chakra-ui/react";
import Header from "./header";
import Footer from "./footer";

const Layout = ({ children }) => {
  return (
    <Container maxW='1080px' minW='1080px' paddingTop={100}>
      <Header/>
      {children}
      <Footer/>
    </Container>
  )
}

export default Layout

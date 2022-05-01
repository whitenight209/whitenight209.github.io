import * as React from "react"
import { Link } from "gatsby"
import {Container} from "@chakra-ui/react";
import Header from "./header";
import Footer from "./footer";

const Layout = ({ location, children, title }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <Container data-is-root-path={isRootPath} maxW='1080px' minW='1080px' paddingTop={100}>
      <Header/>
      {children}
      <Footer/>
    </Container>
  )
}

export default Layout

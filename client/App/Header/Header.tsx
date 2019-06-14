import { AppContext } from "../Context/AppContext"
import { BrowserRouter as Router, Link } from "react-router-dom"
import * as React from "react"
import styled from "@emotion/styled"

const Header = () => (
  <AppContext>
    {({ me }) => (
      <Root>
        <Menu />
        <Title />
        <LinksSection>
          {me ? (
            <StyledLink to="/create">Create event</StyledLink>
          ) : (
            <>
              <StyledLink to="/login">Log In</StyledLink>
              <StyledLink to="/signup">Sign Up</StyledLink>
            </>
          )}
        </LinksSection>
      </Root>
    )}
  </AppContext>
)

const StyledLink = styled(Link)`
  color: rgba(0,0,0,.7);
  &:not(:first-child) {
    margin-left: 8px;
  }
`

const Menu = styled.div``
const Title = styled.div`
  flex: 1;
`
const Root = styled.div`
  height: 48px;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
`

const LinksSection = styled.div`
  align-self: center;
  padding: 4px;
`
export default Header

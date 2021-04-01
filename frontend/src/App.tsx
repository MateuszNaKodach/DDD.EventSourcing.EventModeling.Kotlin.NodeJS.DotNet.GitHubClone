import React from 'react';

import {Avatar, BaseStyles, Box, Header, Heading, StyledOcticon, ThemeProvider} from '@primer/components'
import {MarkGithubIcon} from '@primer/octicons-react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {RepositoryRoute} from "./components/Repository/Repository";

const App = () => (
    <BrowserRouter>
      <ThemeProvider>
        <BaseStyles>
          <GitHubCloneHeader />
          <Box m={4}>
            <Heading mb={2}>Hello, Event Modeling!</Heading>
            <p>This is small GitHub clone focused of Pull Requests. App created for needs of Event Modeling workshops leaded by Mateusz Nowak (ZycieNaKodach.pl).</p>
          </Box>
          <Switch>
            <Route path='/:owner/:repository'>
              <RepositoryRoute />
            </Route>
          </Switch>
        </BaseStyles>
      </ThemeProvider>
    </BrowserRouter>
)

export const GitHubCloneHeader = () => {
  return (
      <Header>
        <Header.Item>
          <Header.Link href="#" fontSize={2}>
            <StyledOcticon icon={MarkGithubIcon} size={32} mr={2} />
            <span>GitHubClone | Event Modeling | ZycieNaKodach.pl</span>
          </Header.Link>
        </Header.Item>
        <Header.Item full>Mateusz Nowak</Header.Item>
        <Header.Item mr={0}>
          <Avatar
              src="https://github.com/octocat.png"
              size={20}
              square
              alt="@octocat"
          />
        </Header.Item>
      </Header>
  )
}


export default App;

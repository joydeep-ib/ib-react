import React from 'react';
import { NavBar, InterviewsPage, HomePage, InterviewPage, ParticipantsPage } from '../components';
import { Switch, Route } from 'react-router';
import { Container } from 'react-bootstrap';

const routes = (
  <div>
    <NavBar />
    <br />
    <Container>

        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/interviews" component={InterviewsPage} />
          <Route path="/interviews/:id" component={InterviewPage} />
          <Route exact path="/interviews" component={InterviewsPage} />
          <Route exact path="/participants" component={ParticipantsPage} />
        </Switch>
      </Container>
  </div>
)

export default routes;
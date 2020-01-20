import React from 'react';
import { Jumbotron, Button, Container } from 'react-bootstrap';

export const HomePage = (props) => {
  return (
    <Container>
      <br />
      <br />
      <Jumbotron>
        <h1>Interview Scheduler</h1>
        <p>
          Schedule your interviews with other people with this single page application
        </p>
        <hr />
        <p>
          Frontend: Simplex Bootstrap & Vanilla Javascript, Routing: HTML5 history, Backend: REST API using Ruby on Rails :)
          <br />
          InterviewBit Assignment: joydeep@interviewbit.com
        </p>
        <p>
          <Button variant="primary">Get Scheduled Interviews</Button>
        </p>
      </Jumbotron>
    </Container>
  )
}
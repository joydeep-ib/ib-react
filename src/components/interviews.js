import React from 'react';
import { Container, Spinner, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchInterviews } from '../actions/interviews';
import './interview.css';
import { Link } from 'react-router-dom';
import { InterviewForm } from './interview';
import { push } from 'connected-react-router';

export function InterviewCard({ interview }) {
  const _startDate =  new Date(interview.startdt);
  const _endDate = new Date(interview.enddt);

  return (
    <Card>
      <Card.Header>
        <Link to={`/interviews/${interview.id}`}>
          Interview #{interview.id}
        </Link>
      </Card.Header>
      <Card.Body>
        <Card.Title>{interview.title.toUpperCase()}</Card.Title>
        <Card.Subtitle className='text-muted'>Scheduled At: {_startDate.toString()}</Card.Subtitle>
        <br />
        <Card.Subtitle className='text-muted'>Ends At: {_endDate.toString()}</Card.Subtitle>
        <br />
        <Card.Text>
          {interview.description}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        Created At: {interview.created_at}
      </Card.Footer>
    </Card>
  )
}

class InterviewPage extends React.Component {
  state = {
    _newModalOpen: false,
  }
  componentDidMount() {
    console.log("Component Mounted");
    setTimeout(this.props.fetchInterviews, 1000);
  }
  toggleModal = () => {
    this.setState({
      _newModalOpen: !this.state._newModalOpen,
    })
  }
  render() {
    console.log(this.props);

    if (this.props.loading) {
      return (
        <Container className="loading-center">
          <Spinner animation="border" />
        </Container>
      );
    }
    return (
      <Container>
        <h1>Interviews</h1>
        <hr />
        <Row>
          <Col sm={4}>
            <Card>
              <Card.Header>Schedule New</Card.Header>
              <Card.Body>
                  <br />
                  <Button
                    variant="success"
                    style={{ flex: 1, margin: 'auto' }}
                    size="lg" block
                    onClick={this.toggleModal}
                  >
                    Add Interview
                  </Button>
                  <br />
              </Card.Body>
            </Card>
          </Col>
          {this.props.interviews.map((interview) =>
            <Col key={interview.id} sm={4}>
              <InterviewCard interview={interview} />
              <br />
            </Col>
          )}
        </Row>
        <Modal show={this.state._newModalOpen} onHide={this.toggleModal}>
          <Modal.Header>
            New Interview
          </Modal.Header>
          <Modal.Body>
            <InterviewForm
              callback={id => this.props.redirect(id)}
            />
          </Modal.Body>
        </Modal>
      </Container>
    )

  }
}

const mapStateToProps = (state) => {
  return {
    ...state.interviews,
  };
}

const mapDispatchToProps = dispatch => ({
  fetchInterviews: () => dispatch(fetchInterviews()),
  redirect: (id) => dispatch(push(`/interviews/${id}`))
});

export default connect(mapStateToProps, mapDispatchToProps)(InterviewPage);
import React from 'react';
import { Container, Spinner, Row, Col, Card, Button, ButtonGroup, Modal, Form, Table } from 'react-bootstrap';
import { InterviewCard } from './interviews';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import faker from 'faker';

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export class InterviewForm extends React.Component {
  state = {
    title: faker.name.title(),
    description: faker.lorem.paragraph(),
    startDate: (new Date()).toISOString().split('T')[0],
    endDate: '',
    startTime: '',
    endTime: '',
    participants: [],
    _tempNewEmail: '',
    _buttonText: 'Create',
    _requestAction: 'POST',
    _requestURL: '/api/v1/interviews',
    _redirect: false,
  }
  componentDidMount() {
    if (this.props.id) {
      const {
        title,
        description,
        startdt,
        enddt,
        participants,
        id
      } = this.props;

      const _startDate =  new Date(startdt);
      const _endDate = new Date(enddt);

      this.setState({
        ...this.state,
        title,
        description,
        participants,
        startDate: _startDate.toISOString().split('T')[0],
        startTime: _startDate.toLocaleTimeString(),
        endDate: _endDate.toISOString().split('T')[0],
        endTime: _endDate.toLocaleTimeString(),
        id,
        _buttonText: 'Update',
        _requestAction: 'PUT',
        _requestURL: `/api/v1/interviews/${id}`
      })
    }
  }

  handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    })
  }

  removeParticipant(id) {
    const _participantsClone = [];

    this.state.participants.forEach((p) => {
      if (p.id !== id)
        _participantsClone.push(p);
    });

    this.setState({
      participants: _participantsClone,
    });
  }
  addNewParticipant = async () => {
    const email = this.state._tempNewEmail;
    if (validateEmail(email)) {
      const _participantData = await fetch(`/api/v1/participants/by_email?email=${email}`);

      if (_participantData.status === 200) {
        const _participantDataJSON = await _participantData.json();

        const _startDate = new Date(`${this.state.startDate} ${this.state.startTime}`);
        const _endDate = new Date(`${this.state.startDate} ${this.state.endTime}`);

        // Check Participant Time slots
        if (!this.state.startDate || !this.state.startTime ||!this.state.endTime) {
          alert('Interview time is required');
          return;
        }
        const canSchedule = _participantDataJSON.interviews.every((interview) => {
          const _ibStart = new Date(interview.startdt);
          const _ibEnd = new Date(interview.enddt);
          console.log(_ibStart, _ibEnd);
          console.log(_ibStart - _startDate, _startDate - _ibEnd);
          // This interview starts before scheduled one
          if (_ibStart - _startDate >= 0  && _startDate - _ibEnd <= 0) {
            alert(`Can't add ${email}. Participant has interview scheduled ${interview.title}`);
            return false;
          }
          console.log(_startDate - _ibStart, _endDate - _ibEnd);

          // This interview is between scheduled one
          if (_startDate - _ibStart >= 0  && _endDate - _ibEnd <= 0) {
            alert(`Can't add ${email}. Participant has interview scheduled ${interview.title}`);
            return false;
          }

          return true;
        });

        if (!canSchedule) {
          return;
        }
        const _participantDataClone = [
          ...this.state.participants,
          {
            id: _participantDataJSON.id,
            name: _participantDataJSON.name,
            email: _participantDataJSON.email,
          },
        ];
        this.setState({
          ...this.state,
          _tempNewEmail: '',
          participants: _participantDataClone,
        })

      } else {
        alert(`Email ${email} didn't match any records`);
      }
    } else {
      alert('Invalid email')
    }

  }
  validateForm = () => {
    if (!this.state.title) {
      alert("Title is empty");
      return false;
    }

    if (!this.state.startDate) {
      alert("Date is empty");
      return;
    }

    if (!this.state.startTime || !this.state.endTime) {
      alert("Time is empty");
      return false;
    }
    const _startDate = new Date(`${this.state.startDate} ${this.state.startTime}`);
    const _endDate = new Date(`${this.state.startDate} ${this.state.endTime}`);

    if (_endDate - _startDate <= 0) {
      alert("Invalid End Date");
      return;
    }

    if (!this.state.participants.length) {
      alert("No participants");
      return;
    }

    return true;
  }
  handleSubmit = async () => {
    if (!this.validateForm()) {
      return;
    }
    const _start = new Date(`${this.state.startDate} ${this.state.startTime}`);
    const _end = new Date(`${this.state.startDate} ${this.state.endTime}`);

    console.log(_start, _end);
    const _formData = {
      title: this.state.title,
      description: this.state.description,
      startDate: _start.toISOString().split('T')[0],
      startTime: _start.toISOString().split('T')[1],
      endDate: _end.toISOString().split('T')[0],
      endTime: _end.toISOString().split('T')[1],
      participants: this.state.participants.map((p) => p.id),
    };

    console.log(_formData);

    const _resp = await fetch(this.state._requestURL, {
      body: JSON.stringify(_formData),
      method: this.state._requestAction,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (_resp.status === 200) {
      const _respJSON = await _resp.json();

      console.log(_respJSON);

      if (this.props.callback) {
        const { id } = _respJSON;
        this.props.callback(id);
      }
    }
  }
  render() {

    return (
      <div>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" placeholder="Title" value={this.state.title} name="title" onChange={this.handleInputChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" placeholder="Title" rows={4} value={this.state.description} name="description" onChange={this.handleInputChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Start Date</Form.Label>
          <Form.Control type="date" placeholder="Title" value={this.state.startDate} name="startDate" onChange={this.handleInputChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Start Time</Form.Label>
          <Form.Control type="time" placeholder="Title" value={this.state.startTime} name="startTime" onChange={this.handleInputChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>End Date</Form.Label>
          <Form.Control type="date" placeholder="Title" value={this.state.startDate} name="endDate" disabled />
        </Form.Group>
        <Form.Group>
          <Form.Label>End Time</Form.Label>
          <Form.Control type="time" placeholder="Title" value={this.state.endTime} name="endTime" onChange={this.handleInputChange} />
        </Form.Group>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.participants.map((participant, i) => (
              <tr key={participant.id}>
                <td>{i}</td>
                <td>
                  {participant.email}
                </td>
                <td>
                  {participant.name}
                </td>
                <td>
                  <Button
                    variant="link"
                    onClick={() => this.removeParticipant(participant.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            <tr>
              <td>{this.state.participants.length}</td>
              <td>
                <Form.Control
                  type="text"
                  placeholder="Email of new participant"
                  name="_tempNewEmail"
                  value={this.state._tempNewEmail}
                  onChange={this.handleInputChange}
                />
              </td>
              <td></td>
              <td>
                <Button variant="link" onClick={this.addNewParticipant}>Add</Button>
              </td>
            </tr>
          </tbody>
        </Table>
        <Button
          variant="primary"
          type="submit"
          onClick={this.handleSubmit}
        >
          {this.state._buttonText}
        </Button>
      </div>
    );
  }
}

export function ParticipantsCard({ name, email, resume, id }) {
  return (
    <Card>
      <Card.Body>
          <Link to={`/participant/${id}`} className="card-title h5">
            {name.toUpperCase()} #{id}
          </Link>
        <Card.Text>
          {email}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <a href={resume} download="">Download CV</a>
      </Card.Footer>
    </Card>
  )
}


class InterviewPage extends React.Component {
  state = {
    loading: true,
    editModal: false,
    deleteModal: false,
  };

  toggleModal = (name) => {
    console.log(name);
    this.setState({
      ...this.state,
      [name]: !this.state[name],
    })
  }

  fetchInterviewDetails = async (id) => {
    try {
      const _interview = await fetch(`/api/v1/interviews/${id}`);
      const _interviewJSON = await _interview.json();

      if (_interview.status === 200) {
        this.setState({
          ...this.state,
          loading: false,
          ..._interviewJSON,
        })
      } else if (_interview.status === 404) {
        this.setState({
          ...this.state,
          loading: false,
          error: true,
          message: `Interview with ID: ${id} not found`,
        })
      }

    } catch (err) {
      this.setState({
        ...this.state,
        loading: false,
        error: true,
        message: "Unable to load interview",
      })
    }
  }
  updateCallback = (id) => {
    this.setState({
      loading: true,
      editModal: false,
    });
    this.fetchInterviewDetails(id);
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    this.setState({
      loading: true,
      id,
    });
    this.fetchInterviewDetails(id);
  }
  render() {
    console.log(this.state);
    if (this.state.loading) {
      return (
        <Container className="loading-center">
          <Spinner animation="border" />
        </Container>
      );
    }
    else if (this.state.error) {
      return (
        <Container className="loading-center">
          <p>{this.state.message}</p>
        </Container>
      );
    }
    return (
      <Container>
        <h3>Interview Details #{this.state.id}</h3>
        <hr />
        <br />
        <Row>
          <Col sm={5}>
            <InterviewCard interview={this.state} />
          </Col>
          <Col sm={5}>
            {this.state.participants.map(participant => (
              <div key={participant.id}>
                <ParticipantsCard
                  name={participant.name}
                  id={participant.id}
                  email={participant.email}
                  resume='/foo'
                />
                <br />
              </div>
            ))}
          </Col>
          <Col>
            <ButtonGroup>
              <Button variant="link" onClick={() => this.toggleModal('editModal')}>Edit</Button>
              <Button variant="danger" onClick={() => this.toggleModal('deleteModal')}>Delete</Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Modal show={this.state.editModal} onHide={() => this.toggleModal('editModal')}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Interview</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InterviewForm
              id={this.state.id}
              title={this.state.title}
              description={this.state.description}
              startdt={this.state.startdt}
              enddt={this.state.enddt}
              participants={this.state.participants}
              callback={this.updateCallback}
            />
          </Modal.Body>
        </Modal>
        <Modal show={this.state.deleteModal} onHide={() => this.toggleModal('deleteModal')}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Interview</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you really want to delete this interview?
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={() => this.toggleModal('deleteModal')}>
            Close
          </Button>
          <Button variant="danger" onClick={async (e) => {
            e.preventDefault();
            const _deleteReq = await fetch(`/api/v1/interviews/${this.state.id}`, {
              method: 'DELETE'
            });

            if (_deleteReq.status !== 204) {
              alert("Unable to Delete");
            } else {
              this.props.push('/interviews')
            }
          }}>
            Delete
          </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export default connect(null, { push })(InterviewPage);
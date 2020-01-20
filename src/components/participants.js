import React from 'react';
import { connect } from 'react-redux';
import { fetchParticipants } from '../actions/participants';
import { Container, Spinner, Row, Col } from 'react-bootstrap';
import { ParticipantsCard } from './interview';
import faker from 'faker';

class ParticipantsPage extends React.Component {
    componentDidMount() {
        this.props.fetchParticipants();
    }
    render() {
        if (this.props.loading) {
            return (
              <Container className="loading-center">
                <Spinner animation="border" />
              </Container>
            );
        }
        return (
            <Container>
                <h1>Participants</h1>
                <hr />
                <Row>
                    {this.props.participants.map((participant) =>
                        <Col key={participant.id} sm={4}>
                            <ParticipantsCard
                                name={participant.name}
                                email={participant.email}
                                resume={faker.internet.avatar()}
                                id={participant.id}
                            />
                            <br />
                        </Col>
                    )}
                </Row>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.participants,
    };
}

const mapDispatchToProps = dispatch  => ({
    fetchParticipants: () => dispatch(fetchParticipants()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantsPage);
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './header.css'

function ColorSchemesExample() {

  return (
    <div > 
      <Navbar bg="dark" data-bs-theme="dark" >
        <Container style={{"height":"2.5rem"}}>
          <Navbar.Brand href="#home" style={{"paddingRight":"2rem","fontSize":"2rem"}}>PDF Summarizer</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="https://react.dev/"  target="_blank" style={{width:"26%"}}>React.js</Nav.Link>
            <Nav.Link href="https://www.djangoproject.com/"  target="_blank" style={{width:"20%"}}>Django</Nav.Link>
            <Nav.Link href="https://www.postgresql.org/"  target="_blank" style={{width:"36%"}}>PostgreSQL</Nav.Link>
            <Nav.Link href="https://react-bootstrap.netlify.app/"  target="_blank" style={{width:"16%"}}>Bootstrap</Nav.Link>

          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

export default ColorSchemesExample;
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Nav, Navbar } from 'react-bootstrap'


const Navhome = () => {
  return (
    <div>
      <>
    <Navbar bg='primary' data-bs-theme='dark'>
      <Container>
        <Navbar.Brand href="#home">GovEase</Navbar.Brand>
        <Nav className="me-auto" >
            <Nav.Link href="#home">Personal-Details</Nav.Link>
            <Nav.Link href="#features">Services</Nav.Link>
            <Nav.Link href="#pricing"></Nav.Link>
          </Nav>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">Admin</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>   
  </>
    </div>
  )
}

export default Navhome
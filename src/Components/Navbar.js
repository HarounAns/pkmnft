import { Link } from "react-router-dom";
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';

export default function NavigationBar({ addr }) {
    return (
        <div>
            <Navbar color="light" light expand="md">
                <NavbarBrand >
                    <Link to="/" style={{ ...linkStyle, color: 'rgba(0,0,0,.9)', marginLeft: 10 }}>PKMNFT Market</Link>
                </NavbarBrand>
                <Nav className="mr-auto" navbar>
                    <NavItem>
                        <NavLink href="#">
                            <Link to="/mint" style={linkStyle}> Mint Token</Link>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#">
                            <Link to="/my-tokens" style={linkStyle}>My Tokens</Link>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        {
                            addr &&
                            <div style={{ marginTop: "8px", marginLeft: "5px" }}>
                                {`${addr.slice(0, 5)}...${addr.slice(addr.length - 4, addr.length)}`}
                            </div>
                        }
                    </NavItem>
                </Nav>
            </Navbar>
        </div>
    );
};


const linkStyle = {
    textDecoration: 'none',
    color: 'rgba(0,0,0,.55)'
};
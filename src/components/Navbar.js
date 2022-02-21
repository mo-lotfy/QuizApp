import React, { Suspense, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Button } from "reactstrap";

// const Timelines = React.lazy(() => import("./pages/timeline/index"));
// const StoreImages = React.lazy(() => import("./pages/StoreImages"));

function NavbarComponent(props) {
  // const {  } = props;

  // useEffect(() => {}, []);

  return (
    <>
      <Navbar color="dark" dark expand="xl">
        <NavbarBrand to="/" tag={Link}>Quizapp</NavbarBrand>
        <NavbarToggler onClick={function noRefCheck() {}} />
        <Collapse navbar>
          <Button to="/create" tag={Link}>Create Quiz</Button>
        </Collapse>
      </Navbar>
    </>
  );
}

export default connect((state) => state, {})(NavbarComponent);

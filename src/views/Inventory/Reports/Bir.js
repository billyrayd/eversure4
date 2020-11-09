import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from 'actions/dashboard';
import * as AuthActions from 'actions/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

//reactstrap
import {
	Container,
	Row,
	Col,
	Button,
	Table,
	Tooltip,
	Input,
	Spinner,
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from 'reactstrap';

import { reports_sublinks } from 'helpers/sublinks/Inventory/';

import NavBar from 'components/Navbars/NavBar';
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import NoAccess from 'components/CustomComponents/NoAccess';

var ps;

class Bir extends React.PureComponent {
	constructor(props) {
		super(props);

		this.mainContent = React.createRef();

		this.state = {
			value: '',
			isOpen: false,
			spinnerIsVisible: false,
		}
	}
	componentDidMount(){
    document.body.classList.remove("disable-scroll");
	}
  componentWillUnmount() {
  }
	logOut = () => {
		const that = this;
		this.props.actions.Authenticate(false)
		.then((res) => {
			if(res){
				that.props.history.push("/")
			}
		})
	}
	toggleSubSidebar = () => {
		let { isOpen } = this.state;

		this.setState({isOpen: !isOpen})
	}

	render() {
		let { value, isOpen, spinnerIsVisible } = this.state;
		const permission = true;

		const currentPage = ["BIR","/bir/"];
		return (
			<div>
				<InventorySidebar history={this.props.history} component="Reports" />
				<div className="content" ref={this.mainContent}>
					<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut}/>
					{
						permission ?
						<div className="main-panel">
							<Container fluid>
								<Row>
									<Col xs="6">
										<h1 className="page-title inner">Reports</h1>
									</Col>
									<Col xs="6" md="3">
										<Link to="/" className="main-link mobile"><FontAwesomeIcon icon="caret-left"/> main menu</Link>
									</Col>
								</Row>
								<Row>
									<Col>
										<div className="space" />
									</Col>
								</Row>
								<Row className="mobile-subsidebar">
									<Col md="12">
										<ButtonDropdown isOpen={isOpen} toggle={this.toggleSubSidebar}>
								      <DropdownToggle caret>
								        {currentPage[0]}
								      </DropdownToggle>
								      <DropdownMenu>
								      	{
								      		reports_sublinks.map((link, key) => {
														const className = link.nonLink ? link.className : (currentPage[1] == link.path ? "active" : "");

								      			return link.visible ? <DropdownItem className={className} key={key} onClick={() => link.nonLink ? null : this.props.history.push(link.path)}>
								      				{link.divider ? <hr /> : link.name}
								      			</DropdownItem> : null
								      		})
								      	}
								      </DropdownMenu>
								    </ButtonDropdown>
									</Col>
									<Col md="12">
										<div className="space20" />
									</Col>
								</Row>
								<Row className="page-header">
									<Col>
										<h4>Report for BIR</h4>
									</Col>
								</Row>
								<Row>
										<div className="space20" />
								</Row>
								<Row>
									<Col md="4">
										<Input type="select" name="select" id="exampleSelect">
						          <option>Cash</option>
						          <option>Installments</option>
						        </Input>
									</Col>
									<Col md="4"></Col>
									<Col md="4"><Button color="primary es-main-btn" className="float-right">Download as Excel File</Button></Col>
								</Row>
								<Row>
									<Col>
									</Col>
								</Row>
							</Container>
						</div> :
						<NoAccess />
					}
						
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  authenticated: state.user_auth.authenticated,
  loggingIn: state.user_auth.loggingIn,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, DashboardActions, AuthActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bir);

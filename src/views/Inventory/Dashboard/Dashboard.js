import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from 'actions/dashboard';
import * as AuthActions from 'actions/auth';

import { Link } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toastr from 'toastr';
import Select from 'react-select';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_material from "@amcharts/amcharts4/themes/material";

//reactstrap
import {
	Container,
	Row,
	Col
} from 'reactstrap';

import NavBar from 'components/Navbars/NavBar';
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import NoAccess from 'components/CustomComponents/NoAccess';
import LoggingOut from 'components/CustomComponents/LoggingOut';

var $ = require( 'jquery' );

var ps;

// am4core.useTheme(am4themes_material);
am4core.useTheme(am4themes_animated);

class Dashboard extends React.PureComponent {
	constructor(props) {
		super(props);

		this.mainContent = React.createRef();

		this.state = {
			unsoldOpt: {value: 'today',label: 'TODAY'},
			soldOpt: {value: 'today',label: 'TODAY'},
			unsoldData: [
				{
				  "model": "NMAX",
				  "count": 9
				},
				{
				  "model": "MIO",
				  "count": 882
				}, {
				  "model": "BARAKO 175",
				  "count": 809
				}, {
				  "model": "SNIPER 150",
				  "count": 322
				}, {
				  "model": "CT 100",
				  "count": 122
				}, {
				  "model": "RAIDER 150",
				  "count": 114
				}, {
				  "model": "ROUSER NS200",
				  "count": 84
				}, {
				  "model": "CT 125",
				  "count": 11
				}, {
				  "model": "RAIDER 115",
				  "count": 65
				}, {
				  "model": "BEAT",
				  "count": 80
				}, {
				  "model": "XRM 150",
				  "count": 43
				}, {
				  "model": "ROUSER 180",
				  "count": 41
				}
				],
				soldData: [
					{
					  "model": "NMAX",
					  "count": 9
					},
					{
					  "model": "MIO",
					  "count": 7
					}, {
					  "model": "BARAKO 175",
					  "count": 234
					}, {
					  "model": "SNIPER 150",
					  "count": 34
					}, {
					  "model": "CT 100",
					  "count": 389
					}, {
					  "model": "RAIDER 150",
					  "count": 23
					}, {
					  "model": "ROUSER NS200",
					  "count": 12
					}, {
					  "model": "RAIDER 115",
					  "count": 15
					}, {
					  "model": "BEAT",
					  "count": 43
					}, {
					  "model": "XRM 150",
					  "count": 8
					}, {
					  "model": "ROUSER 180",
					  "count": 98
					}
				]
		}
	}
	componentDidMount(){
		let { unsoldData,soldData, } = this.state;
		let chartSold = am4core.create("soldUnits", am4charts.XYChart);

		// Add data
		chartSold.data = soldData;
		// Create axes
		let SoldcategoryAxis = chartSold.xAxes.push(new am4charts.CategoryAxis());
		SoldcategoryAxis.dataFields.category = "model";
		SoldcategoryAxis.renderer.grid.template.location = 0;
		SoldcategoryAxis.renderer.minGridDistance = 30;
		SoldcategoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
		  if (target.dataItem && target.dataItem.index & 2 == 2) {
		    return dy + 25;
		  }
		  return dy;
		});
		let SoldvalueAxis = chartSold.yAxes.push(new am4charts.ValueAxis());
		// Create series
		let Soldseries = chartSold.series.push(new am4charts.ColumnSeries());
		Soldseries.dataFields.valueY = "count";
		Soldseries.dataFields.categoryX = "model";
		Soldseries.name = "Count";
		Soldseries.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
		Soldseries.columns.template.fillOpacity = .8;

		let SoldcolumnTemplate = Soldseries.columns.template;
		SoldcolumnTemplate.strokeWidth = 3;
		SoldcolumnTemplate.strokeOpacity = 1;
		SoldcolumnTemplate.fill = "#ff6600";
		SoldcolumnTemplate.stroke = "#921603";
	}
  componentWillUnmount() {
  }
	logOut = () => {
		const that = this;
		$("body").addClass("disable-scroll");
		that.props.actions.LoggingOut(true);
		that.props.actions.Logout()
		.then((res) => {
			$("body").removeClass("disable-scroll");
			that.props.actions.LoggingOut(false);
			if(res){
				that.props.actions.LoginUser(false);
				that.props.history.push("/");
			}else{
				toastr.error("Failed to logout");
			}
		})
	}
	handleChangeUnsoldOpt = (option) => {
		console.log(option)
		this.setState({unsoldOpt: option, unsoldData: [{model: "NMAX", count: 13},{model: "BARAKO 175", count: 3},{model: "CT100", count: 32},{model: "SNIPER 150", count: 28},{model: "RAIDER 115", count: 11}]})
	}
	handleChangeSoldOpt = (option) => {
		console.log(option)
		this.setState({soldOpt: option, soldData: [{model: "BARAKO 175", count: 113},{model: "CT100", count: 213},{model: "SNIPER 150", count: 13},{model: "ROUSER NS 200", count: 23},{model: "NMAX", count: 14}]})
	}

	render() {
		let { loggingOut,userPermission } = this.props;
		let { unsoldOpt,soldOpt } = this.state;
		var data = [
			{ letter: 'A' },
			{ letter: 'B' },
			{ letter: 'C' },
			{ letter: 'D' },
			{ letter: 'E' },
		];
		const chartOpt = [
			{value: 'today',label: 'TODAY'},
			{value: 'week',label: 'THIS WEEK'},
			{value: 'month',label: 'THIS MONTH'},
		]


		let { unsoldData,soldData, } = this.state;
		let chartUnsold = am4core.create("unsoldUnits", am4charts.XYChart);

		// Add data
		chartUnsold.data = unsoldData;
		// Create axes
		let categoryAxis = chartUnsold.xAxes.push(new am4charts.CategoryAxis());
		categoryAxis.dataFields.category = "model";
		categoryAxis.renderer.grid.template.location = 0;
		categoryAxis.renderer.minGridDistance = 30;
		categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
		  if (target.dataItem && target.dataItem.index & 2 == 2) {
		    return dy + 25;
		  }
		  return dy;
		});
		let valueAxis = chartUnsold.yAxes.push(new am4charts.ValueAxis());
		// Create series
		let series = chartUnsold.series.push(new am4charts.ColumnSeries());
		series.dataFields.valueY = "count";
		series.dataFields.categoryX = "model";
		series.name = "Count";
		series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
		series.columns.template.fillOpacity = .8;

		let columnTemplate = series.columns.template;
		columnTemplate.strokeWidth = 3;
		columnTemplate.strokeOpacity = 1;
		columnTemplate.fill = "#ff6600";
		columnTemplate.stroke = "#921603";

		const permission = userPermission.length > 0 ? (userPermission[0].permissions[0].level > 0) : false;
		return (
			<div>
				<LoggingOut loggingOut={loggingOut} />
				<InventorySidebar history={this.props.history} component="Dashboard" />
				<div className="content" ref={this.mainContent}>
					<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut}/>
					{
						permission ?
						<div className="main-panel">
							<Container fluid style={{paddingBottom: 120}}>
								<Row>
									<Col xs="6" md="9">
										<h1 className="page-title">Dashboard</h1>
									</Col>
									<Col xs="6" md="3">
										<Link to="/" className="main-link mobile"><FontAwesomeIcon icon="caret-left"/> main menu</Link>
									</Col>
										{
											// data.map((v, i) => {
											// 	return <div key={i} className="test">{v.letter}</div>
											// })
										}
								</Row>
								<Row>
									<br />
								</Row>
								<Row>
									<Col md="6"><h4>Unsold Units</h4></Col>
									<Col />
									<Col md="4">
			          		<Select
			                options={chartOpt}
			                placeholder="Select"
			                value={unsoldOpt}
			                onChange={this.handleChangeUnsoldOpt}
			              />
			            </Col>
								</Row>
								<Row>
									<Col>
										<div className="" id="unsoldUnits" style={{ width: "100%", height: "500px" }}>
										</div>
									</Col>
								</Row>
								<Row>
									<br />
									<br />
									<br />
								</Row>
								<Row>
									<Col md="6"><h4>Sold Units</h4></Col>
									<Col />
									<Col md="4">
			          		<Select
			                options={chartOpt}
			                placeholder="Select"
			                value={soldOpt}
			                onChange={this.handleChangeSoldOpt}
			              />
									</Col>
								</Row>
								<Row>
									<Col>
										<div className="" id="soldUnits" style={{ width: "100%", height: "500px" }}>
										</div>
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
  loggingOut: state.user_auth.loggingOut,
  userPermission: state.login.userPermission,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, DashboardActions, AuthActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

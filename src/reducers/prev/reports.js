import {
	REPORTS_SELECTED_BRANCH,
	VIEW_REPORT_DATA,
	DELETE_REPORT_UNSOLD,
	FINANCIAL_INFO,
}

	from '../constants/reports';

const initialState = {
	reportsSelectedBranch: [],
	viewReportData: '',
	financialInfo : '',
	deleteUnsoldReport : ''
}

export default function category(state = initialState, action) {
	switch (action.type) {

		case REPORTS_SELECTED_BRANCH:
			var selectedBranchObj = [];

			selectedBranchObj.push({
				branch_name: action.data
			});

			return {
				...state,
				reportsSelectedBranch: selectedBranchObj
			}
			break;

		case VIEW_REPORT_DATA:
			return {
				...state,
				viewReportData: action.data
			}
			break;
		case FINANCIAL_INFO:
			return {
				...state,
				financialInfo: action.data
			}
			break;
		case DELETE_REPORT_UNSOLD:
			return {
				...state,
				deleteUnsoldReport: action.data
			}
			break;

		default: return state;
	}
}

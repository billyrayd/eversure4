import {
    CUSTOMERS_TERMS_LIST,
    CUSTOMERS_CASH_LIST,
    SET_CUSTOMER_TYPE,
    SET_CUSTOMER_INFO,
    SET_CUSTOMER_PAYMENTS,
    BRANCH_IN_ADD_CUST,
    SET_CUSTOMER_LEDGER_INFO,
    SET_ALL_CUSTOMERS,
    SET_CURRENT_PN,
    SET_TOTAL_PAYMENTS,
    SET_RECOMPUTE_DATA,
    SELECTED_PAYMENTS,
    SELECTED_SCHEDULE,
    PAYMENT_INFO_EDIT,
    UPDATE_CUSTOMER_INFO,
    SET_NEW_CUSTOMER_DATA,
    EDIT_PAYMENT,
    AREA_NAME_LIST,
    SET_LEDGER_TABLE_DATA,
} from 'constants/prev/customers'

const initialState = {
    customersTerms: [],
    customerCash: [],
    type: null,
    customerInfo: {},
    customerPayments: [],
    addCustBranch: '',
    allCustomers: [],
    promisory_note: 0,
    total_payments: 0,
    areaList: [],
    recomputeData: [],
    selected_payments: [],
    selected_schedule: [],
    setNewCustomerData: [],

}

export default function customers(state = initialState, action) {
    switch (action.type) {

        case CUSTOMERS_TERMS_LIST:
            return {
                ...state,
                customersTerms: action.data
            }

        case CUSTOMERS_CASH_LIST:
            return {
                ...state,
                customerCash: action.data
            }

        case SET_CUSTOMER_TYPE:
            return {
                ...state,
                type: action.data
            }

        case SET_CUSTOMER_INFO:
            return {
                ...state,
                customerInfo: action.data
            }

        case SET_CUSTOMER_PAYMENTS:
            return {
                ...state,
                customerPayments: action.data
            }

        case AREA_NAME_LIST:
            return {
                ...state,
                areaList: action.data
            }

        case SET_RECOMPUTE_DATA:
            return {
                ...state,
                recomputeData: action.data
            }

        case PAYMENT_INFO_EDIT:
            return {
                ...state,
                paymentInfoEdit: action.data
            }

        case UPDATE_CUSTOMER_INFO:
            return {
                ...state,
                updateCustomerInfo: action.data
            }

        case EDIT_PAYMENT:
            return {
                ...state,
                editPayment: action.data
            }

        case SET_NEW_CUSTOMER_DATA:
            return {
                ...state,
                setNewCustomerData: action.data
            }

        case BRANCH_IN_ADD_CUST:
            return {
                ...state,
                addCustBranch: action.data
            }

        case SET_CUSTOMER_LEDGER_INFO:
            return {
                ...state, customerLedgerInfo: action.payload.data
            };

        case SET_ALL_CUSTOMERS:
            return {
                ...state, allCustomers: action.payload.data
            };

        case SET_CURRENT_PN:
            return {
                ...state, promisory_note: action.payload.data
            };

        case SET_TOTAL_PAYMENTS:
            return {
                ...state, total_payments: action.payload.data
            };

        case SELECTED_PAYMENTS:
            return {
                ...state, selected_payments: action.payload.data
            };

        case SELECTED_SCHEDULE:
            return {
                ...state, selected_schedule: action.payload.data
            };

        case SET_LEDGER_TABLE_DATA:
            return {
                ...state, customerLedgerInfo: action.payload.data
            };

        case AREA_NAME_LIST:
            return {
                ...state, areaList: action.data
            };

        default:
            return state;
    }
}

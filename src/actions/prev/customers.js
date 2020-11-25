import {
    CUSTOMERS_TERMS_LIST,
    CUSTOMERS_CASH_LIST,
    SET_CUSTOMER_TYPE,
    SET_CUSTOMER_INFO,
    SET_TOTAL_PAYMENTS,
    SET_PAYMENTS,
    SET_CUSTOMER_PAYMENTS,
    BRANCH_IN_ADD_CUST,
    SET_CUSTOMER_LEDGER_INFO,
    SET_NEW_CUSTOMER_DATA,
    SET_RECOMPUTE_DATA,
    EDIT_PAYMENT,
    SET_LEDGER_ITEM_ID,
    SET_ALL_CUSTOMERS,
    AREA_NAME_LIST,
} from '../constants/customers';

import feathers from '../helpers/feathers';
import moment from 'moment';
import {
    SET_LEDGER_TABLE_DATA,
} from '../constants/customers';
import {twoDecimalPlaces, numberWithCommas} from '../helpers';
import {logger} from "redux-logger/src";

const SH_CUSTOMER_PAYMENTS = 'customer-payments-secondhand';
const SH_CUSTOMER_LEDGER = 'ledger-secondhand';
const SH_CUSTOMERs = 'customer-secondhand-unit'; // customers w/ secondhand units
const SH_UNITS = 'secondhand'; // secondhand motorcycle units

export function addCustomer(formData) {
    return (dispatch, getState) => {
        // const feathers = getState().feathersClient.app,
        const customerService = feathers.service('customers'),
            customerAriaService = feathers.service('customer-area'),
            productsService = feathers.service('products');
        const result = [];

        // return Promise.resolve(true);
        // return;
        let query;
        if (formData.account_number !== '') {
            query = {
                query: {
                    account_number: formData.account_number
                }
            }
        } else {
            query = {
                query: {
                    account_number: 'mu1t@rts'
                }
            }
        }

        var addCustomerServiceArea = (d, f) => {
            let areaQuery;
            const areaLabel = f.area;

            result['account_number'] = d.account_number;
            result['status'] = 'success';
            result['customer_id'] = d._id;
            result['data'] = d;

            if (areaLabel) {
                areaQuery = {
                    query: {
                        area_name: {
                            name: areaLabel,
                        },
                    }
                }
            }
            customerAriaService.find(areaQuery)
                .then((exist) => {
                    if (exist.total) {
                        let result = [];
                        result['status'] = 'exist';
                        // return Promise.resolve(result);
                    } else {
                        customerAriaService.create({
                            area_name: {
                                name: areaLabel,
                            }
                        }).then((data) => {
                            // console.log('CREATE AREA =====', data)
                            // return Promise.resolve(result);
                        }).catch((error) => {
                            // console.log('ERROR AREA', error)
                            // return Promise.resolve(result);
                        });
                    }
                    // console.log("AREA SAVE =====", areaQuery)
                }).catch((error) => {
                // return Promise.resolve(result);
                // console.log("ERROR ====", error)
            });
        }

        return customerService.find(query)
            .then((exist) => {
                if (exist.total) {
                    result['status'] = 'exists';
                    return Promise.resolve(result);
                } else {
                    return customerService.create(formData)
                        .then((data) => {
                            if (formData.unit) {
                                return productsService.patch(formData.unit, {
                                    customer: data._id,
                                    date_sold: moment(formData.date_purchased).format('MM/DD/YYYY'),
                                    type: 1
                                }).then((products) => {
                                    addCustomerServiceArea(data, formData)
                                    result['status'] = 'success';
                                    result['data'] = data;
                                    result['customer_id'] = data._id;
                                    result['account_number'] = data.account_number;
                                    return Promise.resolve(result)
                                }).catch((err) => {
                                    console.log('patch product error', err)

                                    result['status'] = 'error';
                                    result['customer_id'] = err
                                    var error = err.name;
                                    return Promise.resolve(result);
                                });
                            } else {
                                addCustomerServiceArea(data, formData)
                                result['status'] = 'success';
                                return Promise.resolve(result)
                            }
                        }).catch((err) => {
                            console.log('create cust err', err)
                            console.log('create cust err', formData)
                            var error = err.name;

                            result['status'] = 'error';
                            return Promise.resolve(result);
                        });
                }
            }).catch((err) => {
                console.log('find account num err ', err);
                result['status'] = 'error';
                return Promise.resolve(result);
            })
    }
}

export const reCompute = (customer_id, customer_name, start_date, promisory_note, terms, recompute_status, prev_customer_name, secondhand = false) => {
    return (dispatch, getState) => {
        let customersSRVC = feathers.service(secondhand ? SH_CUSTOMERs : 'customers'),
            MainCustomersSRVC = feathers.service(secondhand ? SH_CUSTOMERs : 'customers');
        let customerDetails = {}
        if (customer_name === '') {
            customerDetails = {
                term: terms,
                promisory_note: promisory_note,
                date_purchased: start_date,
                prev_customer_name: prev_customer_name,
                recompute_status: 0,
                first_payment_date: start_date,
            }
        } else {
            customerDetails = {
                name: customer_name,
                term: terms,
                promisory_note: promisory_note,
                date_purchased: start_date,
                prev_customer_name: prev_customer_name,
                recompute_status: 0,
                first_payment_date: start_date,
            }
        }

        return customersSRVC.patch(customer_id, customerDetails)
            .then((data) => {

                MainCustomersSRVC.find({
                    query: {
                        account_number: data.account_number
                    }
                })
                    .then((main_res) => {
                        if (main_res.total) {
                            let main_customer_id = main_res.data[0]._id;

                            MainCustomersSRVC.patch(main_customer_id, customerDetails)
                                .then((main_patch) => {
                                })
                                .catch((main_patch_err) => {
                                    console.log('main_patch_err ', main_patch_err)
                                })
                        }
                    })
                    .catch((main_cust_find_err) => {
                        console.log('main_cust_find_err ', main_cust_find_err)
                    })

                return Promise.resolve(data)
            })
            .catch((error) => {
                console.log("error OF PREV ====", error)
                return Promise.resolve(false)
            })
    }
}


export const changePaymentStatus = (account_number, secondhand = false) => {
    return (dispatch, getState) => {
        let SERVICE = feathers.service(secondhand ? SH_CUSTOMER_PAYMENTS : 'customer-payments'),
            MAIN_SERVICE = feathers.service(secondhand ? SH_CUSTOMER_PAYMENTS : 'customer-payments'),
            data = [],
            output = [],
            query = {
                query: {
                    account_number: account_number,
                    current: 1
                }
            };

        return SERVICE.find(query)
            .then((result) => {

                if (result.total) {
                    let current = result.data;

                    current.map((res) => {
                        SERVICE.patch(res._id, {
                            current: 0
                        })
                            .then(() => {
                            })
                    })

                    MAIN_SERVICE.find(query)
                        .then((main_result) => {
                            if (main_result.total) {
                                let main_current = main_result.data;

                                main_current.map((main_res) => {
                                    MAIN_SERVICE.patch(main_res._id, {
                                        current: 0
                                    })
                                        .then((main_patch_res) => {
                                        })
                                        .catch((main_patch_err) => {
                                            console.log('payment main_patch_err ', main_patch_err)
                                        })
                                })
                            }
                        })
                        .catch((main_find_err) => {
                            console.log('main_find_err payment ', main_find_err)
                        })
                } else {
                    MAIN_SERVICE.find(query)
                        .then((main_result) => {
                            if (main_result.total) {
                                let main_current = main_result.data;

                                main_current.map((main_res) => {
                                    MAIN_SERVICE.patch(main_res._id, {
                                        current: 0
                                    })
                                        .then((main_patch_res) => {
                                        })
                                        .catch((main_patch_err) => {
                                            console.log('payment main_patch_err ', main_patch_err)
                                        })
                                })
                            }
                        })
                        .catch((main_find_err) => {
                            console.log('main_find_err payment ', main_find_err)
                        })
                }
            })
            .catch((e) => {
                console.log('changePaymentStatus e ', e)
            })
    }
}

export const changeCustomerSchedule = (account_number, secondhand = false) => {
    return (dispatch, getState) => {
        let SERVICE = feathers.service(secondhand ? SH_CUSTOMER_LEDGER : 'ledger'),
            MAIN_SERVICE = feathers.service(secondhand ? SH_CUSTOMER_LEDGER : 'ledger'),
            data = [],
            output = [],
            query = {
                query: {
                    account_number: account_number,
                    current: 1
                }
            }
        return SERVICE.find(query)
            .then((result) => {
                if (result.total) {
                    let current = result.data;

                    current.map((res) => {
                        SERVICE.patch(res._id, {
                            current: 0
                        })
                            .then(() => {
                                MAIN_SERVICE.find(query)
                                    .then((main_result) => {
                                        if (main_result.total) {
                                            let main_current = main_result.data;


                                        }
                                    })
                                    .catch((e) => {
                                        console.log('main changeCustomerSchedule e ', e)
                                    })
                            })
                    })
                }
            })
            .catch((e) => {
                console.log('changeCustomerSchedule e ', e)
            })
    }
}


export const setRecomputeData = (data) => {
    return {
        type: SET_RECOMPUTE_DATA,
        payload: {
            data: data
        }
    }
}

export function addCustomerServiceArea(data, formData) {
    const customerAriaService = feathers.service('customer-area'),
        result = [];
    let areaQuery;

    result['account_number'] = data.account_number;
    result['status'] = 'success';
    result['customer_id'] = data._id;
    result['data'] = data;

    const areaLabel = formData.area;

    if (areaLabel) {
        areaQuery = {
            query: {
                area_name: {
                    name: areaLabel,
                },
            }
        }
    }
    customerAriaService.find(areaQuery)
        .then((exist) => {
            if (exist.total) {
                let result = [];
                result['status'] = 'exist';
                // return Promise.resolve(result);
            } else {
                customerAriaService.create({
                    area_name: {
                        name: areaLabel,
                    }
                }).then((data) => {
                    console.log('CREATE AREA =====', data)
                    // return Promise.resolve(result);
                }).catch((error) => {
                    // console.log('ERROR AREA', error)
                    // return Promise.resolve(result);
                });
            }
            // console.log("AREA SAVE =====", areaQuery)
        }).catch((error) => {
        // return Promise.resolve(result);
        // console.log("ERROR ====", error)
    });
}

export function mainaddCustomer(formData) {
    return (dispatch, getState) => {
        // var feathers = getState().feathersClient.mainapp,
        const customerService = feathers.service('customers'),
            productsService = feathers.service('products');
        console.log('=======================');
        console.log(formData);
        return customerService.create(formData)
            .then((data) => {
                // console.log('data', data);
                // var result = [];

                // result['status'] = 'success';

                // 	return Promise.resolve(result);
                return productsService.patch(formData.unit, {
                    customer: data._id,
                    date_sold: moment().format('MM/DD/YYYY'),
                    type: 1
                })
                    .then((products) => {

                        console.log('main ', products)
                        var result = [];

                        result['status'] = 'success';
                        result['result'] = data;

                        return Promise.resolve(result);
                    }).catch((err) => {
                        var error = err.name;
                        return Promise.resolve(false);
                    });

            }).catch((err) => {
                console.log('error', err)
                var error = err.name;
                return Promise.resolve(false);
            });
    }
}

export function getTermsCustomers(customerName, accountNumber) {
    return (dispatch, getState) => {
        // var feathers = getState().feathersClient.app,
        const output = [], data = [], customerService = feathers.service('customers');
        let branchname = getState().login.userData.branch_info.branch_name;
        let branchid = getState().login.userData.branch_info._id;
        let query = {
            account_status: {
                $nin: [1, 2]
            },
            type: {
                $ne: 0
            }
        };

        if (branchname != "MAIN") {
            query.branch = branchid;
        }

        if (accountNumber) {
            query.account_number = {
                $regex: accountNumber
            }
        }
        if (customerName) {
            query.name = {
                $regex: customerName.toUpperCase()
            }
        }

        return customerService.find({
            query: query
        })
            .then((customers) => {
                const results = customers.data,
                    data = [];
                results.forEach((value, index) => {
                    const custPay = value.customer_payments.length <= 0 ? 0 : value.customer_payments;
                    const promNote = isNaN(Number(value.promisory_note)) ? 0 : value.promisory_note;
                    const actionBtn = `<button class="btn btn-sm btn-new-view" title="View">
<span class="fa fa-eye"></span></button> <button class="btn btn-sm btn-new-edit" title="edit">
<span class="fa fa-pencil"></span></button>`,
                        totalPaid = custPay,
                        totalDebit = custPay
                    let total_payments = 0,
                        total_debit = 0;

                    totalPaid.length > 0 && totalPaid.map((values) => {
                        total_payments += Number(values.total_paid)
                    });

                    totalDebit.length > 0 && totalDebit.map((data) => {
                        total_debit += Number(data.debit ? data.debit : 0);
                    });
                    const remaining_balance = Number(promNote) - Number(total_payments) + Number(total_debit);
                    // var actionBtn = '<button class="btn border-radius-50 text-white table-btn view">View</button>';

                    data.push([
                        value.name,
                        value.account_number ? value.account_number : 'CASH',
                        value.customer_address ? value.customer_address : '',
                        value.contact_number ? value.contact_number : '',
                        numberWithCommas(remaining_balance) + '.00',
                        actionBtn,
                        value]);
                });
                output['data'] = data;
                return Promise.resolve(output);

            }).catch((err) => {
                console.log(err);
                output['data'] = false;
            })
    }
}

export const getCustomerList = (query) => {
    return (dispatch, getState) => {
        let SERVICE = feathers.service('customers'),
            SERVICE2 = feathers.service('customer-secondhand-unit'),
            data = [],
            output = [],
            brandNew = true;

        // let query = {
        // 	query: {
        // 		type: 1
        // 	}
        // }
        query.account_status = {
            $nin: [1, 2]
        }
        query.type = {
            $ne: 0
        }

        return SERVICE.find({
            query: query
        })
            .then((result) => {
                if (result.total) {
                    result.data.map((value, i) => {
                        let btnClass = 'btn-primary',
                            btnTxt = 'VIEW LEDGER',
                            btnType = 'view',
                            actionBtn = `<button class="btn btn-new-view ${btnClass} ${btnType}" title="${btnTxt}">${btnTxt}</button>`;
                        data.push([value.name, value.account_number, actionBtn, value, brandNew])
                    })
                }

                output['data'] = data;
                return Promise.resolve(output)
            })
            .catch((error) => {
                console.log("ERRROR CONSOLE", error)
                output['data'] = false;
                return Promise.resolve(output)
            })
    }
}

export function getCashCustomers() {
    return (dispatch, getState) => {
        const customerService = feathers.service('customers');
        return customerService.find({
            query: {
                type: 0
            }
        }).then((customers) => {
            var results = customers.data,
                data = [];
            results.forEach((value, index) => {
                var actionBtn = '<button class="btn border-radius-50 text-white table-btn view">View</button>';
                data.push([value.name, value._id, actionBtn, value]);
            });

            return Promise.resolve(data);

        }).catch((err) => {
            // console.log('customersData', err)
        })
    }
}


export function getCustomersWithSecondhandUnits() {
    return (dispatch, getState) => {
        const customerService = feathers.service('customer-secondhand-unit');

        return customerService.find().then((customers) => {
            var results = customers.data,
                data = [];
            results.forEach((value, index) => {
                // var actionBtn = '<button class="btn border-radius-50 text-white table-btn view">View</button>';
                var actionBtn = '<button class="btn btn-sm btn-warning view" title="View"><span class="fa fa-eye" /></button>';
                data.push([value.name, value.account_number, actionBtn, value]);
            });

            return Promise.resolve(data);

        }).catch((err) => {
            return Promise.resolve(false)
            // console.log('customersData', err)
        })
    }
}

export const getSecondhandCustomerList = (query) => {
    return (dispatch, getState) => {
        // let feathers = getState().feathersClient.app,
        const SERVICE = feathers.service(SH_CUSTOMERs),
            data = [],
            output = [],
            brandNew = false;

        query.account_status = {
            $nin: [1, 2]
        };
        query.payment_method = {
            $ne: 0
        };

        return SERVICE.find({
            query: query
        })
            .then((result) => {
                if (result.total) {
                    result.data.map((value, i) => {
                        let btnClass = 'btn-primary',
                            btnTxt = 'VIEW LEDGER',
                            btnType = 'view btn-new-view',
                            actionBtn = `<button class="btn ${btnClass} ${btnType}" title="${btnTxt}">${btnTxt}</button>`;
                        data.push([value.name, value.account_number, actionBtn, value, brandNew])
                    })

                    output['data'] = data;
                    return Promise.resolve(output)
                } else {

                    output['data'] = false;
                    return Promise.resolve(output)
                }
            })
            .catch((err) => {
                console.log("ERRROR SEC", err)
                output['data'] = false;
                return Promise.resolve(output)
            })
    }
}

export function getCustomersWithRepossessedUnits(customerName, accountNumber) {
    return (dispatch, getState) => {
        const output = [],
            data = [],
            customerService = feathers.service('customers');

        let query = {
            account_status: 2,
            type: {
                $ne: 0
            }
        }

        if (accountNumber) {
            query.account_number = {
                $regex: accountNumber
            }
        }
        if (customerName) {
            query.name = {
                $regex: customerName.toUpperCase()
            }
        }
        console.log('=================repo');
        console.log(query);
        return customerService.find({
            query: query
        })
            .then((customers) => {
                var results = customers.data,
                    data = [];

                if (customers.data.length > 0) {
                    results.forEach((value, index) => {
                        let transfer_status = value.old_unit ? (value.transferred_to_sh ? 1 : 0) : (Object.keys(value.product).length > 0 ? value.product.transfer_status : false)
                        var actionBtn = `<button class="btn btn-sm btn-new-view" title="View"><span class="fa fa-eye"></span> View </button> ${transfer_status != 1 ? '<button class="btn btn-sm btn-success add_repo" title="Add to secondhand Unit"><span class="fa fa-plus"></span> Transfer Unit </button>' : ''}`;
                        data.push([
                            value.name ? value.name : '',
                            value.account_number ? value.account_number : 'CASH',
                            value.area ? value.area : '',
                            // value.unitName ? value.unitName : '',
                            // value.product.engine_number ?  value.product.engine_number : '',
                            // value.old_unit ? value.unit_model : (value.unitName ? value.unitName : ''),
                            // value.old_unit ? value.unit_engine_number : (value.product.engine_number ? value.product.engine_number : ''),
                            // moment(value.date_purchased).format('MM/DD/YYYY')  ?  moment(value.date_purchased).format('MM/DD/YYYY')  : '',
                            // moment(value.date_repossessed).format('MM/DD/YYYY')  ?  moment(value.date_repossessed).format('MM/DD/YYYY')  : '',
                            value.remarks2 ? value.remarks2 : '',
                            actionBtn,
                            value
                        ]);
                    });

                    output['data'] = data;
                    output['status'] = true;
                    return Promise.resolve(output);
                } else {
                    // return Promise.resolve(false);
                }

            }).catch((err) => {
                console.log('err ', err)
                // return Promise.resolve(false);
            })
    }
}

export function getCustomersWithShRepossessedUnits(customerName, accountNumber) {
    return (dispatch, getState) => {
        var output = [],
            data = [],
            customerService = feathers.service(SH_CUSTOMERs);


        console.log("getCustomersWithShRepossessedUnits")

        let query = {
            account_status: 2,
            type: {
                $ne: 0
            }
        }

        if (accountNumber) {
            query.account_number = {
                $regex: accountNumber
            }
        }
        if (customerName) {
            query.name = {
                $regex: customerName.toUpperCase()
            }
        }


        return customerService.find({
            query: query
        })
            .then((customers) => {
                var results = customers.data,
                    data = [];

                if (customers.total > 0) {
                    results.forEach((value, index) => {
                        var actionBtn = `<button class="btn btn-sm btn-new-view" title="View"><span class="fa fa-eye"></span> View </button>  ${value.secondhand_unit_info.transfer_status != 1 && value.current_owner == 1 ? '<button class="btn btn-sm btn-success add_repo" title="Add to secondhand Unit"><span class="fa fa-plus"></span> Transfer Unit </button>' : ''}`;
                        // var actionBtn = `<button class="btn btn-sm btn-warning view" title="View"><span class="fa fa-eye"></span> View </button>`;
                        data.push([
                            value.name ? value.name : '',
                            value.account_number ? value.account_number : 'CASH',
                            // value.area ? value.area : '',
                            value.area ? value.area : '',
                            value.unit.name ? value.unit.name : '',
                            value.secondhand_unit_info.engine_number ? value.secondhand_unit_info.engine_number : '',
                            moment(value.date_purchased).format('MM/DD/YYYY') ? moment(value.date_purchased).format('MM/DD/YYYY') : '',
                            moment(value.date_repossessed).format('MM/DD/YYYY') ? moment(value.date_repossessed).format('MM/DD/YYYY') : '',
                            value.repossess_remarks ? value.repossess_remarks : '',
                            actionBtn,
                            value]);
                    });

                    output['data'] = data;
                    return Promise.resolve(output);
                } else {
                    // return Promise.resolve(false);
                }
            }).catch((err) => {
                console.log('ERRRRRRR', err)
                // return Promise.resolve(false);
            })
    }
}

export function getFullyPaidCustomers(customerName, accountNumber) {
    return (dispatch, getState) => {
        var output = [],
            data = [],
            customerService = feathers.service('customers');

        let query = {
            account_status: 1,
            type: {
                $ne: 0
            }
        }

        if (accountNumber) {
            query.account_number = {
                $regex: accountNumber
            }
        }
        if (customerName) {
            query.name = {
                $regex: customerName.toUpperCase()
            }
        }

        return customerService.find({
            query: query
        })
            .then((customers) => {
                var results = customers.data,
                    data = [];
                if (customers.total > 0) {
                    results.forEach((value, index) => {
                        var actionBtn = '<button class="btn btn-sm btn-new-view" title="View"><span class="fa fa-eye"></span> View </button>';
                        data.push([
                            value.name ? value.name : '',
                            value.account_number ? value.account_number : 'CASH',
                            value.area ? value.area : '',
                            value.old_unit ? value.unit_model : (value.unitName ? value.unitName : ''),
                            value.old_unit ? value.unit_engine_number : (value.product.engine_number ? value.product.engine_number : ''),
                            moment(value.date_purchased).format('MM/DD/YYYY') ? moment(value.date_purchased).format('MM/DD/YYYY') : '',
                            moment(value.date_closed).format('MM/DD/YYYY') ? moment(value.date_closed).format('MM/DD/YYYY') : '',
                            value.remarks ? value.remarks : '',
                            actionBtn,
                            value]);
                    });

                    output['data'] = data;
                    return Promise.resolve(output);
                } else {
                    return Promise.resolve(false);
                }

            }).catch((err) => {
                // return Promise.resolve(false);
            })
    }
}

export function getFullyPaidShCustomers(customerName, accountNumber) {
    return (dispatch, getState) => {
        var output = [],
            data = [],
            customerService = feathers.service(SH_CUSTOMERs);


        let query = {
            account_status: 1,
            type: {
                $ne: 0
            }
        }

        if (accountNumber) {
            query.account_number = {
                $regex: accountNumber
            }
        }
        if (customerName) {
            query.name = {
                $regex: customerName.toUpperCase()
            }
        }

        return customerService.find({
            query: query
        })
            .then((customers) => {
                var results = customers.data,
                    data = [];

                if (customers.total > 0) {
                    results.forEach((value, index) => {
                        var actionBtn = '<button class="btn btn-sm btn-warning view" title="View"><span class="fa fa-eye"></span> View </button>';
                        data.push([
                            value.name,
                            value.account_number ? value.account_number : 'CASH',
                            value.area ? value.area : '',
                            value.unit.name ? value.unit.name : '',
                            value.secondhand_unit_info.engine_number ? value.secondhand_unit_info.engine_number : '',
                            moment(value.date_purchased).format('MM/DD/YYYY') ? moment(value.date_purchased).format('MM/DD/YYYY') : '',
                            moment(value.date_closed).format('MM/DD/YYYY') ? moment(value.date_closed).format('MM/DD/YYYY') : '',
                            value.remarks ? value.remarks : '',
                            actionBtn,
                            value]);
                    });

                    output['data'] = data;

                    return Promise.resolve(output);
                } else {
                    // return Promise.resolve(false);
                }

            }).catch((err) => {
                // return Promise.resolve(false);
            })
    }
}


export function setTermsCustomers(customers) {
    return {
        type: CUSTOMERS_TERMS_LIST,
        data: customers
    }
}

export function setCashCustomers(customers) {
    return {
        type: CUSTOMERS_CASH_LIST,
        data: customers
    }
}

export function setCustomerType(type) {
    return {
        type: SET_CUSTOMER_TYPE,
        data: type
    }
}

export function setCustomerInfo(info) {
    return {
        type: SET_CUSTOMER_INFO,
        data: info
    }
}


export const setLedgerItemId = (id) => {
    return {
        type: SET_LEDGER_ITEM_ID,
        payload: {
            data: id
        }
    }
}

export const getCustomerPaymentHistory = (account_number) => {
    return (dispatch, getState) => {
        let SERVICE = feathers.service('customer-payments'),
            data = [],
            output = [];

        let query = {
            query: {
                account_number: account_number,
                current: 0
            }
        }

        return SERVICE.find(query)
            .then((result) => {
                if (result.total > 0) {
                    let collection = result.data;
                    collection.map((v, i) => {
                        data.push([
                            v,
                            moment(v.date_paid).format('MM/DD/YYYY'),
                            v.or_number ? v.or_number : '',
                            v.debit ? numberWithCommas(v.debit) + ".00" : '',
                            v.amount_paid ? numberWithCommas(v.amount_paid) + ".00" : '',
                            v.rebate ? numberWithCommas(v.rebate) + ".00" : '',
                            v.remarks,
                        ])
                    });
                    output['status'] = true;
                    output['data'] = data;
                } else {
                    output['status'] = false;
                    output['messsage'] = 'No data fetched';
                }

                return Promise.resolve(output);
            })
            .catch((error) => {
                console.log('error ', error)
                return Promise.resolve(false);
            })
    }
}

export const getCustomerPayment = (account_number, promisory_note) => {
    return (dispatch, getState) => {
        let SERVICE = feathers.service('customer-payments'),
            data = [],
            output = [];

        let query = {
            query: {
                account_number: account_number,
                current: 1
            }
        }

        return SERVICE.find(query)
            .then((result) => {
                console.log('RESULT DATA', result.data);
                if (result.total) {
                    let d = result.data,
                        multiplier = 0,
                        total_amount_paid = 0,
                        total_rebate = 0;


                    d.map((v, i) => {
                        multiplier += (Number(v.total_paid !== undefined ? (v.current == 1 ? v.total_paid : 0) : 0) - (v.current == 1 ? (v.debit ? Number(v.debit) : 0) : 0));
                        total_rebate += Number(v.rebate);
                        v.total_paid = v.total_paid === undefined ? 0 : v.total_paid;
                        let render;

                        if (v.amount_paid === 0 || v.amount_paid === '0') {
                            render = 0
                        } else {
                            render = Number(v.amount_paid) - (v.rebate ? (Number(v.rebate)) : 0)
                        }
                        const remain = Number(promisory_note) - (multiplier),
                            actionBtn = '<button class="btn btn-sm btn-warning btn-new-edit edit" title="Update"><span class="fa fa-edit" /></button>';
                        data.push([
                            v,
                            moment(v.date_paid).format('MM/DD/YYYY'),
                            v.or_number ? v.or_number : '',
                            v.debit ? numberWithCommas(v.debit) + ".00" : '',
                            v.amount_paid ? numberWithCommas(v.amount_paid) + ".00" : '',
                            v.rebate ? numberWithCommas(v.rebate) + ".00" : '',
                            numberWithCommas(remain) + ".00",
                            v.remarks,
                            v.current == 1 ? actionBtn : ''
                        ]);
                        total_amount_paid += (Number(v.total_paid !== undefined ? Number(v.current == 1 ? v.total_paid : 0) : 0) - (v.current == 1 ? (v.debit ? Number(v.debit) : 0) : 0))
                        console.log(v.total_paid);
                        console.log(v.current);
                        console.log(total_amount_paid);
                    });

                    output['status'] = true;
                    output['data'] = data;
                    output['total_payments'] = total_amount_paid;

                    dispatch(setPaymentData(data))
                    dispatch(getTotalPayments(total_amount_paid))
                } else {
                    output['status'] = false;
                    output['messsage'] = 'No data fetched';
                    output['total_payments'] = 0;

                    dispatch(setPaymentData(0))
                    dispatch(getTotalPayments(0))
                }

                return Promise.resolve(output)
            })
            .catch((error) => {
                console.log('error ', error)
                output['status'] = false;
                output['message'] = error.message;
                dispatch(setPaymentData(0))
                dispatch(getTotalPayments(0))
                return Promise.resolve(output)
            })
    }
}


export const setAllCustomers = (data) => {
    return {
        type: SET_ALL_CUSTOMERS,
        payload: {
            data: data
        }
    }
}

export function updatePayment(id, query) {
    return (dispatch, getState) => {
        var paymentService = feathers.service('customer-payments');

        // return paymentService.patch(id, {or_number:or_number, amount_paid: amount_paid , date_paid, rebate, balance, remarks})
        return paymentService.patch(id, query)
            .then((data) => {
                return Promise.resolve(data)
            })
            .catch((error) => {
                console.log('EDIT PAYMENT ERROR', error)
                return Promise.resolve(false)
            });

    }
}


export function updateBalance(id, balance) {
    return (dispatch, getState) => {
        var paymentService = feathers.service('customer-payments');

        return paymentService.patch(id, {balance: balance})
            .then((data) => {

                console.log('EDIT BALANCE', data)


                return Promise.resolve(data)
            })
            .catch((error) => {
                console.log('EDIT BALANCE ERROR', error)
                return Promise.resolve(false)
            });

    }
}

export function getCustomerPayments(id) {
    return (dispatch, getState) => {
        const paymentService = feathers.service('payments');

        return paymentService.find({
            query: {
                customer_id: id
            }
        }).then((payments) => {
            var results = payments.data,
                data = [];

            results.forEach((value, index) => {
                data.push([value, value.payment_date, value.amount, value.interest, value.rebate, value.balance, value.remarks]);
            });

            return Promise.resolve(data);

        }).catch((err) => {
            console.log('payments error', err)
        })

    }
}

export function setCustomerPayments(payments) {
    return {
        type: SET_CUSTOMER_PAYMENTS,
        data: payments
    }
}

export function addPayment(form) {
    return (dispatch, getState) => {
        const paymentService = feathers.service('payments');

        return paymentService.create(form).then((data) => {
            var d = [];
            d['status'] = 'success';
            d['id'] = data._id
            return Promise.resolve(d);

        }).catch(err => {
            console.log('err', err);
            return Promise.resolve(false);
        });

    }
}

export function mainaddPayment(form) {
    return (dispatch, getState) => {
        const paymentService = feathers.service('payments');

        return paymentService.create(form).then((data) => {
            return Promise.resolve('success');

        }).catch(err => {
            console.log('err', err);
            return Promise.resolve('failed');
        });

    }
}

export function getModelInAddCust(data) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');
        let query;
        if (!data) {
            return Promise.resolve(false);
            return;
        }

        if (data) {
            query = {
                query: {
                    model: data.modelId
                }
            }
        } else {
            query = '';
        }

        return productService.find({
            query: {
                model: data.modelId
            }
        })
            .then((res) => {
                return Promise.resolve(res.data)
            })
    }
}

export function setSelectedBranchInAddCust(data) {
    let branch = [];
    branch.push({
        value: data._id,
        label: data.branch_name,
    });
    return {
        type: BRANCH_IN_ADD_CUST,
        data: branch
    };
};

export function setAsDelinquent(data) {
    return (dispatch, getState) => {
        const badrecordService = feathers.service('bad-records'),
            customerService = feathers.service('customers');

        return badrecordService.find({
            query: {
                user_id: data.user_id,
                status: 1
            }
        })
            .then((badrecords) => {

                if (badrecords.total) {
                    var d = badrecords.data;

                    d.map((value, index) => {
                        badrecordService.patch(value._id, {status: 0})
                            .then(() => {
                            })
                    })

                    badrecordService.create(data)
                        .then((create) => {
                            console.log(create)
                        })
                } else {
                    badrecordService.create(data)
                        .then((create) => {
                            console.log(create)
                        })
                }

                customerService.patch(data.user_id, {bad_record: 1})
                    .then(() => {

                    })
            })
    }
}

export function removeDelinquency(data) {
    return (dispatch, getState) => {
        const badrecordService = feathers.service('bad-records'),
            customerService = feathers.service('customers');

        return badrecordService.find({
            query: {
                user_id: data.user_id
            }
        })
            .then((badrecords) => {

                var d = badrecords.data;

                d.map((value, index) => {
                    badrecordService.patch(value._id, {status: 0})
                        .then(() => {
                        })
                })

                badrecordService.create(data)
                    .then((create) => {
                        console.log(create)
                    })

                customerService.patch(data.user_id, {bad_record: 0})
                    .then(() => {

                    })
            })
    }
}


export function customersWithBadRecord() {
    return (dispatch, getState) => {
        const customerService = feathers.service('customers');

        return customerService.find({
            query: {
                bad_record: 1
            }
        })
            .then((customers) => {
                var results = customers.data,
                    data = [];

                results.forEach((value, index) => {
                    var actionBtn = '<button class="btn border-radius-50 text-white table-btn view-badrecord view">View</button>';
                    data.push([value.name, value._id, actionBtn, value, value.type]);
                });
                return Promise.resolve(data)
            })
            .catch(() => {
                return Promise.resolve(false)
            })
    }
}

export function getSecondhandUnitsUsingModel(model) {
    return (dispatch, getState) => {
        const secondhandService = feathers.service('secondhand');

        return secondhandService.find({
            query: {
                model: {
                    name: model
                },
                type: 0
            }
        })
            .then((secondhand) => {
                var d = secondhand.data,
                    data = [];

                d.map((v) => {
                    data.push({
                        unitId: v._id,
                        value: v.engine_number,
                        label: v.engine_number,
                        unitPrice: v.selling_price,
                        origin_id: v.origin_id,
                    });
                })
                return Promise.resolve(data);
            })
            .catch(() => {
                return Promise.resolve(false);
            })
    }
}

export function addCustomerWithSecondhandUnit(formData) {
    return (dispatch, getState) => {
        const secondhandService = feathers.service('secondhand'),
            customerSecondhandUnit = feathers.service('customer-secondhand-unit');

        return customerSecondhandUnit.create(formData)
            .then((data) => {

                console.log("data after create")
                console.log(data)

                return secondhandService.patch(formData.unit_id, {
                    type: 1,
                    date_sold: moment().format('MM/DD/YYYY'),
                    removal_date: moment().add(7, 'days').format('MM/DD/YYYY'),
                })
                    .then((patch) => {

                        console.log("data after patch")
                        console.log(data)
                        return Promise.resolve(data)
                    })
                    .catch((patchError) => {
                        console.log('patchError ', patchError);
                        return Promise.resolve(false)
                    })
            })
            .catch((error) => {
                console.log(error);
                return Promise.resolve(false);
            })
    }
}

export const checkIfExist = (account_number) => {
    return (dispatch, getState) => {
        // let feathers = getState().feathersClient.app,
        const ledgerSRVC = feathers.service('ledger');
        let output = [];
        let query = {
            query: {
                account_number: account_number
            }
        };

        return ledgerSRVC.find(query)
            .then((result) => {

                if (result.total) {
                    output['status'] = true;
                    output['message'] = `Account Number ${account_number} already exists`;

                    return Promise.resolve(output)
                } else {
                    output['status'] = false;
                    output['message'] = "Does not Exist";

                    return Promise.resolve(output)
                }
            })
            .catch((error) => {
                output['status'] = false;
                output['message'] = error.messsage;

                return Promise.resolve(output)

            })
    }
}

export const setNewCustomerData = (data) => {
    return {
        type: SET_NEW_CUSTOMER_DATA,
        data: data
    }
}


export function updateMainCustomer(id, query) {
    return (dispatch, getState) => {
        var customerService = feathers.service('customers');
        return customerService.patch(id, query)
            .then((data) => {
                return Promise.resolve(data)
            })
            .catch((error) => {
                return Promise.resolve(false)
            });

    }
}

export function updateMainCustomerSH(id, query) {
    return (dispatch, getState) => {
        var customerService = feathers.service('customer-secondhand-unit');
        return customerService.patch(id, query)
            .then((data) => {
                return Promise.resolve(data)
            })
            .catch((error) => {
                return Promise.resolve(false)
            });

    }
}

export const insertToLedgerSecondhand = (data) => {
    return (dispatch, getState) => {
        // let feathers = getState().feathersClient.app,
        // const MainFeathers = getState().feathersClient.mainapp,
        const ledgerSRVC = feathers.service(SH_CUSTOMER_LEDGER),
            MainledgerSRVC = feathers.service(SH_CUSTOMER_LEDGER);

        return ledgerSRVC.create(data)
            .then((result) => {
                // MainledgerSRVC.create(data)
                // .then((main_result) => {
                // 	console.log('main_result ', main_result)
                // })
                return Promise.resolve(result);
            })
            .catch(() => {
                return Promise.resolve(false);
            })

    }
}


export const updateLedgerItem = (id, items, account_number) => {
    return (dispatch, getState) => {
        let SERVICE = feathers.service('ledger'),
            data = [],
            output = [];

        return SERVICE.patch(id, items)
            .then(() => {
                // dispatch(updateRemainingBalance(account_number));

                output['status'] = true;
                return Promise.resolve(output);
            })
            .catch(() => {
                output['status'] = false;
                return Promise.resolve(output)
            })

    }
}

export const updateLedger = (id, status, secondhand = false, first_payment_date) => {
    return (dispatch, getState) => {
        let customersSRVC = feathers.service(secondhand ? SH_CUSTOMERs : 'customers');
        return customersSRVC.patch(id, {
            has_ledger: status,
            first_payment_date: first_payment_date
        })
            .then((data) => {
                return Promise.resolve(true)
            })
            .catch((error) => {
                return Promise.resolve(false)
            })
    }
}


export const insertToLedger = (data, secondhand = false) => {
    return (dispatch, getState) => {
        // let feathers = getState().feathersClient.app,
        //  const  MainFeathers = getState().feathersClient.mainapp,
        const ledgerSRVC = feathers.service(secondhand ? SH_CUSTOMER_LEDGER : 'ledger'),
            MainLedgerSRVC = feathers.service(secondhand ? SH_CUSTOMER_LEDGER : 'ledger');

        return ledgerSRVC.create(data)
            .then((result) => {
                // MainLedgerSRVC.create(data)
                // .then((main_result) => {
                // 	console.log('main_result ', main_result)
                // })

                return Promise.resolve(result);
            })
            .catch(() => {
                return Promise.resolve(false);
            })

    }
};


export const customerLedger = (account_number, initialBal) => {
    return (dispatch, getState) => {
        // let feathers = getState().feathersClient.app,
        const ledgerSRVC = feathers.service('ledger'),
            data = [],
            output = [];

        let query = {
            query: {
                account_number: account_number,
                current: 1
            }
        }

        return ledgerSRVC.find(query)
            .then((result) => {
                if (result.total) {
                    let res = result.data,
                        multiplier = 0,
                        balance = 0;

                    res.map((value, i) => {
                        let actionBtn = '<button class="btn btn-sm btn-warning edit" title="Update"><span class="fa fa-edit" /></button>',
                            amount_paid = value.amount_paid,
                            eachBalance = amount_paid ? (initialBal - amount_paid) : initialBal;

                        multiplier += 1;

                        let balance = (parseFloat(value.monthly_amortization) * multiplier),
                            displayed_balance = Math.round(value.balance - balance),
                            displayed_ma = Math.round(value.monthly_amortization);

                        data.push([
                            value._id,
                            '', '', '', '', '',
                            value.due_date,
                            numberWithCommas(twoDecimalPlaces(displayed_ma)),
                            // twoDecimalPlaces(balance),
                            // amount_paid ? numberWithCommas(amount_paid)+'.00' : '',
                            // value.date_paid ? moment(value.date_paid).format('MM/DD/YYYY') : '',
                            // value.rebate ? numberWithCommas(value.rebate)+'.00' : '',
                            // value.overdue,
                            value.balance ? numberWithCommas(twoDecimalPlaces((displayed_balance))) : '',
                            // value.remarks,
                            // value.elapsed ? '' : actionBtn
                        ])
                    })

                    output['status'] = true;
                    output['data'] = data;

                    dispatch(setLedgerDataTable(data))
                } else {
                    output['status'] = false;
                    output['data'] = [];
                }

                return Promise.resolve(output);
            })
            .catch((err) => {
                console.log('ERROR LEDGER', err)
                output['status'] = false;
                output['data'] = [];
                return Promise.resolve(output)
            })

    }
}
export const setCustomerLedgerInfo = (data) => {
    return {
        type: SET_CUSTOMER_LEDGER_INFO,
        payload: {
            data: data
        }
    }
}

export const setLedgerDataTable = (data) => {
    return {
        type: SET_LEDGER_TABLE_DATA,
        payload: {
            data: data
        }
    }
}

export const getSHCustomerPayment = (account_number, promisory_note) => {
    return (dispatch, getState) => {
        // let feathers = getState().feathersClient.app,
        let SERVICE = feathers.service(SH_CUSTOMER_PAYMENTS),
            data = [],

            output = [];

        let query = {
            query: {
                account_number: account_number,
                current: 1
            }
        }

        return SERVICE.find(query)
            .then((result) => {


                if (result.total) {

                    var d = result.data,
                        multiplier = 0,
                        total_amount_paid = 0,
                        total_rebate = 0;

                    d.map((v, i) => {

                        multiplier += (Number(v.total_paid !== undefined ? (v.current == 1 ? v.total_paid : 0) : 0) - (v.debit ? (v.current == 1 ? Number(v.debit) : 0) : 0));
                        total_rebate += Number(v.rebate)
                        let render;
                        if (v.amount_paid === 0 || v.amount_paid === '0') {
                            render = 0
                        } else {
                            render = Number(v.amount_paid) - (v.rebate ? (Number(v.rebate)) : 0)
                        }
                        var remain = Number(promisory_note) - (multiplier),
                            actionBtn = '<button class="btn btn-sm btn-warning edit" title="Update"><span class="fa fa-edit" /></button>';

                        data.push([
                            v,
                            moment(v.date_paid).format('MM/DD/YYYY'),
                            v.or_number ? v.or_number : '',
                            v.debit ? numberWithCommas(v.debit) + ".00" : '',
                            v.amount_paid ? numberWithCommas(v.amount_paid) + ".00" : '',
                            v.rebate ? numberWithCommas(v.rebate) + ".00" : '',
                            numberWithCommas(remain) + ".00",
                            v.remarks,
                            v.current == 1 ? actionBtn : ''
                        ])
                        total_amount_paid += (Number(v.total_paid !== undefined ? (v.current == 1 ? Number(v.total_paid) : 0) : 0) - (v.debit ? (v.current == 1 ? Number(v.debit) : 0) : 0))
                        console.log('v.total_paid', v.total_paid)
                    })

                    output['status'] = true;
                    output['data'] = data;
                    output['total_payments'] = total_amount_paid;
                } else {
                    output['status'] = false;
                    output['messsage'] = 'No data fetched';
                    output['data'] = [];
                    output['total_payments'] = 0;
                }

                return Promise.resolve(output)
            })
            .catch((error) => {
                console.log('error ', error)
                output['status'] = false;
                output['message'] = error.message;
                output['data'] = [];
                output['total_payments'] = 0;
                return Promise.resolve(output)
            })
    }
}


export const getSHCustomerPaymentHistory = (account_number) => {
    return (dispatch, getState) => {
        // let feathers = getState().feathersClient.app,
        let SERVICE = feathers.service('customer-payments-secondhand'),
            data = [],
            output = [];

        let query = {
            query: {
                account_number: account_number,
                current: 0
            }
        }

        return SERVICE.find(query)
            .then((result) => {
                if (result.total > 0) {
                    let collection = result.data;
                    collection.map((v, i) => {
                        data.push([
                            v,
                            moment(v.date_paid).format('MM/DD/YYYY'),
                            v.or_number ? v.or_number : '',
                            v.debit ? numberWithCommas(v.debit) + ".00" : '',
                            v.amount_paid ? numberWithCommas(v.amount_paid) + ".00" : '',
                            v.rebate ? numberWithCommas(v.rebate) + ".00" : '',
                            v.remarks,
                        ])
                    })

                    output['status'] = true;
                    output['data'] = data;
                } else {
                    output['status'] = false;
                    output['messsage'] = 'No data fetched';
                }

                return Promise.resolve(output);
            })
            .catch((error) => {
                console.log('error ', error)
                return Promise.resolve(false);
            })
    }
}

export const getFirstDate = (account_number) => {
    return (dispatch, getState) => {
        // let feathers = getState().feathersClient.app,
        let ledgerSRVC = feathers.service('ledger'),
            data = [],
            output = [];

        let query = {
            query: {
                $limit: 1,
                account_number: account_number
            }
        }

        return ledgerSRVC.find(query)
            .then((result) => {
                if (result.total) {
                    output['status'] = true;
                    output['data'] = result.data[0].due_date;
                } else {
                    output['status'] = false;
                    output['data'] = [];
                }

                return Promise.resolve(output)
            })
            .catch(() => {
                output['status'] = false;
                output['data'] = [];
                return Promise.resolve(output)
            })

    }
}

export const findModelDetails = (id) => {
    return (dispatch, getState) => {
        let modelsSRVC = feathers.service('motorcycle-models'),
            output = [];
        let query = {
            query: {
                _id: id
            }
        }

        return modelsSRVC.find(query)
            .then((result) => {
                if (result.total) {
                    output['status'] = true;
                    output['data'] = result.data;
                } else {
                    output['status'] = false;
                    output['data'] = [];
                }
                return Promise.resolve(output)
            })
            .catch(() => {
                output['status'] = false;
                output['data'] = [];
                return Promise.resolve(output)
            })

    }
}


export const setPaymentData = (data) => {
    return {
        type: SET_PAYMENTS,
        payload: {
            data: data
        }
    }
}

export const getTotalPayments = (data) => {
    return {
        type: SET_TOTAL_PAYMENTS,
        payload: {
            data: data
        }
    }
}

export function editPayment(data) {
    return {
        type: EDIT_PAYMENT,
        data: data
    }
}

export const clearData = (service) => {
    return (dispatch, getState) => {
        let feathers = getState().feathersClient.app,
            SERVICE = feathers.service(service),
            data = [],
            output = [];

        return SERVICE.find()
            .then((result) => {
                if (result.total) {
                    let d = result.data;

                    d.map((v, i) => {
                        return SERVICE.remove(v._id)
                            .then((result2) => {
                            })
                    })
                }
            })
    }
}

export const addCustomerPayment = (input_data) => {
    return (dispatch, getState) => {
        let SERVICE = feathers.service('customer-payments'),
            data = [],
            output = [];
        console.log('==============');
        console.log('==============');
        console.log(input_data);
        return SERVICE.create(input_data)
            .then((result) => {
                output['status'] = true;
                output['data'] = result;
                return Promise.resolve(output)
            })
            .catch((error) => {
                output['status'] = false;
                output['message'] = error.message;

                return Promise.resolve(output)

            })

    }
}

export const getArea = () => {
    return (dispatch, getState) => {
        let areaSRVC = feathers.service('customer-area'),
            data = [],
            areaList = getState().customers.areaList,
            output = [];

        return areaSRVC.find().then((area) => {
            var results = area.data,
                data = [];

            results.forEach((value, index) => {

                data.push({
                    label: value.area_name.name,
                    value: value._id
                });
            });

            dispatch(saveArea(data));

        }).catch((err) => {
            console.log('ERROR FETCH === > ', err)

        })

    }
}

export const saveArea = (data) => {
    return {
        type: AREA_NAME_LIST,
        data: data,
    }
}


export function getCustomersCash(customerName, accountNumber) {
    return (dispatch, getState) => {
        const output = [],
            data = [],
            customerService = feathers.service('customers');
        let branchName = getState().login.userData.branch_info.branch_name;
        let branchId = getState().login.userData.branch_info._id;

        let query = {
            account_status: {
                $nin: [1, 2]
            },
            type: {
                $ne: 1
            }
        }

        if (accountNumber) {
            query.account_number = {
                $regex: accountNumber
            }
        }
        if (customerName) {
            query.name = {
                $regex: customerName.toUpperCase()
            }
        }
        if (branchName != "MAIN") {
            query.branch = branchId;
        }


        return customerService.find({
            query: query
        })
            .then((customers) => {
                var results = customers.data,
                    data = [];
                results.forEach((value, index) => {
                    var actionBtn = `<button class="btn btn-sm btn-new-view" title="View">
<span class="fa fa-eye"></span></button> <button class="btn btn-sm btn-new-edit" 
title="edit"><span class="fa fa-pencil"></span></button> ${value.account_number ? '' +
                        '<button class="btn btn-sm btn-danger repossess" title="Repossess">' +
                        '<span class="fa fa-archive"></span> Repossess </button>' : ''}`,
                        totalPaid = value.customer_payments,
                        totalDebit = value.customer_payments;


                    let total_payments = 0,
                        total_debit = 0;

                    totalPaid.length > 0 && totalPaid.map((values) => {
                        total_payments += Number(values.total_paid)
                    })

                    totalDebit.length > 0 && totalDebit.map((data) => {
                        total_debit += Number(data.debit ? data.debit : 0);
                    })

                    var remaining_balance = Number(value.promisory_note) - Number(total_payments) + Number(total_debit);


                    // var actionBtn = '<button class="btn border-radius-50 text-white table-btn view">View</button>';
                    data.push([
                        value.name,
                        value.area ? value.area : '',
                        value.old_unit ? value.unit_model : (value.unitName ? value.unitName : ''),
                        value.old_unit ? value.unit_engine_number : (value.product.engine_number ? value.product.engine_number : ''),
                        moment(value.date_purchased).format('MM/DD/YYYY') ? moment(value.date_purchased).format('MM/DD/YYYY') : '',
                        value.payment ? value.payment : '',
                        value.remarks ? value.remarks : '',
                        actionBtn,
                        value]);
                });
                output['data'] = data;
                return Promise.resolve(output);

            }).catch((err) => {
                // return Promise.resolve(false);
            })
    }
}

export function getOverdueCustomer(dateRange) {
    return (dispatch, getState) => {
        var ledgerService = feathers.service('ledger'),
            customerPayments = feathers.service('customer-payments'),
            output = [],
            query_statement = '';


        return ledgerService.find({
            query: {
                current: 1,
                $select: ['due_date', 'account_number']
            }
        })
            .then((data) => {
                if (data.total) {
                    var ledgerItems = data.data;
                    var daterangeInfo = dateRange,
                        ledgerDataArr = [],
                        ledgerDataObj = [],
                        paymentData = [],
                        ret = [];

                    ledgerItems.map((value, index) => {
                        // if(value.date_value == daterangeInfo.date_value){
                        if (daterangeInfo.includes(value.due_date)) {
                            ledgerDataArr.push(value.account_number)
                            ledgerDataObj.push({account_number: value.account_number})
                        }
                    })

                    ret['obj'] = ledgerDataObj;
                    ret['arr'] = ledgerDataArr;
                    console.log(ret);
                    return Promise.resolve(ret)

                } else {
                    // return Promise.resolve(false)
                }
            })
            .catch((err) => {
                console.log('err ', err)
                // return Promise.resolve(false)
            })

    }
}

export function getOverdueSHCustomer(dateRange) {
    return (dispatch, getState) => {
        const ledgerService = feathers.service(SH_CUSTOMER_LEDGER),
            customerPayments = feathers.service(SH_CUSTOMER_PAYMENTS),
            output = [],
            query_statement = '';


        return ledgerService.find({
            query: {
                current: 1
            }
        })
            .then((data) => {
                if (data.total) {
                    var ledgerItems = data.data;
                    var daterangeInfo = dateRange,
                        ledgerDataArr = [],
                        ledgerDataObj = [],
                        paymentData = [],
                        ret = [];


                    ledgerItems.map((value, index) => {
                        // if(value.date_value == daterangeInfo.date_value){
                        if (daterangeInfo.includes(value.due_date)) {
                            ledgerDataArr.push(value.account_number)
                            ledgerDataObj.push({account_number: value.account_number})
                        }
                    })

                    ret['obj'] = ledgerDataObj;
                    ret['arr'] = ledgerDataArr;

                    return Promise.resolve(ret)

                } else {
                    // return Promise.resolve(false)
                }
            })
            .catch((err) => {
                console.log('err ', err)
                // return Promise.resolve(false)
            })

    }
}


export function getCustomersWithRepossessedUnitsSH(customerName, accountNumber) {
    return (dispatch, getState) => {
        const output = [],
            data = [],
            customerService = feathers.service('customer-secondhand-unit');


        let query = {
            account_status: 2,
            type: {
                $ne: 0
            }
        }

        if (accountNumber) {
            query.account_number = {
                $regex: accountNumber
            }
        }
        if (customerName) {
            query.name = {
                $regex: customerName.toUpperCase()
            }
        }

        return customerService.find({
            query: query

        }).then((customers) => {
            if (customers.total) {
                var results = customers.data,
                    data = [];
                results.forEach((value, index) => {
                    var actionBtn = '<button class="btn border-radius-50 text-white table-btn' +
                        ' view-inventory btn-new-view view">View</button>';
                    data.push([value.name, value.account_number ? value.account_number : 'CASH', value.branch_info.branch_name, actionBtn, value]);
                });

                output['data'] = data;
                return Promise.resolve(output);

            } else {
                return Promise.resolve(false);
            }

        }).catch((err) => {
            console.log('err ', err)
            return Promise.resolve(false);
        })
    }
}

export function getTermsCustomersSeconHand(customerName, accountNumber) {
    return (dispatch, getState) => {
        var output = [],
            data = [],

            customerService = feathers.service('customer-secondhand-unit');

        let query = {
            payment_method: {
                $ne: 0
            },
            account_status: {
                $nin: [1, 2]
            }
        }

        if (accountNumber) {
            query.account_number = {
                $regex: accountNumber
            }
        }
        if (customerName) {
            query.name = {
                $regex: customerName.toUpperCase()
            }
        }

        return customerService.find({
            query: query
        }).then((customers) => {

            if (customers.total) {
                var results = customers.data,
                    data = [];

                results.forEach((value, index) => {
                    var actionBtn = '' +
                        '<button class="btn btn-sm btn-warning btn-new-view view"' +
                        ' title="View"><span class="fa fa-eye" /></button>' +
                        '<button class="btn btn-sm btn-new-edit" title="edit">' +
                        '<span class="fa fa-pencil"></span></button>',
                        myBranch = value.branch_info ? value.branch_info.branch_name : '';

                    data.push([value.name, value.account_number, myBranch, actionBtn, value]);
                });

                output['data'] = data;
                return Promise.resolve(output);

            } else {
                return Promise.resolve(false);
            }

        }).catch((err) => {

            console.log('WOWOWWWWEEEE', err);
            return Promise.resolve(false);
        })
    }
}


export const updateExpiry = (id) => {
    return (dispatch, getState) => {
        let customersSRVC = feathers.service('customers');

        return customersSRVC.patch(id, {
            expiry_status: true
        })
            .then((data) => {
                return Promise.resolve(true)
            })
            .catch((error) => {
                return Promise.resolve(false)
            })
    }
}


export const updateExpiryLedger = (customer_id) => {
    return (dispatch, getState) => {
        let customersSRVC = feathers.service('customers');

        return customersSRVC.patch(customer_id, {
            expiry_status: false
        })
            .then((data) => {
                return Promise.resolve(true)
            })
            .catch((error) => {
                return Promise.resolve(false)
            })
    }
}


export const updateExpirySHLedger = (customer_id) => {
    return (dispatch, getState) => {
        let customersSRVC = feathers.service(SH_CUSTOMERs);

        return customersSRVC.patch(customer_id, {
            expiry_status: false
        })
            .then((data) => {
                return Promise.resolve(true)
            })
            .catch((error) => {
                return Promise.resolve(false)
            })
    }
}


export const updateSHExpiry = (id) => {
    return (dispatch, getState) => {
        let customersSRVC = feathers.service('customer-secondhand-unit');

        return customersSRVC.patch(id, {
            expiry_status: true
        })
            .then((data) => {
                console.log('expiry status', data)
                return Promise.resolve(true)
            })
            .catch((error) => {
                return Promise.resolve(false)
            })
    }
}

export const updateSHExpiryLedger = (customer_id) => {
    return (dispatch, getState) => {
        let customersSRVC = feathers.service('customers');

        return customersSRVC.patch(customer_id, {
            expiry_status: false
        })
            .then((data) => {
                return Promise.resolve(true)
            })
            .catch((error) => {
                return Promise.resolve(false)
            })
    }
}

export const checkIfExistCustomerSH = (formData) => {
    return (dispatch, getState) => {
        let ledgerSRVC = feathers.service('customer-secondhand-unit');
        let account_number = formData.account_number,
            output = [];

        let query = {
            query: {
                account_number: account_number
            }
        }

        return ledgerSRVC.find(query)
            .then((result) => {

                console.log('formData ', formData)

                if (formData.payment_method == 0) {
                    output['status'] = false;
                    output['message'] = "CASH type";

                    return Promise.resolve(output)
                }

                if (result.total) {
                    output['status'] = true;
                    output['message'] = `Account Number ${account_number} already exists`;

                    return Promise.resolve(output)
                } else {
                    output['status'] = false;
                    output['message'] = "Does not Exist";

                    return Promise.resolve(output)
                }
            })
            .catch((error) => {
                output['status'] = false;
                output['message'] = error.messsage;

                return Promise.resolve(output)

            })
    }
}

export const updateLedgerSecondhand = (id, status) => {
    return (dispatch, getState) => {
        let customersSRVC = feathers.service('customer-secondhand-unit');

        return customersSRVC.patch(id, {
            has_ledger: status
        })
            .then((data) => {
                return Promise.resolve(true)
            })
            .catch((error) => {
                return Promise.resolve(false)
            })
    }
}

export const addSHCustomerPayment = (input_data) => {
    return (dispatch, getState) => {
        let SERVICE = feathers.service('customer-payments-secondhand'),
            data = [],
            output = [];

        return SERVICE.create(input_data)
            .then((result) => {
                output['status'] = true;
                output['data'] = result;

                return Promise.resolve(output)
            })
            .catch((error) => {
                output['status'] = false;
                output['message'] = error.message;

                return Promise.resolve(output)

            })

    }
}

export function updatePaymentSH(id, query) {
    return (dispatch, getState) => {
        var paymentService = feathers.service('customer-payments-secondhand');
        return paymentService.patch(id, query)
            .then((data) => {
                return Promise.resolve(true)
            })
            .catch((error) => {
                return Promise.resolve(false)
            });

    }
}

export function getTermsCustomersSecondHand(customerName, accountNumber) {
    return (dispatch, getState) => {
        var output = [],
            data = [],
            customerService = feathers.service('customer-secondhand-unit');

        let branchname = getState().login.userData.branch_info.branch_name;
        let branchid = getState().login.userData.branch_info._id;
        console.log('================');
        console.log(branchname);
        console.log(branchid);

        let query = {
            payment_method: {
                $ne: 0
            },
            account_status: {
                $nin: [1, 2]
            }
        }

        if (branchname !== "MAIN") {
            query.branch = branchid;
        }

        if (accountNumber) {
            query.account_number = {
                $regex: accountNumber
            }
        }
        if (customerName) {
            query.name = {
                $regex: customerName.toUpperCase()
            }
        }

        return customerService.find({
            query: query
        }).then((customers) => {

            if (customers.total) {

                var results = customers.data,
                    data = [];

                results.forEach((value, index) => {
                    console.log(value);
                    var actionBtn = '' +
                        '<button class="btn btn-sm btn-new-view" title="View">' +
                        '<span class="fa fa-eye" /></button>' +
                        '<button class="btn btn-sm btn-new-edit" title="Edit">' +
                        '<span class="fa fa-pencil" /></button>',
                        myBranch = value.branch_info ? value.branch_info.branch_name : '';

                    data.push([value.name, value.account_number, myBranch, actionBtn, value]);
                });

                output['data'] = data;
                return Promise.resolve(output);

            } else {
                return Promise.resolve(false);
            }

        }).catch((err) => {

            console.log('WOWOWWWWEEEE', err);
            return Promise.resolve(false);
        })
    }
}

export function getTermsCustomersSecondHandCash(customerName, accountNumber) {
    return (dispatch, getState) => {
        var output = [], data = [], customerService = feathers.service('customer-secondhand-unit');

        let query = {
            payment_method: 0
        }

        if (accountNumber) {
            query.account_number = {
                $regex: accountNumber
            }
        }
        if (customerName) {
            query.name = {
                $regex: customerName.toUpperCase()
            }
        }

        return customerService.find({
            query: query
        }).then((customers) => {
            if (customers.total) {
                var results = customers.data,
                    data = [];
                results.forEach((value, index) => {
                    var actionBtn = '<button class="btn btn-sm btn-new-view" title="View">' +
                        '<span class="fa fa-eye" /></button>' +
                        '<button class="btn btn-sm btn-new-edit" title="Edit">' +
                        '<span class="fa fa-pencil" /></button>',
                        myBranch = value.branch_info ? value.branch_info.branch_name : '';

                    data.push([value.name, value.account_number ? value.account_number : 'CASH', myBranch, actionBtn, value]);
                });
                output['data'] = data;
                return Promise.resolve(output);
            } else {
                return Promise.resolve(false);
            }
        }).catch((err) => {
            return Promise.resolve(false);
        })
    }
}

export function getFullyPaidCustomersSH(customerName, accountNumber) {
    return (dispatch, getState) => {
        var output = [],
            data = [],
            customerService = feathers.service('customer-secondhand-unit');

        let query = {
            account_status: 1,
            type: {
                $ne: 0
            }
        }

        if (accountNumber) {
            query.account_number = {
                $regex: accountNumber
            }
        }
        if (customerName) {
            query.name = {
                $regex: customerName.toUpperCase()
            }
        }

        return customerService.find({
            query: query
        }).then((customers) => {
            if (customers.total) {
                var results = customers.data,
                    data = [];
                results.forEach((value, index) => {
                    // var actionBtn = '<button class="btn border-radius-50 text-white table-btn view-inventory view">View</button>';
                    var actionBtn = '<button class="btn btn-sm btn-warning view" title="View"><span class="fa fa-eye" /></button>',
                        branch = value.branch ? value.branch_info.branch_name : '';
                    data.push([value.name, value.account_number ? value.account_number : 'CASH', branch, actionBtn, value]);
                });

                output['data'] = data;
                return Promise.resolve(output);
            } else {
                return Promise.resolve(false);
            }

        }).catch((err) => {
            console.log('err ', err)
            return Promise.resolve(false);
        })
    }
}

export const getShLedger = (account_number, promisory_note) => {
    return (dispatch, getState) => {
        var data = [], output = {};

        return feathers.service("ledger-secondhand")
            .find({
                query: {
                    current: 1,
                    account_number: account_number
                }
            })
            .then((result) => {
                console.log('result')
                console.log(result)
                if (result.data.length > 0) {
                    var collection = result.data,
                        multiplier = 0,
                        balance = 0;

                    collection.map((v, i) => {

                        multiplier += 1;

                        let balance = (parseFloat(v.monthly_amortization) * multiplier),
                            displayed_balance = Math.round(v.balance - balance),
                            displayed_ma = Math.round(v.monthly_amortization);

                        data.push([
                            v,
                            '',
                            '',
                            '',
                            '',
                            '',
                            v.due_date,
                            numberWithCommas(Math.round(v.monthly_amortization)),
                            numberWithCommas(displayed_balance),
                        ])
                    })

                    output.status = true;
                    output.data = data;

                } else {
                    output.status = false;
                }

                return Promise.resolve(output)
            })
            .catch((error) => {
                console.log('error')
                console.log(error)

                output.status = false;

                return Promise.resolve(output)
            })
    }
}

export const editCheckIfExistCustomerSH = (type, account_number) => {
    return (dispatch, getState) => {
        let ledgerSRVC = feathers.service('customer-secondhand-unit');
        let output = [];

        let query = {
            query: {
                account_number: account_number
            }
        }

        if (account_number) {
            return ledgerSRVC.find(query)
                .then((result) => {

                    if (type == 0) {
                        output['status'] = false;
                        output['message'] = "Cash method";

                        return Promise.resolve(output)
                    }

                    if (result.total) {
                        output['status'] = true;
                        output['message'] = `Account Number ${account_number} already exists`;

                        return Promise.resolve(output)
                    } else {
                        output['status'] = false;
                        output['message'] = "Does not Exist";

                        return Promise.resolve(output)
                    }
                })
                .catch((error) => {
                    output['status'] = false;
                    output['message'] = error.messsage;

                    return Promise.resolve(output)

                })
        } else {
            output['status'] = false;
            output['message'] = "Does not Exist";

            return Promise.resolve(output)
        }


    }
}

export const editCheckIfExistCustomer = (type, account_number) => {
    return (dispatch, getState) => {
        let ledgerSRVC = feathers.service('customers');
        let output = [];

        let query = {
            query: {
                account_number: account_number
            }
        }

        if (account_number) {
            return ledgerSRVC.find(query)
                .then((result) => {

                    if (type === 0) {
                        output['status'] = false;
                        output['message'] = "Cash method";

                        return Promise.resolve(output)
                    }

                    if (result.total) {
                        output['status'] = true;
                        output['message'] = `Account Number ${account_number} already exists`;

                        return Promise.resolve(output)
                    } else {
                        output['status'] = false;
                        output['message'] = "Does not Exist";

                        return Promise.resolve(output)
                    }
                })
                .catch((error) => {
                    output['status'] = false;
                    output['message'] = error.messsage;

                    return Promise.resolve(output)

                })
        } else {
            output['status'] = false;
            output['message'] = "Does not Exist";

            return Promise.resolve(output)
        }
    }
}


export const editCheckIfExistCustomerSecondhand = (type, account_number) => {
    return (dispatch, getState) => {
        let ledgerSRVC = feathers.service('customer-secondhand-unit'),
            output = [];

        let query = {
            query: {
                account_number: account_number
            }
        };

        if (account_number) {
            return ledgerSRVC.find(query)
                .then((result) => {
                    if (type === 0) {
                        output['status'] = false;
                        output['message'] = "Cash method";
                        return Promise.resolve(output)
                    }

                    if (result.total) {
                        output['status'] = true;
                        output['message'] = `Account Number ${account_number} already exists`;
                        return Promise.resolve(output)
                    } else {
                        output['status'] = false;
                        output['message'] = "Does not Exist";
                        return Promise.resolve(output)
                    }
                })
                .catch((error) => {
                    output['status'] = false;
                    output['message'] = error.messsage;
                    return Promise.resolve(output)

                })
        } else {
            output['status'] = false;
            output['message'] = "Does not Exist";
            return Promise.resolve(output)
        }
    }
}




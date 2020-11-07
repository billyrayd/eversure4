import {
    REPORTS_SELECTED_BRANCH,
    VIEW_REPORT_DATA,
    FINANCIAL_INFO,
    DELETE_REPORT_UNSOLD,
} from '../constants/reports';

import moment from 'moment';
import {
    numberWithCommas,
    twoDecimalPlaces,
} from '../helpers/';

import feathers from '../helpers/feathers';


export function reportsSelectedBranch(data) {
    return {
        type: REPORTS_SELECTED_BRANCH,
        data: data
    }
}

export function inventoryReportsGetAllBrands(query = '') {
    return (dispatch, getState) => {
        const productService = feathers.service('products');

        return productService.find(query).then((products) => {

            const results = products.data,
                filtered = {},
                cleanData = [];

            results.map(function (obj) {
                let model = obj.model,
                    modelName = obj.brands ? obj.brands.brand_name : '',
                    // modelName = obj.motorModels ? obj.motorModels.model_name : '',
                    branchName = obj.branches;

                if (Object.keys(filtered).indexOf(modelName) === -1) {
                    filtered[modelName] = {
                        count: 1
                    };
                } else {
                    filtered[modelName] = {
                        count: filtered[modelName].count + 1
                    };
                }

                filtered[modelName]['branchName'] = branchName;
                filtered[modelName]['modelName'] = modelName;
                filtered[modelName]['model'] = model;
                filtered[modelName]['modelObj'] = {value: model, label: modelName};
            });

            for (const index in filtered) {
                cleanData.push(
                    [
                        filtered[index].modelName,
                        filtered[index].count
                    ]
                );
            }

            return Promise.resolve(cleanData);

        }).catch((err) => {
            return Promise.resolve(err);
        })
    }
}

export function salesReportsGetAllBrands(query = '') {
    return (dispatch, getState) => {
        const productService = feathers.service('products');

        return productService.find(query).then((products) => {

            const results = products.data,
                filtered = {},
                cleanData = [];
            let p = 0;

            results.map(function (obj) {
                let model = obj.model,
                    modelName = obj.brands ? obj.brands.brand_name : '',
                    // modelName = obj.motorModels ? obj.motorModels.model_name : '',
                    branchName = obj.branches,
                    price = obj.price;

                if (Object.keys(filtered).indexOf(modelName) === -1) {
                    filtered[modelName] = {
                        count: price
                    };
                } else {
                    p = +price;
                    console.log('pricee2 ', filtered[modelName])

                    filtered[modelName] = {
                        count: filtered[modelName].count + price
                    };
                }

                filtered[modelName]['branchName'] = branchName;
                filtered[modelName]['modelName'] = modelName;
                filtered[modelName]['model'] = model;
                filtered[modelName]['modelObj'] = {value: model, label: modelName};

            });

            for (const index in filtered) {
                cleanData.push(
                    [
                        filtered[index].modelName,
                        numberWithCommas(filtered[index].count ? filtered[index].count : 0)
                    ]
                );
            }

            return Promise.resolve(cleanData);

        }).catch((err) => {
            return Promise.resolve(err);
        })
    }
}

export function getAccountingReports(type) {
    return (dispatch, getState) => {
        const reportService = feathers.service('reports');
        return reportService.find({query: {report_type: type}})
            .then((data) => {
                const reports = data.data, res = [];
                reports.map((value, index) => {
                    const button = '<button class="btn btn-new-view" title="View">' +
                        '<span class="fa fa-eye"></button> <button class="btn btn-danger btn-sm delete_report" title="Delete"><span class="fa fa-trash"></button>',
                        formattedDate = moment(value.createdAt).format('MM/DD/YYYY');
                    res.push([formattedDate, value.report_title, value.user_fullname, button, value]);
                });
                return Promise.resolve(res)
            }).catch((err) => {
                return Promise.resolve(err);
            })
    }
}

export function deleteUnsoldReport(data) {
    return {
        type: DELETE_REPORT_UNSOLD,
        data: data
    }
}


export function getAccountsPayable(query) {
    return (dispatch, getState) => {
        const customerPayments = feathers.service('products'),
            output = [];
        let query_statement;


        if (query) {
            query_statement = {
                query: query
            }
        }

        return customerPayments.find(query_statement)
            .then((data) => {
                const customerData = data.data,
                    res = [],
                    total = 0;

                customerData.map((value, index) => {
                    const dealer_name = value.brands ? value.brands.brand_name : '',
                        invoice_number = value.invoice ? value.invoice.invoice_number : '',
                        invoice_date = value.invoice.date !== null ? moment(value.invoice.date).format('MM/DD/YYYY') : '',
                        dr_number = value.receipt_number ? value.receipt_number : '',
                        dr_date = moment(value.delivery).format('MM/DD/YYYY') ? moment(value.delivery.date).format('MM/DD/YYYY') : '',
                        model = value.motorModels ? value.motorModels.model_name : '',
                        price = numberWithCommas(value.price ? value.price : 0) + '.00';

                    res.push([value, dealer_name, invoice_number, invoice_date, dr_number, dr_date, model, '1', price]);
                });

                output['data'] = res;
                output['total'] = total;

                return Promise.resolve(output)
            }).catch((e) => {
                return Promise.resolve(false)
            });
    }
}


export function saveReport(data) {
    return (dispatch, getState) => {
        const reportService = feathers.service('reports');

        return reportService.create(data)
            .then((data) => {
                return Promise.resolve(true)
            }).catch((err) => {
                console.log(err)
                return Promise.resolve(false)
            });
    }
}

export function getInventoryReports() {
    return (dispatch, getState) => {
        const reportService = feathers.service('reports');

        return reportService.find({
            query: {
                report_type: 'Inventory'
            }
        }).then((data) => {
            const reports = data.data,
                res = [];

            reports.map((value, index) => {
                const button = '<button class="btn table-btn border-radius-50 text-white view-report">View</button>',
                    formattedDate = moment(value.createdAt).format('MM/DD/YYYY');

                res.push([formattedDate, value.report_title, value.user_fullname, button, value]);
            });
            return Promise.resolve(res)
        }).catch((err) => {
            console.log('err ', err)
        });
    }
}

export function getSalesReports() {
    return (dispatch, getState) => {
        const reportService = feathers.service('reports');

        return reportService.find({
            query: {
                report_type: 'Sales'
            }
        }).then((data) => {
            const reports = data.data,
                res = [];

            reports.map((value, index) => {
                const button = '<button class="btn table-btn border-radius-50 text-white view-report">View</button>',
                    formattedDate = moment(value.createdAt).format('MM/DD/YYYY');

                res.push([formattedDate, value.report_title, value.user_fullname, button, value]);
            });

            return Promise.resolve(res)
        }).catch((err) => {
            console.log('err ', err)
        });
    }
}

export function viewReportData(data) {
    return {
        type: VIEW_REPORT_DATA,
        data: data
    }
}

export function inventoryReportsByModel(model, daterange = false) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');
        let query = {};

        if (daterange) {
            query = {
                query: {
                    model: model,
                    date_added_custom: {
                        $in: daterange
                    }
                }
            }
        } else {
            query = {
                query: {
                    model: model
                }
            }
        }

        return productService.find(query)
            .then((products) => {
                const results = products.data,
                    filtered = {},
                    cleanData = [],
                    p = 0;
                results.map(function (obj) {
                    let model = obj.model,
                        modelName = obj.brands ? obj.brands.brand_name : '',
                        // modelName = obj.motorModels ? obj.motorModels.model_name : '',
                        branchName = obj.branches,
                        price = obj.price;

                    if (Object.keys(filtered).indexOf(modelName) === -1) {
                        filtered[modelName] = {
                            count: 1
                        };
                    } else {
                        filtered[modelName] = {
                            count: filtered[modelName].count + 1
                        };
                    }

                    filtered[modelName]['branchName'] = branchName;
                    filtered[modelName]['modelName'] = modelName;
                    filtered[modelName]['model'] = model;
                    filtered[modelName]['modelObj'] = {value: model, label: modelName};
                });
                for (const index in filtered) {
                    cleanData.push(
                        [
                            filtered[index].modelName,
                            filtered[index].count
                        ]
                    );
                }
                return Promise.resolve(cleanData);
            }).catch((err) => {
                return Promise.resolve(err);
            });
    }
}

export function inventoryReportsByBrand(brand, daterange = false) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');
        let query = {};

        if (daterange) {
            query = {
                query: {
                    brand: brand,
                    date_added_custom: {
                        $in: daterange
                    }
                }
            }
        } else {
            query = {
                query: {
                    brand: brand
                }
            }
        }

        return productService.find(query)
            .then((products) => {
                const results = products.data,
                    filtered = {},
                    cleanData = [],
                    p = 0;
                results.map(function (obj) {
                    let model = obj.model,
                        // modelName = obj.brands ? obj.brands.brand_name : '',
                        modelName = obj.motorModels ? obj.motorModels.model_name : '',
                        branchName = obj.branches,
                        price = obj.price;

                    if (Object.keys(filtered).indexOf(modelName) === -1) {
                        filtered[modelName] = {
                            count: 1
                        };
                    } else {
                        filtered[modelName] = {
                            count: filtered[modelName].count + 1
                        };
                    }

                    filtered[modelName]['branchName'] = branchName;
                    filtered[modelName]['modelName'] = modelName;
                    filtered[modelName]['model'] = model;
                    filtered[modelName]['modelObj'] = {value: model, label: modelName};
                });
                for (const index in filtered) {
                    cleanData.push(
                        [
                            filtered[index].modelName,
                            filtered[index].count
                        ]
                    );
                }
                return Promise.resolve(cleanData);
            }).catch((err) => {
                return Promise.resolve(err);
            });
    }
}


export function salesReportsByBrand(brand, daterange = false) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');
        let query = {};

        if (daterange) {
            query = {
                query: {
                    brand: brand,
                    date_added_custom: {
                        $in: daterange
                    }
                }
            }
        } else {
            query = {
                query: {
                    brand: brand
                }
            }
        }

        return productService.find(query)
            .then((products) => {
                const results = products.data,
                    filtered = {},
                    cleanData = [],
                    p = 0;
                results.map(function (obj) {
                    let model = obj.model,
                        // modelName = obj.brands ? obj.brands.brand_name : '',
                        modelName = obj.motorModels ? obj.motorModels.model_name : '',
                        branchName = obj.branches,
                        price = obj.price;

                    if (Object.keys(filtered).indexOf(modelName) === -1) {
                        filtered[modelName] = {
                            count: price
                        };
                    } else {
                        filtered[modelName] = {
                            count: filtered[modelName].count + price
                        };
                    }

                    filtered[modelName]['branchName'] = branchName;
                    filtered[modelName]['modelName'] = modelName;
                    filtered[modelName]['model'] = model;
                    filtered[modelName]['modelObj'] = {value: model, label: modelName};
                });
                for (const index in filtered) {
                    cleanData.push(
                        [
                            filtered[index].modelName,
                            numberWithCommas(filtered[index].count ? filtered[index].count : 0)
                        ]
                    );
                }
                return Promise.resolve(cleanData);
            }).catch((err) => {
                return Promise.resolve(err);
            });
    }
}


export function selectedBrandsOpt(data) {
    return (dispatch, getState) => {
        const reportService = feathers.service('reports');

        return feathers.service('brands').find()
            .then((data) => {
                const brandlist = data.data
                const newdata = [];

                brandlist.forEach(function (x, i) {
                    newdata.push({
                        brandname: x.brand_name
                    })
                });

                if (newdata.length) {
                    let html = '<option value="all">ALL</option>';
                    for (const x in newdata) {
                        html += '<option value="' + newdata[x].brandname + '">' + newdata[x].brandname + '</option>';
                    }
                }

                return Promise.resolve(newdata)
            }).catch((err) => {
                console.log('err ', err)
            });
    }
}

export function getUnsoldUnits(query) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');

        return productService.find({
            query: query
        }).then((data) => {
            const products = data.data,
                res = [];

            if (products.length > 0) {
                products.map((value, index) => {
                    const model = value.motorModels == null ? value.unit_model_name : value.motorModels.model_name,
                        engine_number = value.engine_number,
                        branch = value.branches ? value.branches.branch_name : '',
                        date_received = value.dateReceived === null ? value.createdAt : value.dateReceived,
                        formattedDate = moment(date_received).format('MM/DD/YYYY');

                    res.push([value, model, engine_number, branch, formattedDate]);
                })
                return Promise.resolve(res)
            } else {
                return Promise.resolve(false)
            }
        }).catch((error) => {
            console.log('error ', error)
            return Promise.resolve(false)
        });
    }
}

export function getNoClearanceUnits(query) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');
        return productService.find({
            query: query
        }).then((data) => {
            const products = data.data,
                res = [];
            products.map((value, index) => {
                const model = value.motorModels == null ? value.unit_model_name : value.motorModels.model_name,
                    engine_number = value.engine_number,
                    branch = value.branches.branch_name,
                    invoice = value.invoice.invoice_number ? value.invoice.invoice_number : '',
                    delivery_receipt = value.delivery.receipt_number,
                    date_received = value.dateReceived === null ? value.createdAt : value.dateReceived,
                    formattedDate = moment(date_received).format('MM/DD/YYYY');

                res.push([value, model, engine_number, branch, formattedDate, invoice, delivery_receipt]);
            });
            return Promise.resolve(res)
        }).catch(() => {
            return Promise.resolve(false)
        });
    }
}

export function getNoTbaUnits(query) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');

        return productService.find({
            query: query
        }).then((data) => {
            const products = data.data,
                res = [];

            products.map((value, index) => {
                const model = value.motorModels == null ? value.unit_model_name : value.motorModels.model_name,
                    engine_number = value.engine_number,
                    branch = value.branches.branch_name,
                    invoice = value.invoice.invoice_number ? value.invoice.invoice_number : '',
                    delivery_receipt = value.delivery.receipt_number,
                    date_received = value.dateReceived === null ? value.createdAt : value.dateReceived,
                    formattedDate = moment(date_received).format('MM/DD/YYYY');

                res.push([value, model, engine_number, branch, formattedDate, invoice, delivery_receipt]);
            });
            return Promise.resolve(res)
        }).catch(() => {
            return Promise.resolve(false)
        });
    }
}

export function getUnitsWithWarranty(query) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');

        return productService.find({
            query: query
        }).then((data) => {
            const products = data.data,
                res = [];

            products.map((value, index) => {
                const model = value.motorModels == null ? value.unit_model_name : value.motorModels.model_name,
                    engine_number = value.engine_number,
                    branch = value.branches.branch_name,
                    invoice = value.invoice.invoice_number ? value.invoice.invoice_number : '',
                    delivery_receipt = value.delivery.receipt_number,
                    date_received = value.createdAt,
                    formattedDate = moment(date_received).format('MM/DD/YYYY');

                res.push([value, model, engine_number, branch, formattedDate, invoice, delivery_receipt]);
            });
            return Promise.resolve(res)
        }).catch(() => {
            return Promise.resolve(false)
        });
    }
}

export function filterReport2(query) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');

        return productService.find({
            query: query
        }).then((data) => {
            const products = data.data,
                res = [];
            products.map((value, index) => {
                const model = value.motorModels === null ? (value.unit_model_name ? value.unit_model_name : '--') : (value.motorModels.model_name),
                    branch = value.branches === null ? '-' : (value.branches ? value.branches.branch_name : '--'),
                    engine_number = value.engine_number,
                    invoice = value.invoice.invoice_number ? value.invoice.invoice_number : '',
                    delivery_receipt = value.delivery.receipt_number,
                    date_received = value.dateReceived === null ? value.createdAt : value.dateReceived,
                    formattedDate = moment(date_received).format('MM/DD/YYYY');

                res.push([value, model, engine_number, branch, formattedDate, invoice, delivery_receipt]);
            });
            return Promise.resolve(res)
        }).catch((err) => {
            console.log('ERROR', err)
            return Promise.resolve(false)
        });
    }
}

export function getSoldUnits(query) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');

        return productService.find({
            query: query
        }).then((data) => {
            const products = data.data,
                res = [];

            products.map((value, index) => {
                const model = value.motorModels == null ? value.unit_model_name : value.motorModels.model_name,
                    engine_number = value.engine_number,
                    branch = value.branches.branch_name,
                    date_received = value.dateReceived === null ? value.createdAt : value.dateReceived,
                    formattedDate = moment(date_received).format('MM/DD/YYYY'),
                    date_sold = moment(value.date_sold).format('MM/DD/YYYY'),
                    customer_name = value.customer_info.name,
                    account_number = value.customer_info.account_number,
                    term = value.customer_info.term,
                    payment = value.customer_info.payment;

                res.push([value, date_sold, customer_name, account_number, model, engine_number, branch, term, numberWithCommas(payment)]);
            });
            return Promise.resolve(res)
        }).catch(() => {
            return Promise.resolve(false)
        });
    }
}

export function filterReport(query) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');

        return productService.find({
            query: query
        }).then((data) => {
            const products = data.data,
                res = [];

            if (products.length > 0) {

                products.map((value, index) => {
                    const model = value.motorModels === null ? (value.unit_model_name ? value.unit_model_name : '--') : (value.motorModels.model_name),
                        engine_number = value.engine_number,
                        branch = value.branches === null ? '--' : (value.branches ? value.branches.branch_name : '--'),
                        date_received = value.dateReceived === null ? value.createdAt : value.dateReceived,
                        formattedDate = moment(date_received).format('MM/DD/YYYY');

                    res.push([value, model, engine_number, branch, formattedDate]);
                });
                return Promise.resolve(res)
            } else {
                return Promise.resolve(false)
            }
        }).catch((err) => {
            console.log('error-log', err)
            return Promise.resolve(false)
        });
    }
}

export function filterReportSold(query) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');

        return productService.find({
            query: query
        }).then((data) => {
            const products = data.data,
                res = [];

            products.map((value, index) => {
                const model = value.motorModels === null ? (value.unit_model_name ? value.unit_model_name : '--') : (value.motorModels.model_name),
                    engine_number = value.engine_number,
                    branch = value.branches === null ? '-' : (value.branches ? value.branches.branch_name : '--'),
                    date_received = value.dateReceived === null ? value.createdAt : value.dateReceived,
                    formattedDate = moment(date_received).format('MM/DD/YYYY'),
                    date_sold = moment(value.date_sold).format('MM/DD/YYYY'),
                    customer_name = value.customer_info ? value.customer_info.name : '',
                    account_number = value.customer_info === null ? '--' : (value.customer_info.type ? value.customer_info.account_number : 'CASH'),
                    term = value.customer_info ? value.customer_info.term : '',
                    payment = value.customer_info ? value.customer_info.payment : '';

                res.push([value, date_sold, customer_name, account_number, model, engine_number, branch, term, numberWithCommas(payment)]);
            });
            return Promise.resolve(res)
        }).catch((err) => {
            console.log('Error', err)
            return Promise.resolve(false)
        });
    }
}

export function getUnitsTotalCost(query) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');

        return productService.find({
            query: query
        }).then((data) => {
            const products = data.data,
                res = [];
            let cost = 0;

            products.map((value, index) => {
                const model = value.motorModels == null ? value.unit_model_name : value.motorModels.model_name,
                    brand = value.brands.brand_name,
                    branch = value.branches.branch_name,
                    price = value.price;

                res.push([value, brand, model, branch, numberWithCommas(price ? price : 0)]);
                cost += price;
            })

            res['extra'] = cost;
            return Promise.resolve(res)
        }).catch((err) => {
            console.log('err ', err)
            return Promise.resolve(false)
        });
    }
}

export function getUnitsTotalCostSold(query) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');

        return productService.find({
            query: query
        })
            .then((data) => {
                const products = data.data,
                    res = [];
                let cost = 0;

                products.map((value, index) => {
                    const model = value.motorModels == null ? value.unit_model_name : value.motorModels.model_name,
                        brand = value.brands.brand_name,
                        branch = value.branches.branch_name,
                        price = value.price;

                    res.push([value, brand, model, branch, numberWithCommas(price ? price : 0)]);
                    cost += price;
                });

                res['extra'] = cost;
                return Promise.resolve(res)
            }).catch((err) => {
                console.log('err ', err)
                return Promise.resolve(false)
            });
    }
}

export function filterReportTba(query) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');

        return productService.find({
            query: query
        }).then((data) => {
            const products = data.data,
                res = [];

            products.map((value, index) => {
                const model = value.motorModels == null ? value.unit_model_name : value.motorModels.model_name,
                    engine_number = value.engine_number,
                    branch = value.branches ? value.branches.branch_name : '',
                    invoice = value.invoice.invoice_number ? value.invoice.invoice_number : '',
                    delivery_receipt = value.delivery ? value.delivery.receipt_number : '',
                    date_received = value.dateReceived === null ? value.createdAt : value.dateReceived,
                    formattedDate = moment(date_received).format('MM/DD/YYYY');

                res.push([value, model, engine_number, branch, formattedDate, invoice, delivery_receipt]);
            });
            return Promise.resolve(res)
        }).catch((err) => {
            console.log('ERROR', err)
            return Promise.resolve(false)
        });
    }

}


export function filterReport3(query) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');

        return productService.find({
            query: query
        }).then((data) => {
            const products = data.data,
                res = [];
            let cost = 0;
            if (products.length > 0) {
                products.map((value, index) => {
                    const model = value.motorModels === null ? (value.unit_model_name ? value.unit_model_name : '--') : (value.motorModels.model_name),
                        brand = value.brands ? value.brands.brand_name : '--',
                        branch = value.branches ? value.branches.branch_name : '--',
                        price = value.price;

                    res.push([value, brand, model, branch, numberWithCommas(price ? price : 0)]);
                    cost += price;
                });
                res['extra'] = cost;
                return Promise.resolve(res)
            } else {
                return Promise.resolve(false)
            }
        }).catch((err) => {
            console.log('err ', err)
            return Promise.resolve(false)
        });
    }
}

export function getAllInventoryReports(type) {
    return (dispatch, getState) => {
        const reportService = feathers.service('reports');

        return reportService.find({
            query: {
                report_type: type
            }
        }).then((data) => {
            const reports = data.data,
                res = [];

            reports.map((value, index) => {
                // const button = '<button class="btn table-btn border-radius-50 text-white view-report">View</button>',
                const button = '<button class="btn btn-sm btn-new-view view-report" title="View">' +
                    '<span class="fa fa-eye"></button>                    <button class="btn btn-danger btn-sm delete_report" title="Delete"><span class="fa fa-trash"></button>',
                    formattedDate = moment(value.createdAt).format('MM/DD/YYYY');

                res.push([formattedDate, value.report_title, value.user_fullname, button, value]);
            });

            return Promise.resolve(res)
        }).catch((err) => {
            console.log('err ', err)
        });
    }
}

export function for_bir_previous_old_code(id) {
    return (dispatch, getState) => {
        const productsService = feathers.service('products');

        return productsService.find({
            query: {
                branch: {
                    $ne: id
                }
            }
        }).then((d) => {
            const output = [],
                result = d.data,
                current_year = parseFloat(moment().format('YYYY')),
                previous_year = current_year - 1;

            const prev_y_unsold = [],
                curr_y_unsold = [],
                curr_y_unsold_ids = [],
                curr_y_sold = [];

            result.map((v) => {
                if (v.year_added === previous_year && v.type === 0) {
                    prev_y_unsold.push({
                        id: v._id,
                        model: v.motorModels ? v.motorModels.model_name : '',
                        branch: v.branches ? v.branches.branch_name : '',
                        status: v.type,
                        price: v.price,
                    })
                }

                if (v.year_added === current_year && v.type === 0) {
                    curr_y_unsold.push({
                        id: v._id,
                        model: v.motorModels ? v.motorModels.model_name : '',
                        branch: v.branches ? v.branches.branch_name : '',
                        status: v.type,
                        price: v.price,
                    });

                    curr_y_unsold_ids.push(v._id);
                }

                if (v.year_added === current_year && v.type === 1) {
                    curr_y_sold.push({
                        id: v._id,
                        model: v.motorModels ? v.motorModels.model_name : '',
                        branch: v.branches ? v.branches.branch_name : '',
                        status: v.type,
                        price: v.price,
                    })
                }
            })

            const filtered = {};

            result.map((a) => {
                const model = a.model,
                    branch = a.branches ? a.branches.branch_name : '',
                    price = a.price;

                if (Object.keys(filtered).indexOf(model) === -1) {
                    filtered[model] = {
                        count: 1,
                        price: price
                    }
                } else {
                    filtered[model] = {
                        count: filtered[model].count + 1,
                        price: filtered[model].price + price,
                    }
                }

                filtered[model]['model'] = model;
                filtered[model]['branch'] = branch;
                filtered[model]['id'] = a._id;
            })

            for (const index in filtered) {
                if (curr_y_unsold_ids.includes(filtered[index].id)) {
                    output.push({
                        id: filtered[index].id,
                        model: filtered[index].model,
                        branch: filtered[index].branch,
                        count: filtered[index].count,
                        price: numberWithCommas(filtered[index].price),
                    })
                }
            }
            return Promise.resolve(output)
        }).catch((err) => {
            console.log(err)
            return Promise.resolve(false)
        });
    }
}


export function for_bir_old(id, year_filter = false) {
    return (dispatch, getState) => {
        const productsService = feathers.service('products');
        let query = {};

        if (year_filter) {
            query = {
                query: {
                    branch: {
                        $ne: id
                    },
                    year_added: {
                        $in: [year_filter, year_filter - 1]
                    }
                }
            }
        } else {
            query = {
                query: {
                    branch: {
                        $ne: id
                    },
                    year_added: {
                        $in: [moment().format('YYYY'), moment().subtract(1, 'year').format('YYYY')]
                    }
                }
            }
        }

        return productsService.find(query)
            .then((d) => {
                console.log('d')
                console.log(d)
                if (d.total) {
                    const result = d.data,
                        current_year = year_filter ? parseFloat(year_filter) : parseFloat(moment().format('YYYY')),
                        previous_year = year_filter ? year_filter - 1 : current_year - 1,
                        obj = [];

                    result.map((a) => {

                        obj.push({
                            id: a._id,
                            model: a.motorModels ? a.motorModels.model_name : '',
                            branch: a.branches ? a.branches.branch_name : '',
                            price: a.price,
                            year: a.year_added,
                            status: a.type,
                        })
                    })

                    const output = Object.values(obj.reduce((c, v) => {
                        let k = v.model + '-' + v.branch;
                        c[k] = c[k] || Object.assign(
                            {...v},
                            {cost: 0},
                            {current_unsold_count: 0},
                            {current_sold_count: 0},
                            {previous_unsold_count: 0},
                        );

                        if (v.year === current_year && v.status === 0) {
                            c[k].cost = v.price;
                            c[k].current_unsold_count += 1;
                        }

                        if (v.year === current_year && v.status === 1) {
                            c[k].current_sold_count += 1;
                        }

                        if (v.year === previous_year && v.status === 0) {
                            c[k].previous_unsold_count += 1;
                        }
                        return c;
                    }, {}));
                    return Promise.resolve(output)
                } else {
                    return Promise.resolve(false)
                }
            }).catch((err) => {
                console.log(err)
                return Promise.resolve(false)

            });
    }
}

export function for_bir_previous(id) {
    return (dispatch, getState) => {
        var productsService = feathers.service('products');

        return productsService.find({
            query: {
                branch: {
                    $ne: id
                }
            }
        })
            .then((d) => {
                var output = [],
                    result = d.data,
                    current_year = parseFloat(moment().format('YYYY')),
                    previous_year = current_year - 1;

                console.log('previous_year ', previous_year)


                var prev_y_unsold = [],
                    curr_y_unsold = [],
                    curr_y_unsold_ids = [],
                    curr_y_sold = [];

                result.map((v) => {
                    if (v.year_added == previous_year && v.type == 0) {
                        prev_y_unsold.push({
                            id: v._id,
                            model: v.motorModels ? v.motorModels.model_name : '',
                            branch: v.branches ? v.branches.branch_name : '',
                            status: v.type,
                            price: v.price,
                        })
                    }

                    if (v.year_added == current_year && v.type == 0) {
                        curr_y_unsold.push({
                            id: v._id,
                            model: v.motorModels ? v.motorModels.model_name : '',
                            branch: v.branches ? v.branches.branch_name : '',
                            status: v.type,
                            price: v.price,
                        })

                        curr_y_unsold_ids.push(v._id);
                    }

                    if (v.year_added == current_year && v.type == 1) {
                        curr_y_sold.push({
                            id: v._id,
                            model: v.motorModels ? v.motorModels.model_name : '',
                            branch: v.branches ? v.branches.branch_name : '',
                            status: v.type,
                            price: v.price,
                        })
                    }
                })

                var filtered = {};

                result.map((a) => {
                    var model = a.model,
                        branch = a.branches ? a.branches.branch_name : '',
                        price = a.price;

                    if (Object.keys(filtered).indexOf(model) === -1) {
                        filtered[model] = {
                            count: 1,
                            price: price
                        }
                    } else {
                        filtered[model] = {
                            count: filtered[model].count + 1,
                            price: filtered[model].price + price,
                        }
                    }

                    filtered[model]['model'] = model;
                    filtered[model]['branch'] = branch;
                    filtered[model]['id'] = a._id;
                })

                for (var index in filtered) {
                    if (curr_y_unsold_ids.includes(filtered[index].id)) {
                        output.push({
                            id: filtered[index].id,
                            model: filtered[index].model,
                            branch: filtered[index].branch,
                            count: filtered[index].count,
                            price: numberWithCommas(filtered[index].price),
                        })
                    }
                }

                return Promise.resolve(output)

            })
            .catch((err) => {
                console.log(err)
                return Promise.resolve(false)
            })
    }
}

export function for_bir(id, year_filter = false) {
    return (dispatch, getState) => {
        var productsService = feathers.service('products');

        if (year_filter) {
            var query = {
                query: {
                    branch: {
                        $ne: id
                    },
                    year_added: {
                        $in: [year_filter, year_filter - 1]
                    }
                }
            }
        } else {
            var query = {
                query: {
                    branch: {
                        $ne: id
                    },
                    year_added: {
                        $in: [moment().format('YYYY'), moment().subtract(1, 'year').format('YYYY')]
                    }
                }
            }
        }

        console.log(query)

        // query = {}

        return productsService.find(query)
            .then((d) => {
                console.log('productsService ', d)
                if (d.total) {
                    var output = [],
                        result = d.data,
                        current_year = year_filter ? parseFloat(year_filter) : parseFloat(moment().format('YYYY')),
                        previous_year = year_filter ? year_filter - 1 : current_year - 1,
                        obj = [];

                    result.map((a) => {

                        obj.push({
                            id: a._id,
                            model: a.motorModels ? a.motorModels.model_name : '',
                            branch: a.branches ? a.branches.branch_name : '',
                            price: a.price,
                            year: a.year_added,
                            status: a.type,
                        })
                    })

                    // console.log('obj ',obj)
                    // console.log('result ',result)


                    // var output = Object.values(obj.reduce((c, v) => {
                    //     let k = v.model + '-' + v.branch;
                    //     // c[k] = c[k] || Object.assign({ ...v}, {price: 0}, {count: 0});
                    //     c[k] = c[k] || Object.assign({ ...v}, {total_cost: 0}, {count: 0}, {beg_balance: 0});
                    //     c[k].total_cost += v.price;
                    //     c[k].beg_balance += v.beg_balance;
                    //     c[k].count += 1;
                    //     return c;
                    // }, {}));

                    var output = Object.values(obj.reduce((c, v) => {
                        let k = v.model + '-' + v.branch;
                        // c[k] = c[k] || Object.assign({ ...v}, {price: 0}, {count: 0});
                        c[k] = c[k] || Object.assign(
                            {...v},
                            {cost: 0},
                            {current_unsold_count: 0},
                            {current_sold_count: 0},
                            {previous_unsold_count: 0},
                        );

                        if (v.year == current_year && v.status == 0) {
                            c[k].cost = v.price;
                            c[k].current_unsold_count += 1;
                        }

                        if (v.year == current_year && v.status == 1) {
                            c[k].current_sold_count += 1;
                        }

                        if (v.year == previous_year && v.status == 0) {
                            c[k].previous_unsold_count += 1;
                        }
                        return c;
                    }, {}));

                    return Promise.resolve(output)
                } else {
                    return Promise.resolve(false)
                }

            })
            .catch((err) => {
                console.log(err)
                return Promise.resolve(false)

            })
    }
}

export function getfinancialStatement() {
    return (dispatch, getState) => {
        const financialService = feathers.service('financial');
        const userBranchName = getState().login.userData.branch_info.branch_name;
        const userBranchId = getState().login.userData.branch_info._id;
        let qry = {
            query: {}
        }

        if (userBranchName != "MAIN") {
            qry.query.branch = userBranchId
        }

        let query = {
            query: {
                area: localStorage.getItem('local_branch_name')
            }
        }

        return financialService.find(qry).then((value) => {
            const results = value.data;
            let data = [];
            results.forEach((value, index) => {
                // const actionBtn = '<button class="btn border-radius-50 text-white table-btn view">View</button>';
                console.log('value')
                console.log(value)
                const date_created = value.createdAt,
                    branch = value.branches ? value.branches.branch_name : "",
                    date_value = moment(date_created).format('MMMM DD, YYYY'),
                    actionBtn = '<button class="btn btn-new-view" title="View">' +
                        '<span class="fa fa-eye"></span></button>' +
                        '<button class="btn  btn-new-edit" title="edit">' +
                        '<span class="fa fa-pencil"></span></button>';
                data.push([value._id, 'FINANCIAL STATEMENT REPORT', branch, date_value, actionBtn, value]);
            });
            return Promise.resolve(data);
        }).catch((err) => {
            return Promise.resolve(false);
        });
    }
}

export function financialInfo(data) {
    return {
        type: FINANCIAL_INFO,
        data: data
    }
}


export function getTotalCurrentMA(query) {
    return (dispatch, getState) => {
        var customerLedger = feathers.service('ledger'),
            output = [],
            query_statement = '';
        let branchName = getState().login.userData.branch_info.branch_name;
        let branchId = getState().login.userData.branch_info._id;

        if (query) {
            query_statement = {
                query: query
            }
        }

        query_statement.query.current = 1;

        if (branchName != "MAIN") {
            query_statement.query.branch = branchId;
        }

        return customerLedger.find(query_statement)
            .then((data) => {
                if (data.data.length > 0) {
                    var customerData = data.data,
                        res = [],
                        total = 0;

                    customerData.map((value, index) => {

                        var account_number = value.customer_info ? value.customer_info.account_number : "",
                            name = value.customer_info ? value.customer_info.name : '',
                            promisory_note = value.promisory_note ? value.promisory_note : 0,
                            due_date = value.due_date ? value.due_date : '',
                            terms = value.customer_info !== null ? value.customer_info.term : 0,
                            area = value.customer_info ? value.customer_info.area : '',
                            ma = (twoDecimalPlaces(Number(promisory_note) / terms));

                        total += ((value.customer_info == null ? 0 : Number(ma)));

                        res.push([value, account_number, name, due_date, (value.customer_info == null ? 0 : numberWithCommas(Number(ma))), (terms ? terms : '--'), area]);
                    })


                    output['data'] = res;
                    output['total'] = total;
                } else {
                    output['data'] = false;
                    output['total'] = 0;
                }

                return Promise.resolve(output)
            })

            .catch((d) => {
                console.log("ERROR MA ===", d)
                output['data'] = false;
                output['total'] = 0;
                return Promise.resolve(output)
            })
    }
}

export function getTotalCurrentMASH(query) {
    return (dispatch, getState) => {
        var customerPayments = feathers.service('ledger-secondhand'),
            output = [],
            query_statement = '';

        if (query) {
            query_statement = {
                query: query
            }
        }
        query_statement.query.current = 1;

        return customerPayments.find(query_statement)
            .then((data) => {
                var customerData = data.data,
                    res = [],
                    total = 0;

                customerData.map((value, index) => {
                    var account_number = value.customer_info ? value.customer_info.account_number : '',
                        name = value.customer_info ? value.customer_info.name : '',
                        promisory_note = value.promisory_note ? value.promisory_note : 0,
                        due_date = value.due_date ? value.due_date : '',
                        terms = value.customer_info ? value.customer_info.term : 0,
                        area = value.customer_info ? value.customer_info.area : '',
                        ma = (twoDecimalPlaces(Number(promisory_note) / terms));

                    total += ((value.customer_info === null ? 0 : Number(ma)));

                    res.push([value, account_number, name, due_date, (value.customer_info === null ? 0 : numberWithCommas(Number(ma))), terms, area]);
                })


                output['data'] = res;
                output['total'] = total;

                return Promise.resolve(output)
            })

            .catch((d) => {
                console.log("ERROR MA ===", d)
                return Promise.resolve(false)
            })
    }
}


export const financialData = () => {
    return (dispatch, getState) => {
        let financialSRVC = feathers.service('financial'),
            data = [],
            output = [];

        return financialSRVC.find()
            .then((result) => {
                if (result.total) {
                    let res = result.data;
                    res.map((value, i) => {
                        data.push([
                            value._id,
                            value.createdAt,
                            value.cash_sales,
                            value.downpayment,
                            value.collection_ma,
                            value.total_collection,
                            value.furniture_fixes,
                            value.office_equipment,
                            value.other_fix_assets,
                            value.freebies,
                            value.incentives,
                            value.advertising_promotions,
                            value.salaries_wages,
                            value.sss_phic_pagibig,
                            value.employee_benefits,
                            value.am_gas,
                            value.bm_gas,
                            value.ci_gas,
                            value.l3_gas,
                            value.tax_license,
                            value.rental,
                            value.repair_maintenance,
                            value.light_water,
                            value.communication,
                            value.office_supplies,
                            value.mailing_expenses,
                            value.transportation,
                            value.medical_assistance,
                            value.photocopy,
                            value.cleaning_materials,
                            value.water_refill,
                            value.other_expenses,
                            value.total_expenses
                        ]);
                    });

                    output['status'] = true;
                    output['data'] = data;
                } else {
                    output['status'] = false;
                    output['data'] = [];
                }

                return Promise.resolve(output);
            }).catch(() => {
                output['status'] = false;
                output['data'] = [];
                return Promise.resolve(output)
            });
    }
}

export function getCustomerNoPayment(dateRange) {
    return (dispatch, getState) => {
        const ledgerService = feathers.service('ledger');
        const customerPayments = feathers.service('customer-payments'),
            output = [],
            query_statement = '';
        return ledgerService.find()
            .then((data) => {
                if (data.total) {
                    const ledgerItems = data.data;
                    const daterangeInfo = dateRange,
                        ledgerDataArr = [],
                        ledgerDataObj = [],
                        paymentData = [],
                        ret = [];
                    ledgerItems.map((value, index) => {
                        if (daterangeInfo.includes(value.due_date)) {
                            ledgerDataArr.push(value.account_number)
                            ledgerDataObj.push({account_number: value.account_number})
                        }
                    });
                    ret['obj'] = ledgerDataObj;
                    ret['arr'] = ledgerDataArr;
                    console.log(ret);
                    return Promise.resolve(ret)
                } else {
                    return Promise.resolve(false)
                }
            }).catch(() => {
                return Promise.resolve(false)
            });
    }
}


export function getCustomerNoPaymentSH(dateRange) {
    return (dispatch, getState) => {
        const ledgerService = feathers.service('ledger-secondhand'),
            customerPayments = feathers.service('customer-payments-secondhand'),
            output = [],
            query_statement = '';

        return ledgerService.find()
            .then((data) => {
                if (data.total) {
                    const ledgerItems = data.data;
                    const daterangeInfo = dateRange,
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
                    });
                    ret['obj'] = ledgerDataObj;
                    ret['arr'] = ledgerDataArr;

                    return Promise.resolve(ret)
                } else {
                    return Promise.resolve(false)
                }
            }).catch((err) => {
                return Promise.resolve(false)
            });
    }
}

export function createFinancialStatement(formData) {
    return (dispatch, getState) => {
        const fsService = feathers.service('financial');

        return fsService.create(formData)
            .then((data) => {
                return Promise.resolve(true)
            }).catch((error) => {
                alert('ERROR', error)
                console.log('ERROR FINANCIAL ===>', error)
            });
    }
}


export function getTotalPaidSH(query = false) {
    return (dispatch, getState) => {
        const customerPayments = feathers.service('customer-payments-secondhand'),
            output = [];
        let query_statement = '';

        if (query) {
            query_statement = {
                query: query
            }
        }
        return customerPayments.find(query_statement)
            .then((data) => {
                if (data.data.length > 0) {
                    const customerData = data.data,
                        res = [];
                    let total = 0;

                    customerData.map((value, index) => {
                        const account_number = value.account_number ? value.account_number : 'CASH' ? value.account_number : '',
                            or_number = value.or_number ? value.or_number : '',
                            date_paid = value.date_paid ? value.date_paid : '',
                            amount_paid = Number(value.amount_paid) ? Number(value.amount_paid) : '',
                            area = value.area ? value.area : '';
                        total += Number(value.amount_paid);

                        if (amount_paid) {
                            res.push([value, account_number, or_number, amount_paid, date_paid, area]);
                        }
                    });
                    output['data'] = res;
                    output['total'] = total;
                } else {
                    output['data'] = false;
                    output['total'] = 0;
                }

                return Promise.resolve(output)
            }).catch(() => {
                return Promise.resolve(false)
            });
    }
}

export function getFPCust(query = false) {
    return (dispatch, getState) => {
        const customerPayments = feathers.service('customers'),
            output = []
        let query_statement = {};
        let branchName = getState().login.userData.branch_info.branch_name;
        let branchId = getState().login.userData.branch_info._id;


        if (query) {

            console.log(query)

            query_statement = {
                query: query
            }

            if (branchName != "MAIN") {
                query_statement.query.branch = branchId;
            }
        }
        return customerPayments.find(query_statement)
            .then((data) => {
                if (data.data.length > 0) {
                    const customerData = data.data,
                        res = [];
                    let total = 0;

                    customerData.map((value, index) => {

                        const account_number = value.account_number ? value.account_number : 'CASH',
                            name = value.name ? value.name : '',
                            // or_number = value.or_number ? value.or_number : '',
                            // total_paid = value.total_paid  ? value.total_paid : '',
                            area = value.area ? value.area : '',
                            date = value.date_purchased ? value.date_purchased : '',
                            date_closed = value.date_closed ? value.date_closed : '';
                        total += parseFloat(value.amount_paid);

                        if (value.account_status == 1) {
                            res.push([value, account_number, name, moment(date).format('MM/DD/YYYY'), moment(date_closed).format('MM/DD/YYYY'), area]);
                        }


                    })
                    output['data'] = res;
                    output['total'] = total;
                } else {
                    return Promise.resolve(false)
                }

                return Promise.resolve(output)
            }).catch(() => {
                return Promise.resolve(false)
            });
    }
}


export function getFPCustSH(query = false) {
    return (dispatch, getState) => {
        const customerPayments = feathers.service('customer-secondhand-unit'),
            output = [];
        let query_statement = {};
        let branchName = getState().login.userData.branch_info.branch_name;
        let branchId = getState().login.userData.branch_info._id;


        if (query) {
            query_statement = {
                query: query
            }

            if (branchName != "MAIN") {
                query_statement.query.branch = branchId;
            }
        }
        return customerPayments.find(query_statement)
            .then((data) => {
                if (data.data.length > 0) {
                    const customerData = data.data,
                        res = [];
                    let total = 0;

                    customerData.map((value, index) => {
                        const account_number = value.account_number ? value.account_number : 'CASH',
                            name = value.name ? value.name : '',
                            // or_number = value.or_number ? value.or_number : '',
                            // total_paid = value.total_paid  ? value.total_paid : '',
                            area = value.area ? value.area : '',
                            date = value.date_purchased ? value.date_purchased : '',
                            date_closed = value.date_closed ? value.date_closed : '';
                        total += parseFloat(value.amount_paid);

                        if (value.account_status == 1) {
                            res.push([value, account_number, name, moment(date).format('MM/DD/YYYY'), moment(date_closed).format('MM/DD/YYYY'), area]);
                        }
                    });
                    output['data'] = res;
                    output['total'] = total;
                } else {
                    return Promise.resolve(false)
                }

                return Promise.resolve(output)
            }).catch(() => {
                return Promise.resolve(false)
            });
    }
}

export function getRPCust(query = false) {
    return (dispatch, getState) => {
        const customerPayments = feathers.service('customers'),
            output = [];
        let query_statement = {};
        let branchName = getState().login.userData.branch_info.branch_name;
        let branchId = getState().login.userData.branch_info._id;
        if (query) {
            query_statement = {
                query: query,
            }
            
            query_statement.query.account_status = 2

            if (branchName != "MAIN") {
                query_statement.query.branch = branchId;
            }
        }

        return customerPayments.find(query_statement)
            .then((data) => {
                if (data.data.length > 0) {
                    let customerData = data.data,
                        res = [],
                        total = 0;
                    customerData.map((value, index) => {
                        let account_number = value.account_number ? value.account_number : 'CASH',
                            name = value.name ? value.name : '',
                            // or_number = value.or_number ? value.or_number : '',
                            // total_paid = value.total_paid  ? value.total_paid : '',
                            area = value.area ? value.area : '',
                            date = value.date_purchased ? value.date_purchased : '',
                            date_repo = value.date_repossessed ? value.date_repossessed : '';
                        total += parseFloat(value.amount_paid);

                        res.push([value, account_number, name, moment(date).format('MM/DD/YYYY'), moment(date_repo).format('MM/DD/YYYY'), area]);

                        if (value.account_status == 2) {
                            
                        }
                    });
                    output['data'] = res;
                    output['total'] = total;
                } else {
                    return Promise.resolve(false)
                }
                return Promise.resolve(output)
            }).catch(() => {
                return Promise.resolve(false)
            });
    }
}

export function getPaymentSchedule(id = false) {
    return (dispatch, getState) => {
        const SERVICE = feathers.service('ledger'),
            data = [],
            output = [];

        let query = {
            query: {
                _id: id
            }
        }

        SERVICE.find()
            .then((result) => {
                console.log('result == ', result)
            }).catch(() => {

        });
    }
}

export function getNewCust(query = false) {
    return (dispatch, getState) => {
        const customerPayments = feathers.service('customers'),
            output = [];
        let query_statement = {};
        let branchName = getState().login.userData.branch_info.branch_name;
        let branchId = getState().login.userData.branch_info._id;


        if (query) {
            query_statement = {
                query: query
            }

            if (branchName != "MAIN") {
                query_statement.query.branch = branchId;
            }
        }

        // query_statement = {}
        return customerPayments.find(query_statement)
            .then((data) => {

                if (data.data.length > 0) {

                    const customerData = data.data,
                        res = [];
                    let total = 0;

                    customerData.map((value, index) => {

                        const account_number = value.account_number ? value.account_number : 'CASH',
                            name = value.name ? value.name : '',
                            model = value.unitName ? value.unitName : '',
                            area = value.area ? value.area : '',
                            date = value.date_purchased ? value.date_purchased : '';
                        total += parseFloat(value.amount_paid);

                        res.push([value, account_number, name, model, moment(date).format('MM/DD/YYYY'), area]);


                    })
                    output['data'] = res;
                    output['total'] = total;

                    return Promise.resolve(output)
                } else {
                    return Promise.resolve(false)
                }
            }).catch(() => {
                return Promise.resolve(false)
            });
    }
}

export function getNewCustSH(query = false) {
    return (dispatch, getState) => {
        const customerPayments = feathers.service('customer-secondhand-unit'),
            output = [];
        let query_statement = {};
        let branchName = getState().login.userData.branch_info.branch_name;
        let branchId = getState().login.userData.branch_info._id;

        if (query) {
            query_statement = {
                query: query
            }

            if (branchName != "MAIN") {
                query_statement.query.branch = branchId;
            }
        }
        return customerPayments.find(query_statement)
            .then((data) => {
                const customerData = data.data,
                    res = [];
                let total = 0;

                customerData.map((value, index) => {

                    const account_number = value.account_number ? value.account_number : 'CASH',
                        name = value.name ? value.name : '',
                        model = value.unit.name ? value.unit.name : '',
                        area = value.area ? value.area : '',
                        date = value.date_purchased ? value.date_purchased : '';
                    total += parseFloat(value.amount_paid);

                    res.push([value, account_number, name, model, moment(date).format('MM/DD/YYYY'), area]);
                });
                output['data'] = res;
                output['total'] = total;

                return Promise.resolve(output)
            }).catch(() => {
                return Promise.resolve(false)
            });
    }
}

export function getCustomerListWhoPaid(query = false) {
    return (dispatch, getState) => {
        const customerPayments = feathers.service('customer-payments'),
            customerPaymentsSH = feathers.service('customer-payments-secondhand'),
            output = [];
        let query_statement = '';

        if (query) {
            query_statement = {
                query: query
            }
        }
        console.log(query_statement);
        return customerPayments.find(query_statement)
            .then((data) => {
                const customerData = data.data,
                    res = [];
                let total = 0;

                customerData.map((value, index) => {
                    console.log(value);
                    const account_number = value.account_number ? value.account_number : 'CASH',
                        name = value.customer_info ? value.customer_info.name : '',
                        or_number = value.or_number ? value.or_number : '',
                        total_paid = value.total_paid ? value.total_paid : '',
                        area = value.area ? value.area : '';
                    total += parseFloat(value.amount_paid);

                    if (total_paid) {
                        res.push([value, account_number, name, or_number, numberWithCommas(total_paid) + ".00", area]);
                    }
                });
                output['data'] = res;
                output['total'] = total;

                return Promise.resolve(output)
            }).catch(() => {
                return Promise.resolve(false)
            });
    }
}

export function getCustomerListWhoPaidSH(query = false) {
    return (dispatch, getState) => {
        const customerPayments = feathers.service('customer-payments-secondhand'),
            output = [];
        let query_statement = '';
        if (query) {
            query_statement = {
                query: query
            }
        }
        return customerPayments.find(query_statement)
            .then((data) => {
                const customerData = data.data,
                    res = [];
                let total = 0;

                customerData.map((value, index) => {

                    const account_number = value.account_number,
                        name = value.customer_info ? value.customer_info.name : '',
                        or_number = value.or_number ? value.or_number : '',
                        total_paid = value.total_paid ? value.total_paid : '',
                        area = value.area ? value.area : '';
                    total += parseFloat(value.amount_paid);

                    if (total_paid) {
                        res.push([value, account_number, name, or_number, numberWithCommas(total_paid) + ".00", area]);
                    }
                });
                output['data'] = res;
                output['total'] = total;

                return Promise.resolve(output)
            }).catch((err) => {
                console.log('ERROR MESSAGE===', err)
                return Promise.resolve(false)
            });
    }
}


export function getTotalPaid(query = false) {
    return (dispatch, getState) => {
        const customerPayments = feathers.service('customer-payments'),
            output = [];
        let query_statement = {};
        let branchName = getState().login.userData.branch_info.branch_name;
        let branchId = getState().login.userData.branch_info._id;


        if (query) {
            query_statement.query = query;
        }

        if (branchName !== "MAIN") {
            query_statement.query.branch = branchId;
        }
        return customerPayments.find(query_statement)
            .then((data) => {
                if (data.data.length > 0) {
                    let customerData = data.data,
                        res = [],
                        total = 0;
                    customerData.map((value, index) => {
                        const account_number = value.account_number ? value.account_number : 'CASH' ? value.account_number : '',
                            or_number = value.or_number ? value.or_number : '',
                            date_paid = value.date_paid ? value.date_paid : '',
                            amount_paid = value.amount_paid ? Number(value.amount_paid) : '',
                            area = value.area ? value.area : '';
                        total += Number(value.amount_paid ? value.amount_paid : 0);

                        if (amount_paid) {
                            res.push([value, account_number, or_number, numberWithCommas(amount_paid), date_paid, area]);
                        }

                    });

                    output['data'] = res;
                    output['total'] = total;
                } else {
                    output['data'] = false;
                    output['total'] = 0;
                }

                return Promise.resolve(output)
            }).catch(() => {
                output['data'] = false;
                output['total'] = 0;
                return Promise.resolve(output)
            });
    }
}


export function getCustomerPerArea(query = false) {
    return (dispatch, getState) => {
        const customerArea = feathers.service('customers'),
            output = [];
        let query_statement = {};

        let branchName = getState().login.userData.branch_info.branch_name;
        let branchId = getState().login.userData.branch_info._id;

        if (query) {
            query_statement = {
                query: query
            }
        }

        if (branchName != "MAIN") {
            query_statement.query.branch = branchId;
        }

        return customerArea.find(query_statement)
            .then((data) => {
                const customerData = data.data,
                    res = [];
                let total = 0;
                const totalCust = data.total;

                customerData.map((value, index) => {

                    const account_number = value.account_number ? value.account_number : 'CASH',
                        name = value.name,
                        address = value.customer_address,
                        model = value.unitName,
                        engine = value.product.engine_number,
                        area = value.area;
                    total = data.total;

                    res.push([value, account_number, name, address, model, engine, area]);
                })
                output['data'] = res;
                output['total'] = total;

                return Promise.resolve(output)
            }).catch(() => {
                return Promise.resolve(false)
            });
    }
}


export function getCustomerPerAreaSH(query = false) {
    return (dispatch, getState) => {
        const customerArea = feathers.service('customer-secondhand-unit'),
            output = [];
        let query_statement = {};

        let branchName = getState().login.userData.branch_info.branch_name;
        let branchId = getState().login.userData.branch_info._id;

        if (query) {
            query_statement = {
                query: query
            }
        }

        if (branchName != "MAIN") {
            query_statement.query.branch = branchId;
        }

        return customerArea.find(query_statement)
            .then((data) => {
                const customerData = data.data,
                    res = [];
                let total = 0;
                const totalCust = data.total;

                customerData.map((value, index) => {
                    const account_number = value.account_number ? value.account_number : 'CASH',
                        name = value.name,
                        address = value.customer_address ? value.customer_address : '',
                        model = value.unit.name ? value.unit.name : '',
                        engine = value.secondhand_unit_info ? value.secondhand_unit_info.engine_number : '',
                        area = value.area;
                    total = data.total;

                    res.push([value, account_number, name, address, model, engine, area]);
                });
                output['data'] = res;
                output['total'] = total;

                return Promise.resolve(output)
            }).catch((err) => {
                console.log('ERROR DATA ===', err)
                return Promise.resolve(false)
            });
    }
}

export function getRPCustSH(query = false) {
    return (dispatch, getState) => {
        const customerPayments = feathers.service('customer-secondhand-unit'),
            output = [];
        let query_statement = {};
        let branchName = getState().login.userData.branch_info.branch_name;
        let branchId = getState().login.userData.branch_info._id;


        if (query) {
            query_statement = {
                query: query
            }

            query_statement.query.account_status = 2;

            if (branchName !== "MAIN") {
                query_statement.query.branch = branchId;
            }
        }
        return customerPayments.find(query_statement)
            .then((data) => {
                if (data.data.length > 0) {
                    const customerData = data.data,
                        res = [];
                    let total = 0;

                    customerData.map((value, index) => {

                        const account_number = value.account_number ? value.account_number : 'CASH',
                            name = value.name ? value.name : '',
                            // or_number = value.or_number ? value.or_number : '',
                            // total_paid = value.total_paid  ? value.total_paid : '',
                            area = value.area ? value.area : '',
                            date = value.date_purchased ? value.date_purchased : '',
                            date_repo = value.date_repossessed ? value.date_repossessed : '';
                        total += parseFloat(value.amount_paid);

                        res.push([value, account_number, name, moment(date).format('MM/DD/YYYY'), moment(date_repo).format('MM/DD/YYYY'), area]);
                        if (value.account_status == 2) {
                        }
                    });
                    output['data'] = res;
                    output['total'] = total;
                } else {
                    return Promise.resolve(false)
                }

                return Promise.resolve(output)
            }).catch(() => {
                return Promise.resolve(false)
            });
    }
}


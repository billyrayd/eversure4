import {
    PRODUCT_LIST,
    SELECTED_MODEL,
    SELECTED_MODEL_SET,
    ADVANCED_FILTER,
    SET_ALL_PRODUCTS,
    SELECTED_FILTERS,
    SET_ALL_SOLD_PRODUCTS,
    PRODUCTS_TO_TRANSFER,
    OUTGOING_PRODUCTS,
    PRODUCT_INFO,
    UPDATE_UNIT_INFO,
    MODELS_FOR_SECONDHAND_UNITS,
    FOR_PRICING,
    PRICES_UPDATED,
} from '../constants/product';

// Moment
import Moment from 'moment';

import {
    numberWithCommas
} from '../helpers/';

import feathers from '../helpers/feathers'
import {
    SET_INCOMING_PRODUCTS,
    ACCEPT_DATA_ID,
    DELETE_ID,
    DELETE_SERVICE,
    UPDATE_SECONDHAND_UNIT_INFO
} from "../constants/product";

export function productList(data) {
    return {
        type: PRODUCT_LIST,
        data: data
    }
}

export function getProducts(secondhand) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');
        let query;

        if (secondhand) {
            query = {
                query: {
                    type: 0,
                    brandNew: 0
                }
            }
        } else {
            query = {
                query: {
                    type: 0,
                    brandNew: 1
                }
            }
        }

        return productService.find(query).then((products) => {
            const results = products.data,
                filtered = {},
                cleanData = [];

            results.map((obj) => {
                let model = obj.model,
                    modelName = obj.motorModels ? obj.motorModels.model_name : obj.received_model_name !== null ? obj.received_model_name : '',
                    brandName = obj.brands ? obj.brands.brand_name : obj.received_brand_name !== null ? obj.received_brand_name : '',
                    branch = obj.branches ? obj.branches.branch_name : '',
                    date_received = Moment(obj.date_created).format('MM/DD/YYYY'),
                    chassis_number = obj.chassis_number,
                    engine_number = obj.engine_number,
                    color = obj.color;

                cleanData.push([
                    obj,
                    modelName,
                    // brandName,
                    chassis_number,
                    engine_number,
                    branch,
                    date_received,
                    // color,
                    '<button title="Edit" class="btn btn-sm btn-primary edit"><span class="fa fa-edit" /></button> ' +
                    '<button title="Delete" class="btn btn-sm btn-danger delete"><span class="fa fa-trash" /></button> ' +
                    '<button title="View" class="btn btn-sm btn-warning view"><span class="fa fa-eye" /></button>'
                ])
            })
            return Promise.resolve(cleanData);
        }).catch((err) => {
            return Promise.resolve(false);
        })
    }
}

export function inventoryAdvancedFilter(query, secondhand) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');
        if (secondhand) {
            query.brandNew = 0;
        } else {
            query.brandNew = 1;
        }

        return productService.find({
            query: query
        }).then((products) => {
            const results = products.data,
                filtered = {},
                cleanData = [];
            results.map((obj) => {
                let model = obj.model,
                    // modelName = obj.motorModels ? obj.motorModels.model_name : obj.received_model_name ? obj.received_model_name : '',
                    modelName = obj.motorModels == null ? (obj.unit_model_name ? obj.unit_model_name : '--') : obj.motorModels.model_name,
                    brandName = obj.brands ? obj.brands.brand_name : obj.received_brand_name !== null ? obj.received_brand_name : '',
                    branch = obj.branches != null ? obj.branches.branch_name : '',
                    date_received = obj.dateReceived ? Moment(obj.dateReceived).format('MM/DD/YYYY') : Moment(obj.delivery.date).format('MM/DD/YYYY'),
                    // chassis_number = obj.chassis_number,
                    chassis_number = obj.chas,
                    engine_number = obj.engine_number,
                    color = obj.color;

                const chassisExists = cleanData.find(element => element[2] === chassis_number);

                if (!chassisExists) {
                    cleanData.push([
                        obj,
                        modelName,
                        // brandName,
                        chassis_number,
                        engine_number,
                        branch,
                        date_received,
                        // color,
                        '<button title="Edit" class="btn btn-sm btn-primary edit"><span class="fa fa-edit" /></button> ' +
                        '<button title="Delete" class="btn btn-sm btn-danger delete"><span class="fa fa-trash" /></button> ' +
                        // '<ConfirmationDelete onYes={() => this.deleteData(\'test\')}/> ' +
                        '<button title="View" class="btn btn-sm btn-warning view"><span class="fa fa-eye" /></button>'
                    ])
                }
            })
            return Promise.resolve(cleanData);
        }).catch((err) => {
            return Promise.resolve(false);
        })
    }
}

export function searchDr(query, secondhand) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');

        return productService.find({
            query: query
        }).then((products) => {
            const results = products.data,
                filtered = {},
                cleanData = [];

            results.map((obj) => {
                let model = obj.model,
                    modelName = Object.keys(obj.motorModels).length > 0 ? obj.motorModels.model_name : (obj.received_model_name !== null ? obj.received_model_name : ''),
                    brandName = obj.brands ? obj.brands.brand_name : obj.received_brand_name !== null ? obj.received_brand_name : '',
                    branch = obj.branches ? obj.branches.branch_name : '',
                    date_received = Moment(obj.delivery.date).format('MM/DD/YYYY'),
                    // chassis_number = obj.chassis_number,
                    chassis_number = obj.chas,
                    engine_number = obj.engine_number,
                    color = obj.color,
                    editBtn = '<button title="Edit" class="btn btn-sm btn-success edit"><span class="fa fa-edit" /></button>',
                    clearances = obj.clearances === 1 ? '' : '<button title="Click to add Clearances" class="btn btn-sm btn-primary clearance"><span class="fa fa-list-alt" /></button> ',
                    warranty_claims = obj.warranty_claims === 1 ? '' : '<button title="Click to add Warranty Claims" class="btn btn-sm btn-danger warranty"><span class="fa fa-check-square" /></button> ',
                    tba = obj.tba === 1 ? '' : '<button title="Click to add TBA\'s " class="btn btn-sm btn-warning tba"><span class="fa fa-wrench" /></button>';

                cleanData.push([
                    obj,
                    modelName,
                    // brandName,
                    chassis_number,
                    engine_number,
                    branch,
                    date_received,
                    `${editBtn} ${clearances} ${warranty_claims} ${tba}`
                ]);
            });

            return Promise.resolve(cleanData);
        }).catch((err) => {
            return Promise.resolve(false);
        })
    }
}

export function setProducts(data) {
    return {
        type: PRODUCT_LIST,
        data: data
    }
}

export function selectModel(data) {
    return {
        type: SELECTED_MODEL,
        data: data
    }
}

export function getSelectedModel(data, advanced = false, model = null, color = null, branch = null, brand = null) {
    return (dispatch, getState) => {
        const productService = feathers.service('products'),
            newData = [];
        let filter;

        if (advanced) {

            if (color) {
                if (color.toLowerCase() === 'all') {
                    color = null
                } else {
                    color = color.toUpperCase()
                }
            }

            if (branch) {
                if (branch.toLowerCase() === 'all') {
                    branch = null
                }
            }

            if (model) {
                if (model.toLowerCase() === 'all') {
                    model = null
                }
            }

            if (brand) {
                if (brand.toLowerCase() === 'all') {
                    brand = null
                }
            }

            if (model && !color && !branch && !brand) {
                filter = {
                    query: {
                        model: model,
                        type: 0,
                    }
                }
            } else if (model && color && !branch && !brand) {
                filter = {
                    query: {
                        model: model,
                        color: color,
                        type: 0,
                    }
                }
            } else if (model && !color && branch && !brand) {
                filter = {
                    query: {
                        model: model,
                        branch: branch,
                        type: 0,
                    }
                }
            } else if (model && !color && !branch && brand) {
                filter = {
                    query: {
                        model: model,
                        brand: brand,
                        type: 0,
                    }
                }
            } else if (model && color && branch && !brand) {
                filter = {
                    query: {
                        model: model,
                        color: color,
                        branch: branch,
                        type: 0,
                    }
                }
            } else if (model && color && !branch && brand) {
                filter = {
                    query: {
                        model: model,
                        color: color,
                        brand: brand,
                        type: 0,
                    }
                }
            } else if (model && !color && branch && brand) {
                filter = {
                    query: {
                        model: model,
                        branch: branch,
                        brand: brand,
                        type: 0,
                    }
                }
            } else if (!model && color && !branch && !brand) {
                filter = {
                    query: {
                        color: color,
                        type: 0,
                    }
                }
            } else if (!model && color && branch && !brand) {
                filter = {
                    query: {
                        color: color,
                        branch: branch,
                        type: 0,
                    }
                }
            } else if (model && color && !branch && !brand) {
                filter = {
                    query: {
                        color: color,
                        model: model,
                        type: 0,
                    }
                }
            } else if (!model && color && !branch && brand) {
                filter = {
                    query: {
                        color: color,
                        branch: brand,
                        type: 0,
                    }
                }
            } else if (!model && color && branch && brand) {
                filter = {
                    query: {
                        color: color,
                        brand: brand,
                        branch: branch,
                        type: 0,
                    }
                }
            } else if (!model && !color && branch && !brand) {
                filter = {
                    query: {
                        branch: branch,
                        type: 0,
                    }
                }
            } else if (!model && !color && branch && brand) {
                filter = {
                    query: {
                        branch: branch,
                        brand: brand,
                        type: 0,
                    }
                }
            } else if (!model && !color && !branch && brand) {
                filter = {
                    query: {
                        brand: brand,
                        type: 0,
                    }
                }
            }

            return productService.find(filter).then((products) => {
                const prod = products.data

                prod.forEach((value, index) => {
                    const rawDate = new Date(value.delivery.date),
                        newDate = rawDate.toLocaleDateString()

                    newData.push([
                        value._id,
                        value.engine_number,
                        value.chassis_number,
                        value.color,
                        newDate,
                        value.branches.branch_name,
                        '<button class="btn table-btn border-radius-50 text-white filtered-models">More</button>',
                        value.price,
                    ]);
                });
                return Promise.resolve(newData);
            }).catch((err) => {
                console.log(err);
            });
        } else {
            return productService.find({
                query: {
                    model: data,
                    type: 0,
                },
            }).then((products) => {
                const prod = products.data

                prod.forEach((value, index) => {
                    const rawDate = new Date(value.delivery.date),
                        newDate = rawDate.toLocaleDateString()

                    newData.push([
                        value._id,
                        value.engine_number,
                        value.chassis_number,
                        value.color,
                        newDate,
                        value.branches.branch_name,
                        '<button class="btn table-btn border-radius-50 text-white filtered-models">More</button>',
                        value.price,
                        value.branches.branch_name,
                        value.branches.branch_name,
                    ])
                });
                return Promise.resolve(newData);
            }).catch((err) => {
                console.log('err ', err)
            });
        }
    }
}

export function selectedModelSet(data) {
    return {
        type: SELECTED_MODEL_SET,
        data: data
    }
}

export function advancedFilter(status) {
    return {
        type: ADVANCED_FILTER,
        status: status
    }
}

// for select
export function getAllProducts(branch) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');

        return productService.find({
            query: {
                type: 0
            }
        }).then((products) => {
            const results = products.data,
                data = [];

            results.forEach((value, index) => {
                data.push([value._id, value.motorModels, value.chas, value.price]);
            });
            return Promise.resolve(data);
        });
    }
}

export function setAllProducts(products) {
    return {
        type: SET_ALL_PRODUCTS,
        data: products
    }
}

export function setselectedFilters(model, color, brand) {
    return {
        type: SELECTED_FILTERS,
        model: model,
        color: color,
        brand: brand,
    }
}

export function getAllSoldProducts(secondhand) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');
        let query;

        if (secondhand) {
            query = {
                query: {
                    type: 1,
                    brandNew: 0
                }
            }
        } else {
            query = {
                query: {
                    type: 1,
                }
            }
        }

        return productService.find(query)
            .then((data) => {
                const products = data.data,
                    res = [];

                products.map((value, index) => {
                    const model = value.motorModels.model_name,
                        engine_number = value.engine_number,
                        branch = value.branches.branch_name,
                        date_received = value.dateReceived === null ? value.createdAt : value.dateReceived,
                        formattedDate = Moment(date_received).format('MM/DD/YYYY'),
                        date_sold = Moment(value.date_sold).format('MM/DD/YYYY'),
                        customer_name = value.customer_info.name,
                        account_number = value.customer_info.account_number,
                        term = value.customer_info.term,
                        payment = value.customer_info.payment;

                    res.push([value, date_sold, customer_name, account_number, model, engine_number, branch, term, numberWithCommas(payment)]);
                })
                return Promise.resolve(res)
            }).catch(() => {
                return Promise.resolve(false)
            });
    }
}

export function inventoryAdvancedFilter2(query, secondhand) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');

        if (secondhand) {
            query.brandNew = 0;
        }

        return productService.find({
            query: query
        }).then((data) => {
            const products = data.data,
                res = [];

            products.map((value, index) => {
                const model = value.motorModels == null ? value.unit_model_name : value.motorModels.model_name,
                    engine_number = value.engine_number,
                    branch = value.branches === null ? '--' : value.branches.branch_name,
                    date_received = value.dateReceived === null ? value.createdAt : value.dateReceived,
                    formattedDate = Moment(date_received).format('MM/DD/YYYY'),
                    date_sold = Moment(value.date_sold).format('MM/DD/YYYY'),
                    customer_name = (value.customer_info === null ? '--' : value.customer_info.name),
                    account_number = value.customer_info !== null ? value.customer_info.account_number : 'CASH',
                    term = (value.customer_info === null ? '--' : value.customer_info.term),
                    payment = (value.customer_info === null ? '--' : value.customer_info.payment),
                    btn = '<button title="Edit" class="btn btn-sm btn-primary edit"><span class="fa fa-edit" /></button>';

                res.push([value, date_sold, customer_name, account_number, model, engine_number, branch, term, numberWithCommas(payment), btn]);
            });
            return Promise.resolve(res);
        }).catch((err) => {
            console.log('err ', err)
            return Promise.resolve(false)
        });
    }
}

export function setAllSoldProducts(products) {
    return {
        type: SET_ALL_SOLD_PRODUCTS,
        data: products
    }
}

export function productsToTransfer(id, secondhand) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');
        let query;

        if (secondhand) {
            query = {
                query: {
                    type: 0,
                    transferred: 0,
                    branch: id,
                    brandNew: 0,
                }
            }
        } else {
            query = {
                query: {
                    type: 0,
                    transferred: 0,
                    branch: id,
                    brandNew: 1,
                }
            }
        }

        return productService.find(query)
            .then((products) => {
                const results = products.data,
                    data = [];

                results.forEach((value, index) => {
                    const brand = value.brands ? value.brands.brand_name : '',
                        modelName = value.motorModels ? value.motorModels.model_name : '',
                        checkBox = '<input type="checkbox" class="select-product">';

                    data.push([value._id, checkBox, modelName, brand, value.color, value.engine_number]);
                });

                return Promise.resolve(data);
            }).catch((err) => {
                console.log('err ', err)
            });

    }
}

export function setProductsToTransfer(data) {
    return {
        type: PRODUCTS_TO_TRANSFER,
        data: data
    }
}

export function startTransfer(data) {
    return (dispatch, getState) => {
        const transferService = feathers.service('transfers'),
            productsService = feathers.service('products'),
            units = data.units;

        return transferService.create(data)
            .then((d) => {
                units.map((v) => {
                    productsService.patch(v, {
                        transferred: 1,
                        transferredTo: data.local_branch,
                        dateTransferred: data.date_transferred
                    }).then(() => {

                    });
                });
                return Promise.resolve(true);
            }).catch((err) => {
                console.log('err ', err)
                return Promise.resolve(false)
            });
    }
}

export function outgoingProducts(v) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');

        return productService.find({
            query: {
                type: 0,
                transferred: {
                    $in: [1, 2]
                },
                branch: v
            }
        }).then((products) => {
            const results = products.data,
                data = [];

            results.forEach((value, index) => {
                const brand = value.brands ? value.brands.brand_name : '',
                    modelName = value.motorModels ? value.motorModels.model_name : '',
                    branch = value.branchTransferred ? value.branchTransferred.branch_name : '',
                    status = value.transferred === 2 ? '<h4 class="badge badge-success">Received</h4>' : '',
                    date_transferred = Moment(value.dateTransferred).format('MM/DD/YYYY');

                data.push([value._id, modelName, brand, value.color, value.chassis_number, branch, date_transferred]);
            });

            return Promise.resolve(data);
        }).catch((err) => {
            console.log('err ', err)
        });
    }
}

export function outgoingProductsFilter(query) {
    return (dispatch, getState) => {
        const productService = feathers.service('products');

        return productService.find({
            query: query
        }).then((products) => {
            const results = products.data,
                data = [];

            results.forEach((value, index) => {
                const brand = value.brands ? value.brands.brand_name : '',
                    modelName = value.motorModels ? value.motorModels.model_name : '',
                    branch = value.branchTransferred ? value.branchTransferred.branch_name : '',
                    status = value.transferred === 2 ? '<h4 class="badge badge-success">Received</h4>' : '',
                    date_transferred = Moment(value.dateTransferred).format('MM/DD/YYYY');

                data.push([value._id, modelName, brand, value.color, value.engine_number, branch, date_transferred]);
            });

            return Promise.resolve(data);
        }).catch((err) => {
            console.log('err ', err)
        });
    }
}

export function setOutgoingProducts(data) {
    return {
        type: OUTGOING_PRODUCTS,
        data: data
    }
}

export function productsToTransferFilter2(data) {
    return (dispatch, getState) => {
        const productsService = feathers.service('products'),
            brand = data.brand,
            model = data.model,
            color = data.color ? (data.color).toUpperCase() : data.color,
            chassis_number = data.chassis_number;
        let query;


        if (brand && !model && !color && !chassis_number) {
            if (brand === 'all') {
                query = {
                    query: {
                        type: 0,
                        transferred: 0,
                    }
                }
            } else {
                query = {
                    query: {
                        brand: brand,
                        type: 0,
                        transferred: 0,
                    }
                }
            }
        }
        if (brand && model && !color && !chassis_number) {

            if (brand === 'all' && model === 'all') {
                query = {
                    query: {
                        type: 0,
                        transferred: 0,
                    }
                }
            }

            if (brand === 'all' && model !== 'all') {
                query = {
                    query: {
                        model: model,
                        type: 0,
                        transferred: 0,
                    }
                }
            }

            if (brand !== 'all' && model === 'all') {
                query = {
                    query: {
                        brand: brand,
                        type: 0,
                        transferred: 0,
                    }
                }
            }
        }
        if (brand && !model && color && !chassis_number) {

            if (brand === 'all') {
                query = {
                    query: {
                        color: color,
                        type: 0,
                        transferred: 0,
                    }
                }
            } else {
                query = {
                    query: {
                        brand: brand,
                        color: color,
                        type: 0,
                        transferred: 0,
                    }
                }
            }
        }
        if (brand && !model && !color && chassis_number) {
            if (brand === 'all') {
                query = {
                    query: {
                        chassis_number: chassis_number,
                        type: 0,
                        transferred: 0,
                    }
                }
            } else {
                query = {
                    query: {
                        brand: brand,
                        chassis_number: chassis_number,
                        type: 0,
                        transferred: 0,
                    }
                }
            }
        }

        if (!brand && model && !color && !chassis_number) {
            if (model === 'all') {
                query = {
                    query: {
                        type: 0,
                        transferred: 0,
                    }
                }
            } else {
                query = {
                    query: {
                        model: model,
                        type: 0,
                        transferred: 0,
                    }
                }
            }
        }
        if (!brand && model && !color && chassis_number) {
            if (model === 'all') {
                query = {
                    query: {
                        chassis_number: chassis_number,
                        type: 0,
                        transferred: 0,
                    }
                }
            } else {
                query = {
                    query: {
                        model: model,
                        chassis_number: chassis_number,
                        type: 0,
                        transferred: 0,
                    }
                }
            }
        }
        if (!brand && model && color && !chassis_number) {
            if (model === 'all') {
                query = {
                    query: {
                        color: color,
                        type: 0,
                        transferred: 0,
                    }
                }
            } else {
                query = {
                    query: {
                        model: model,
                        color: color,
                        type: 0,
                        transferred: 0,
                    }
                }
            }
        }

        if (!brand && !model && color && !chassis_number) {
            if (color === 'all') {
                query = {
                    query: {
                        type: 0,
                        transferred: 0,
                    }
                }
            } else {
                query = {
                    query: {
                        color: color,
                        type: 0,
                        transferred: 0,
                    }
                }
            }
        }
        if (!brand && !model && color && chassis_number) {
            query = {
                query: {
                    color: color,
                    chassis_number: chassis_number,
                    type: 0,
                    transferred: 0,
                }
            }
        }

        if (!brand && !model && !color && chassis_number) {
            if (chassis_number === 'all') {
                query = {
                    query: {
                        type: 0,
                        transferred: 0,
                    }
                }
            } else {
                query = {
                    query: {
                        chassis_number: chassis_number,
                        type: 0,
                        transferred: 0,
                    }
                }
            }
        }

        if (brand && model && color && !chassis_number) {

            if (brand === 'all' && model === 'all') {
                query = {
                    query: {
                        color: color,
                        type: 0,
                        transferred: 0,
                    }
                }
            } else if (brand !== 'all' && model === 'all') {
                query = {
                    query: {
                        brand: brand,
                        color: color,
                        type: 0,
                        transferred: 0,
                    }
                }
            } else if (brand === 'all' && model !== 'all') {
                query = {
                    query: {
                        model: model,
                        color: color,
                        type: 0,
                        transferred: 0,
                    }
                }
            } else {
                query = {
                    query: {
                        brand: brand,
                        model: model,
                        color: color,
                        type: 0,
                        transferred: 0,
                    }
                }
            }
        }

        if (brand && model && !color && chassis_number) {

            if (brand === 'all' && model === 'all') {
                query = {
                    query: {
                        chassis_number: chassis_number,
                        type: 0,
                        transferred: 0,
                    }
                }
            } else if (brand === 'all' && model !== 'all') {
                query = {
                    query: {
                        model: model,
                        chassis_number: chassis_number,
                        type: 0,
                        transferred: 0,
                    }
                }
            } else if (brand !== 'all' && model === 'all') {
                query = {
                    query: {
                        brand: brand,
                        chassis_number: chassis_number,
                        type: 0,
                        transferred: 0,
                    }
                }
            } else {
                query = {
                    query: {
                        brand: brand,
                        model: model,
                        chassis_number: chassis_number,
                        type: 0,
                        transferred: 0,
                    }
                }
            }
        }

        if (!brand && model && color && chassis_number) {
            if (model === 'all') {
                query = {
                    query: {
                        color: color,
                        chassis_number: chassis_number,
                        type: 0,
                        transferred: 0,
                    }
                }
            } else {
                query = {
                    query: {
                        model: model,
                        color: color,
                        chassis_number: chassis_number,
                        type: 0,
                        transferred: 0,
                    }
                }
            }
        }

        if (brand && model && color && chassis_number) {
            if (brand === 'all' && model === 'all') {
                query = {
                    query: {
                        color: color,
                        chassis_number: chassis_number,
                        type: 0,
                        transferred: 0,
                    }
                }
            } else if (brand === 'all' && model !== 'all') {
                query = {
                    query: {
                        model: model,
                        color: color,
                        chassis_number: chassis_number,
                        type: 0,
                        transferred: 0,
                    }
                }
            } else if (brand !== 'all' && model === 'all') {
                query = {
                    query: {
                        brand: brand,
                        color: color,
                        chassis_number: chassis_number,
                        type: 0,
                        transferred: 0,
                    }
                }
            } else {
                query = {
                    query: {
                        brand: brand,
                        model: model,
                        color: color,
                        chassis_number: chassis_number,
                        type: 0,
                        transferred: 0,
                    }
                }
            }
        }

        return productsService.find(query)
            .then((products) => {
                const results = products.data,
                    output = [];

                results.forEach((value, index) => {
                    const brand = value.brands ? value.brands.brand_name : '',
                        modelName = value.motorModels ? value.motorModels.model_name : '',
                        checkBox = '<input type="checkbox" class="select-product">';

                    output.push([value._id, checkBox, modelName, brand, value.color, value.chassis_number]);
                });

                return Promise.resolve(output);
            }).catch((err) => {
                console.log('err ', err)
            })
    }
}

export function productsToTransferFilter(query, secondhand) {
    return (dispatch, getState) => {
        const productsService = feathers.service('products')

        if (secondhand) {
            query.brandNew = 0;
        } else {
            query.brandNew = 1;
        }

        return productsService.find({
            query: query
        }).then((products) => {
            const results = products.data,
                output = [];

            results.forEach((value, index) => {
                const brand = value.brands ? value.brands.brand_name : '',
                    modelName = value.motorModels ? value.motorModels.model_name : '',
                    checkBox = '<input type="checkbox" class="select-product">';

                output.push([value._id, checkBox, modelName, brand, value.color, value.engine_number]);
            });

            return Promise.resolve(output);
        }).catch((err) => {
            console.log('err ', err)
            const data = [];
            return Promise.resolve(data);
        });
    }
}

export function productInfo(data) {
    return {
        type: PRODUCT_INFO,
        data: data
    }
}

export function updateUnitInfo(data) {
    return {
        type: UPDATE_UNIT_INFO,
        data: data
    }
}

export function findChassisUsingBrand(brand) {
    return (dispatch, getState) => {
        let query;

        if (brand) {
            query = {
                query: {
                    brand: brand
                }
            }
        } else {
            query = ''
        }

        return feathers.service('motorcycle-models').find(query)
            .then((d) => {
                let data = [];
                data = d;
                return Promise.resolve(data)
            })
            .catch((e) => {
                console.log(e)
                return Promise.resolve(false)
            })
    }
}

export function findChassisUsingModel(model) {
    return (dispatch, getState) => {

        const branch = getState().login.userData.branch_info._id;

        return feathers.service('products').find({
            query: {
                model: model,
                type: 0,
                branch: branch,
                transferred: {
                    $nin: [1, 2]
                }
            }
        }).then((d) => {
            let data = [];
            data = d;

            return Promise.resolve(data)
        }).catch((e) => {
            console.log(e)
            return Promise.resolve(false)
        })
    }
}

export function duplicateProducts() {
    return (dispatch, getState) => {
        const productsService = feathers.service('products');

        return productsService.find({
            query: {
                deletedInBranch: {
                    $ne: 1
                }
            }
        }).then((data) => {
            const arr = data.data,
                output = [];

            const existedRows = {}, updatedData = [];
            arr.map(function (a) {
                const key = a.model + '_~_' + a.chas;
                const keys = Object.keys(existedRows);

                if (keys.indexOf(key) === -1) {
                    existedRows[key] = 1
                } else {
                    existedRows[key] = existedRows[key] + 1
                }
            });
            arr.map(function (a) {
                const key = a.model + '_~_' + a.chas;
                if (existedRows[key] > 1) {
                    updatedData.push(a);
                }
            });

            updatedData.forEach((value, index) => {
                const brand = value.brands ? value.brands.brand_name : '',
                    modelName = value.motorModels ? value.motorModels.model_name : '',
                    branch = value.branches ? value.branches.branch_name : '',
                    status = value.transferred === 2 ? '<h4 class="badge badge-success">Received</h4>' : '',
                    date_transferred = Moment(value.dateTransferred).format('MM/DD/YYYY'),
                    button = '<button title="Delete" class="btn btn-sm btn-danger delete"><span class="fa fa-trash" /></button> ';

                output.push([value._id, modelName, value.chas, branch, button]);
            });

            return Promise.resolve(output)
        })
            .catch((err) => {
                console.log('err ', err)
            })

    }
}


export function duplicateEngineProducts(chassis) {
    return (dispatch, getState) => {
        const productsService = feathers.service('products');

        return productsService.find({
            query: {
                deletedInBranch: {
                    $ne: 1
                }
            }
        }).then((data) => {
            const arr = data.data,
                output = [];

            const existedRows = {}, updatedData = [];
            arr.map(function (a) {
                const key = a.model + '_~_' + a.engine_number;
                const keys = Object.keys(existedRows);

                if (keys.indexOf(key) === -1) {
                    existedRows[key] = 1
                } else {
                    existedRows[key] = existedRows[key] + 1
                }
            });
            arr.map(function (a) {
                const key = a.model + '_~_' + a.engine_number;
                if (existedRows[key] > 1) {
                    updatedData.push(a);
                }
            });


            updatedData.forEach((value, index) => {
                const brand = value.brands ? value.brands.brand_name : '',
                    modelName = value.motorModels ? value.motorModels.model_name : '',
                    branch = value.branches ? value.branches.branch_name : '',
                    status = value.transferred === 2 ? '<h4 class="badge badge-success">Received</h4>' : '',
                    date_transferred = Moment(value.dateTransferred).format('MM/DD/YYYY'),
                    button = '<button title="Delete" class="btn btn-sm btn-danger delete"><span class="fa fa-trash" /></button> ';

                output.push([value._id, modelName, value.engine_number, branch, button]);
            });

            return Promise.resolve(output)
        }).catch((err) => {
            console.log('err ', err)
        })

    }
}

export function getTotalCash() {
    return (dispatch, getState) => {
        const customerService = feathers.service('customers');


        return customerService.find({
            query: {
                type: 0
            }
        }).then((customer) => {
            const results = customer.data,
                output = [];
            let total = 0;

            results.forEach((value, index) => {
                const model = value.unit_model,
                    payment = value.payment;

                output.push([model, numberWithCommas(payment)]);
                total += payment;
            });

            output.extra = numberWithCommas(total);

            return Promise.resolve(output);

        }).catch((err) => {
            console.log('err ', err)
        })

    }
}

export function getTotalInstallment() {
    return (dispatch, getState) => {
        const customerService = feathers.service('customers');


        return customerService.find({
            query: {
                type: 1
            }
        }).then((customer) => {
            const results = customer.data,
                output = [];
            let total = 0;

            results.forEach((value, index) => {
                const model = value.unit_model,
                    payment = value.payment;

                output.push([model, numberWithCommas(payment)]);
                total += payment;
            });

            output.extra = numberWithCommas(total);

            return Promise.resolve(output);

        }).catch((err) => {
            console.log('err ', err)
        })

    }
}

export function getPaymentsList() {
    return (dispatch, getState) => {
        const paymentService = feathers.service('payment')

        return paymentService.find()
            .then((payment) => {
                const results = payment.data,
                    output = [];

                results.forEach((value, index) => {
                    const supplier_name = value.supplier_name ? value.supplier_name : '',
                        receipt_number = value.receipt_number ? value.receipt_number : '',
                        amount = value.amount ? value.amount : '',
                        date_paid = value.date_paid,
                        remarks = value.remarks ? value.remarks : ''

                    output.push([value, supplier_name, receipt_number, numberWithCommas(amount), Moment(date_paid).format('MM/DD/YYYY'), remarks]);
                });

                return Promise.resolve(output);
            }).catch(() => {
                const data = [];
                return Promise.resolve(data)
            })
    }
}

export function filterPaymentsList(query) {
    return (dispatch, getState) => {
        const paymentService = feathers.service('payment')

        return paymentService.find({
            query: query
        }).then((payment) => {
            const results = payment.data,
                output = [];

            results.forEach((value, index) => {
                const supplier_name = value.supplier_name ? value.supplier_name : '',
                    receipt_number = value.receipt_number ? value.receipt_number : '',
                    amount = value.amount ? value.amount : '',
                    date_paid = value.date_paid,
                    remarks = value.remarks ? value.remarks : ''

                output.push([value, supplier_name, receipt_number, numberWithCommas(amount), Moment(date_paid).format('MM/DD/YYYY'), remarks]);
            });

            return Promise.resolve(output);
        }).catch(() => {
            const data = [];
            return Promise.resolve(data)
        })
    }
}

export function setModelsForSecondhand(data) {
    return {
        type: MODELS_FOR_SECONDHAND_UNITS,
        data: data
    }
}


export function getSecondhandUnits() {
    return (dispatch, getState) => {
        const secondhandService = feathers.service('secondhand')

        return secondhandService.find()
            .then((result) => {
                const d = result.data,
                    output = [];

                d.map((value) => {
                    output.push([
                        value,
                        value.model.name,
                        value.engine_number,
                        value.date_added_custom,
                        numberWithCommas(value.selling_price),
                        value.branch_info.branch_name,
                        '<button title="Edit" class="btn btn-sm btn-primary edit"><span class="fa fa-edit" /></button> ' +
                        '<button title="Delete" class="btn btn-sm btn-danger delete"><span class="fa fa-trash" /></button> ' +
                        '<button title="View" class="btn btn-sm btn-warning view"><span class="fa fa-eye" /></button>'
                    ])
                })

                return Promise.resolve(output)
            }).catch((err) => {
                console.log(err)
                return Promise.resolve([])
            })

    }
}

export function secondhandAdvancedFilter(query) {
    return (dispatch, getState) => {
        const secondhandService = feathers.service('secondhand');

        return secondhandService.find({
            query: query
        }).then((result) => {
            const d = result.data,
                output = [];

            d.map((value) => {
                output.push([
                    value,
                    value.model.name,
                    value.engine_number,
                    value.date_added_custom,
                    numberWithCommas(value.selling_price),
                    value.branch_info ? value.branch_info.branch_name : null,
                    '<button title="Edit" class="btn btn-sm btn-primary edit"><span class="fa fa-edit" /></button> ' +
                    '<button title="Delete" class="btn btn-sm btn-danger delete"><span class="fa fa-trash" /></button> ' +
                    '<button title="View" class="btn btn-sm btn-warning view"><span class="fa fa-eye" /></button>'
                ])
            })
            return Promise.resolve(output)
        }).catch((err) => {
            console.log(err)
            return Promise.resolve([])
        })

    }
}

export function secondhandSoldAdvancedFilter(query) {
    return (dispatch, getState) => {
        const secondhandService = feathers.service('secondhand');

        return secondhandService.find({
            query: query
        }).then((result) => {
            const d = result.data,
                output = [];

            d.map((value) => {
                output.push([
                    value,
                    value.model.name,
                    value.engine_number,
                    value.date_added_custom,
                    numberWithCommas(value.selling_price),
                    value.branch_info ? value.branch_info.branch_name : '',
                    '<button title="View" class="btn btn-sm btn-warning view"><span class="fa fa-eye" /></button>'
                ])
            })

            return Promise.resolve(output)
        }).catch((err) => {
            console.log(err)
            return Promise.resolve([])
        })

    }
}

export function forPricing(data) {
    return (dispatch, getState) => {
        dispatch({
            type: FOR_PRICING,
            data: data
        })
    }
}

export function pricesUpdated(data) {
    return (dispatch, getState) => {
        dispatch({
            type: PRICES_UPDATED,
            data: data
        })
    }
}

export function getIncomingProducts(user, pass, branch, secondhand) {
    return (dispatch, getState) => {
        return feathers.service('products').find({
            query: {
                transferred: 1,
                transferredTo: branch,
                brandNew: secondhand ? 0 : 1
            }
        }).then((products) => {
            const results = products.data,
                data = [],
                buttons = '<button class="btn btn-sm btn-warning view-details" title="View">' +
                    '<span class="fa fa-eye" />' +
                    '</button> ' +
                    '<button class="btn btn-sm btn-success accept" title="Accept">' +
                    '<span class="fa fa-check" />' +
                    '</button>';

            results.forEach((value, index) => {
                data.push([
                    value,
                    Moment(value.dateTransferred).format('MMMM DD, YYYY'),
                    value.motorModels ? value.motorModels.model_name : '',
                    value.engine_number,
                    value.branches ? value.branches.branch_name + ' BRANCH' : '',
                    buttons,
                    value]);
            });
            return data;
            // return Promise.resolve(data);
        }).catch((err) => {
            console.log('err', err);
        });
    }
}

export function setIncomingProducts(data) {
    return {
        type: SET_INCOMING_PRODUCTS,
        data: data
    }
}

export function acceptDataId(data) {
    return {
        type: ACCEPT_DATA_ID,
        data: data
    }
}

export function deleteId(data) {
    return (dispatch, getState) => {
        dispatch({
            type: DELETE_ID,
            data: data
        })
    }
}

export function deleteService(data) {
    return (dispatch, getState) => {
        dispatch({
            type: DELETE_SERVICE,
            data: data
        })
    }
}

export function updateSecondhandUnitInfo(data) {
    return {
        type: UPDATE_SECONDHAND_UNIT_INFO,
        data: data
    }
}
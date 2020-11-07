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
    ACCEPT_DATA_ID,
    UPDATE_SECONDHAND_UNIT_INFO,
    DELETE_ID,
    DELETE_SERVICE,
} from 'constants/prev/product'

const initialState = {
    product_list: [],
    selectedModel: null,
    selectedModelSet: [],
    advanced_filter: false,
    productSelect: [],
    selectedColorFilter: 'All',
    selectedModelFilter: {label: 'All', value: 'all'},
    selectedBranchFilter: {label: 'All', value: 'all'},
    selectedBrandFilter: {label: 'All', value: 'all'},
    soldProducts: [],
    productsToTransfer: [],
    outgoingProducts: [],
    productInfo: [],
    updateUnitInfo: [],
    modelsForSeconhandUnits: [],
    unitsForPricing: [],
    pricesUpdated: false,
    acceptDataId: null
}

export default function product(state = initialState, action) {
    switch (action.type) {

        case PRODUCT_LIST:
            return {
                ...state,
                product_list: action.data
            }

        case SELECTED_MODEL:
            return {
                ...state,
                selectedModel: action.data
            }

        case SELECTED_MODEL_SET:
            return {
                ...state,
                selectedModelSet: action.data
            }

        case ADVANCED_FILTER:
            return {
                ...state,
                advanced_filter: action.status
            }


        case SET_ALL_PRODUCTS:
            const products = [],
                dataProducts = action.data;
            dataProducts !== undefined && dataProducts.length > 0 && dataProducts.forEach((value, index) => {
                products.push({
                    value: value[0],
                    label: (value[1] ? value[1].model_name : '') + ' - ' + value[2],
                    modelId: value[1] ? value[1]._id : '',
                    price: value[3],
                    modelName: value[1] ? value[1].model_name : ''
                })
            });
            return {
                ...state,
                productSelect: products
            }

        case SELECTED_FILTERS:
            return {
                ...state,
                selectedColorFilter: action.color ? ((action.color).toLowerCase() === 'all' ? 'All' : action.color) : 'All',
                selectedModelFilter: action.model ? action.model : {label: 'All', value: 'all'},
                selectedBranchFilter: action.branch ? action.branch : {label: 'All', value: 'all'},
                selectedBrandFilter: action.brand ? action.brand : {label: 'All', value: 'all'},

            }

        case SET_ALL_SOLD_PRODUCTS:
            return {
                ...state,
                soldProducts: action.data,

            }

        case PRODUCTS_TO_TRANSFER:
            return {
                ...state,
                productsToTransfer: action.data
            }

        case OUTGOING_PRODUCTS:
            return {
                ...state,
                outgoingProducts: action.data
            }

        case PRODUCT_INFO:
            return {
                ...state,
                productInfo: action.data
            }

        case UPDATE_UNIT_INFO:
            return {
                ...state,
                updateUnitInfo: action.data
            }

        case MODELS_FOR_SECONDHAND_UNITS:
            return {
                ...state,
                modelsForSecondhandUnits: action.data
            }

        case FOR_PRICING:
            return {
                ...state,
                unitsForPricing: action.data
            }

        case PRICES_UPDATED:
            return {
                ...state,
                pricesUpdated: action.data
            }


        case ACCEPT_DATA_ID:
            return {
                ...state,
                acceptDataId: action.data
            }

        case UPDATE_SECONDHAND_UNIT_INFO:
            return {
                ...state,
                updateSecondhandUnitInfo: action.data
            }

        case DELETE_ID:
            return {
                ...state,
                deleteId: action.data
            }

        case DELETE_SERVICE:
            return {
                ...state,
                deleteService: action.data
            }

        default:
            return state;
    }
}
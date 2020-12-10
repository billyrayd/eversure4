import {
	ADD_MODEL,
    MODEL_DATATABLES,
    UPDATE_MODEL_INFO,
    BRANCH_DATATABLES,
    BRAND_DATATABLES,
    POSITIONS_DATATABLES,
    UPDATE_BRANCH_INFO,
    UPDATE_BRAND_INFO,
    UPDATE_DESIGNATION_INFO,
} from 'constants/prev/category'

const initialState = {
	add_model_status: '',
    modelsList: [],
        modelsSelect: [],
    branchesList: [],
        branchesSelect: [],
    brandsList: [],
        brandsSelect: [],
    positionsList: [],
        positionsSelect: [],
    updateModelInfo: [],
    updateBranchInfo: {
        id: null,
        name: ''
    },
    updateBrandInfo: {
        id: null,
        name: ''
    },
    updateDesignationInfo: {
        id: null,
        name: ''
    }
    
}

export default function category(state = initialState, action) {
    switch (action.type) {

        case MODEL_DATATABLES:
            var models = [{
                value: 'all',
                label: ' ALL'
            }],
            dataModels = action.data;
            if(dataModels !== undefined && dataModels.length){
                dataModels.forEach((value, index) => {
                    models.push({
                        value: value[0],
                        label: value[2],
                        brand: value[1]
                    })
                });
            }

            let model_sort1 = models

            model_sort1.sort(function(a, b){
                if(a.label < b.label) { return -1; }
                if(a.label > b.label) { return 1; }
                return 0;
            })
        return {
            ...state,
            modelsList: action.data,
            modelsSelect: model_sort1
        }
        break;

        case ADD_MODEL:
        return {
            ...state,
            modelsList: state.modelsList.push(action.data)
        }
        break;

        case BRANCH_DATATABLES:
        var branches = [],
        dataBranches = action.data;
        dataBranches !== undefined && dataBranches.length > 0 && dataBranches.forEach((value, index) => {
            branches.push({
                value: value[0],
                label: value[2]
            })
        });
        let branch_sort = branches;
        branch_sort.sort(function(a, b){
            if(a.label < b.label) { return -1; }
            if(a.label > b.label) { return 1; }
            return 0;
        })
        return {
            ...state,
            branchesList: action.data,
            branchesSelect: branch_sort
        }
        break;

        case BRAND_DATATABLES:
        var brands = [{
                value: 'all',
                label: ' ALL'
            }],
            dataBrands = [];

        dataBrands = action.data;

        dataBrands!== undefined && dataBrands.length && dataBrands.forEach((value, index) => {
            brands.push({
                value: value[0],
                label: value[2],
                branch: value[3],
            })
        });

        let brand_sort1 = action.data,
            brand_sort2 = brands;

        brand_sort1 && brand_sort1.sort(function(a, b){
            if(a.firstname < b.firstname) { return -1; }
            if(a.firstname > b.firstname) { return 1; }
            return 0;
        })

        brand_sort2 && brand_sort2.sort(function(a, b){
            if(a.label < b.label) { return -1; }
            if(a.label > b.label) { return 1; }
            return 0;
        })

        return {
            ...state,
            brandsList: action.data,
            brandsSelect: brand_sort2,
        }
        break;

        case POSITIONS_DATATABLES:
        var positions = [],
            dataPositions = action.data;
        dataPositions.forEach((value, index) => {
            positions.push({
                value: value[0],
                label: value[2]
            })
        });
        return {
            ...state,
            positionsList: action.data,
            positionsSelect: positions
        }
        break;

        case  UPDATE_MODEL_INFO:
        return {
            ...state,
            updateModelInfo: action.data
        }

        case  UPDATE_BRANCH_INFO:
        return {
            ...state,
            updateBranchInfo: action.data
        }

        case  UPDATE_BRAND_INFO:
        return {
            ...state,
            updateBrandInfo: action.data
        }

        case  UPDATE_DESIGNATION_INFO:
        return {
            ...state,
            updateDesignationInfo: action.data
        }

        default: return state;
  }
}
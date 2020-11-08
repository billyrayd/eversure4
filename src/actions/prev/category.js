import {
    ADD_MODEL,
    MODEL_DATATABLES,
    PRODUCT_LIST,
    UPDATE_MODEL_INFO,
    BRANCH_DATATABLES,
    BRAND_DATATABLES,
    POSITIONS_DATATABLES,
    UPDATE_BRANCH_INFO,
    UPDATE_BRAND_INFO,
    UPDATE_DESIGNATION_INFO,
} from 'constants/prev/category';

import feathers from 'helpers/feathers'

const _user = 'stratium', _pass = 'unitb1ts'

/* ================ models actions ================ */

export function addModel(modelName, branch, brand) {
    return (dispatch, getState) => {
        var modelService = feathers.service('motorcycle-models');

        return modelService.find({
            query: {
                model_name: modelName,
                localbranch_id: branch,
                brand: brand
            }
        }).then((model) => {
            if (model.total) {
                return Promise.resolve('exist');
            } else {
                return modelService.create({
                    model_name: modelName,
                    localbranch_id: branch,
                    brand: brand
                }).then((res) => {
                    return Promise.resolve('success');
                }).catch((err) => {
                    console.log('err', err);
                    if ((err.message).includes('already exists')) {
                        return Promise.resolve('exist');
                    } else {
                        return Promise.resolve('failed');
                    }
                });
            }
        }).catch((err) => {
            console.log('err', err);
        });

    }
}


//category management models
export function GetCategoryModels() {
    return (dispatch, getState) => {
        const modelService = feathers.service('motorcycle-models');
        return modelService.find().then((models) => {
            if(models.data.length > 0){
                const results = models.data,
                    data = [];
                results.forEach((value, index) => {
                    const branch = value.branch ? value.branch.branch_name : 'no branch';
                    const actionBtn = '<button class="btn btn-sm btn-primary edit"><span class="fa fa-edit" /></button> <button class="btn btn-sm btn-danger delete" data-toggle="modal" data-target="#confirm_model_delete1"><span class="fa fa-trash" /> </button>';
                    data.push([value._id, index + 1, value.model_name, value.brand_details.brand_name, actionBtn, value]);
                });

                dispatch(SetModels(data))
                return Promise.resolve(data);
            }else{
                return Promise.resolve(false);
            }
        }).catch((err) => {
            return Promise.resolve(false);
        })
    }
}

export function deleteModel(id) {
    return (dispatch, getState) => {
        var modelService = feathers.service('motorcycle-models');

        modelService.remove(id).then((data) => {
            console.log('data', data)
        });
    }
}

export function SetModels(data) {
    return {
        type: MODEL_DATATABLES,
        data: data
    }
}

export function modelUpdateInfo(data) {
    return {
        type: UPDATE_MODEL_INFO,
        data: data
    }
}

export function updateModel(id, query) {
    return (dispatch, getState) => {
        var modelService = feathers.service('motorcycle-models');

        return modelService.patch(id, query)
            .then((data) => {
                console.log('data ', data)
                return Promise.resolve(true)
            })
            .catch((error) => {
                return Promise.resolve(false)
            });

    }
}

export function modelInUse(data) {
    return (dispatch, getState) => {
        var Service = feathers.service('products');

        return Service.find({
            query: {
                model: data
            }
        })
            .then((data) => {
                if (data.total) {
                    return Promise.resolve(true)
                } else {
                    return Promise.resolve(false)
                }
            })
            .catch(() => {
                return Promise.resolve(false)
            })
    }
}

/* ================ closing models actions ================ */


/* ================  branch actions ================ */

export function GetAllBranches() {
    return (dispatch, getState) => {
        var branchService = feathers.service('branches');

        return branchService.find().then((branches) => {
            if(branches.data.length > 0){
                var results = branches.data,
                    data = [];

                results.forEach((value, index) => {
                    var actionBtn = '<button class="btn btn-sm btn-primary edit"><span class="fa fa-edit" /></button> <button class="btn btn-sm btn-danger delete" data-toggle="modal" data-target="#confirm_branch_delete1"><span class="fa fa-trash" /> </button>';
                    data.push([value._id, index + 1, value.branch_name, actionBtn]);
                });

                dispatch(SetBranches(data));

                return Promise.resolve(data);
            }else{
                return Promise.resolve(false);
            }
        }).catch((err) => {
            return Promise.resolve(false);
        })
    }
}

export function AddBranch(branchName) {
    return (dispatch, getState) => {
        var branchService = feathers.service('branches');


        return branchService.find({
            query: {
                branch_name: branchName
            }
        })
        .then((result) => {
            if(result.data.length > 0){
                return Promise.resolve('exist');
            }else{
                return branchService.create({
                    branch_name: branchName
                }).then((result) => {
                    return Promise.resolve('success');
                }).catch((err) => {
                    if ((err.message).includes('already exists')) {
                        return Promise.resolve('exist');
                    } else {
                        return Promise.resolve(false);
                    }
                });
            }
        })
        .catch(() => {
            return Promise.resolve(false);
        })

        
    }
}

export function SetBranches(data) {
    return {
        type: BRANCH_DATATABLES,
        data: data
    }
}

export function deleteBranch(id) {
    return (dispatch, getState) => {
        var branchService = feathers.service('branches');

        branchService.remove(id).then((data) => {
            console.log('data', data)
        });
    }
}

export function branchUpdateInfo(data) {
    return {
        type: UPDATE_BRANCH_INFO,
        data: data
    }
}

export function updateBranch(id, name) {
    return (dispatch, getState) => {
        var branchService = feathers.service('branches');

        return branchService.patch(id, {branch_name: name})
            .then((data) => {
                return Promise.resolve(true)
            })
            .catch((error) => {
                return Promise.resolve(false)
            });

    }
}
/* ================  closing branch actions ================ */

/* ================  brand actions ================ */
export function GetAllBrands() {
    return (dispatch, getState) => {
        const brandsService = feathers.service('brands');
        return brandsService.find().then((brands) => {
            if(brands.data.length > 0){
                const results = brands.data,
                    data = [];
                results.forEach((value, index) => {
                    const branch = value.branch ? value.branch.branch_name : 'No branch';
                    const actionBtn = '<button class="btn btn-sm btn-primary edit"><span class="fa fa-edit" /></button> <button class="btn btn-sm btn-danger delete" data-toggle="modal" data-target="#confirm_brand_delete1"><span class="fa fa-trash" /> </button>';
                    data.push([value._id, index + 1, value.brand_name, actionBtn]);
                });

                dispatch(SetBrands(data))

                return Promise.resolve(data);
            }else{
                return Promise.resolve(false);
            }
        }).catch((err) => {
            return Promise.resolve(false);
        })
    }
}

export function getAllBrandsWithoutBranchName() {
    return (dispatch, getState) => {
        const brandsService = feathers.service('brands');
        return brandsService.find().then((brands) => {
            const results = brands.data,
                data = [];
            results.forEach((value, index) => {
                const branch = value.branch ? value.branch.branch_name : 'No branch';
                const actionBtn = '<button class="btn btn-sm btn-primary edit"><span class="fa fa-edit" /></button> <button class="btn btn-sm btn-danger delete" data-toggle="modal" data-target="#confirm_brand_delete1"><span class="fa fa-trash" /> </button>';
                data.push([value._id, index + 1, value.brand_name, actionBtn]);
            });
            return Promise.resolve(data);
        }).catch((err) => {

        })
    }
}

export function addBrands(brandName, branch) {
    return (dispatch, getState) => {
        var brandsService = feathers.service('brands');

        return feathers.authenticate({
            strategy: 'local',
            username: _user,
            password: _pass,
        })
            .then((a) => {
                return brandsService.find({
                    query: {
                        brand_name: brandName,
                        localbranch_id: branch
                    }
                })
                    .then((data) => {
                        if (data.total) {
                            return Promise.resolve('exist');
                        } else {
                            return brandsService.create({
                                brand_name: brandName,
                                localbranch_id: branch
                            }).then((result) => {
                                return Promise.resolve('success');
                            }).catch((err) => {
                                if ((err.message).includes('already exists')) {
                                    return Promise.resolve('exist');
                                } else {
                                    return Promise.resolve('failed');
                                }
                            });
                        }
                    })
                    .catch((e) => {
                        console.log(e)
                        return Promise.resolve('failed')
                    })
            })
    }
}

export function SetBrands(data) {
    return {
        type: BRAND_DATATABLES,
        data: data
    }
}

export function deleteBrand(id) {
    return (dispatch, getState) => {
        var brandService = feathers.service('brands');

        brandService.remove(id).then((data) => {
            console.log('data', data)
        });
    }
}

export function brandUpdateInfo(data) {
    return {
        type: UPDATE_BRAND_INFO,
        data: data
    }
}

export function updateBrand(id, name) {
    return (dispatch, getState) => {
        var branchService = feathers.service('brands');

        return branchService.patch(id, {brand_name: name})
            .then((data) => {
                return Promise.resolve(true)
            })
            .catch((error) => {
                return Promise.resolve(false)
            });

    }
}

export function brandInUse(data) {
    return (dispatch, getState) => {
        var Service = feathers.service('products');

        return Service.find({
            query: {
                brand: data
            }
        })
            .then((data) => {
                if (data.total) {
                    return Promise.resolve(true)
                } else {
                    return Promise.resolve(false)
                }
            })
            .catch(() => {
                return Promise.resolve(false)
            })
    }
}


/* ================  closing brands actions ================ */

/* ================  user's position actions ================ */
export function getAllPositions() {
    return (dispatch, getState) => {
        var positionsService = feathers.service('user-position');

        return positionsService.find().then((positions) => {
            var results = positions.data,
                data = [];

            results.forEach((value, index) => {
                var actionBtn = '<button class="btn btn-sm btn-primary edit"><span class="fa fa-edit" /></button> <button class="btn btn-sm btn-danger delete"><span class="fa fa-trash" /> </button>';

                data.push([value._id, index + 1, value.position_type, value.position_type === 'ADMINISTRATOR' ? '<br/>' : actionBtn]);
            });

            return Promise.resolve(data);

        }).catch((err) => {

        })
    }
}

export function addPosition(positionName) {
    return (dispatch, getState) => {
        var brandsService = feathers.service('user-position');

        return brandsService.create({
            position_type: positionName
        }).then((result) => {
            return Promise.resolve('success');
        }).catch((err) => {
            if ((err.message).includes('already exists')) {
                return Promise.resolve('exist');
            } else {
                return Promise.resolve('failed');
            }

        });
    }
}

export function setPositions(data) {
    return {
        type: POSITIONS_DATATABLES,
        data: data
    }
}

export function deletePosition(id) {
    return (dispatch, getState) => {
        var positionService = feathers.service('user-position');

        positionService.remove(id).then((data) => {
            console.log('data', data)
        });
    }
}

export function designationUpdateInfo(data) {
    return {
        type: UPDATE_DESIGNATION_INFO,
        data: data
    }
}

export function updateDesignation(id, name) {
    return (dispatch, getState) => {
        var branchService = feathers.service('user-position');

        return branchService.patch(id, {position_type: name})
            .then((data) => {
                return Promise.resolve(true)
            })
            .catch((error) => {
                return Promise.resolve(false)
            });

    }
}

export function positionInUse(data) {
    return (dispatch, getState) => {
        var Service = feathers.service('users');

        return Service.find({
            query: {
                type: data
            }
        })
            .then((data) => {
                if (data.total) {
                    return Promise.resolve(true)
                } else {
                    return Promise.resolve(false)
                }
            })
            .catch(() => {
                return Promise.resolve(false)
            })
    }
}


/* ================  user's branches actions ================ */



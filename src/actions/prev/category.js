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

export function AddModel(modelName, brand) {
    return (dispatch, getState) => {
        var modelService = feathers.service('motorcycle-models');
        let output = {};

        return modelService.find({
            query: {
                model_name: modelName,
                // localbranch_id: branch,
                brand: brand
            }
        }).then((model) => {
            if (model.total) {
                output.status = false;
                output.message = `The model ${modelName} already exists`;
                return Promise.resolve(output);
            } else {
                return modelService.create({
                    model_name: modelName,
                    // localbranch_id: branch,
                    brand: brand
                }).then((res) => {
                    output.status = true;
                    output.message = "Model successfully added";
                    return Promise.resolve(output);
                }).catch((err) => {
                    console.log('err', err);
                    if ((err.message).includes('already exists')) {
                        output.status = false;
                        output.message = `The model ${modelName} already exists`;
                    } else {
                        output.status = false;
                        output.message = `Failed to add model`;
                    }
                    return Promise.resolve(output);
                });
            }
        }).catch((err) => {
            console.log('err', err);
            output.status = false;
            output.message = `Failed to add model`;
            return Promise.resolve(output);
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

export function deleteModelOld(id) {
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

export const UpdateModel = (modelId,modelName,brandId) => {
    return (dispatch,getState) => {
        let Service = feathers.service("motorcycle-models");
        let output = {};

        return Service.find({
            query: {
                model_name: modelName,
                brand: brandId
            }
        }).then((model) => {
            if (model.total) {
                output.status = false;
                output.message = `The model ${modelName} already exists`;
                return Promise.resolve(output);
            } else {
                return Service.patch(modelId,{model_name: modelName,brand: brandId})
                .then((res) => {
                    output.status = true;
                    output.message = "Model successfully updated";
                    return Promise.resolve(output);
                }).catch((err) => {
                    console.log('err', err);
                    if ((err.message).includes('already exists')) {
                        output.status = false;
                        output.message = `The model ${modelName} already exists`;
                    } else {
                        output.status = false;
                        output.message = `Failed to update model`;
                    }
                    return Promise.resolve(output);
                });
            }
        }).catch((err) => {
            console.log('err', err);
            output.status = false;
            output.message = `Failed to update model`;
            return Promise.resolve(output);
        });
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

export function DeleteModel(id) {
    return (dispatch, getState) => {
        var Service = feathers.service('motorcycle-models');

        return Service.remove(id)
        .then(() => {
            return Promise.resolve(true);
        })
        .catch((err) => {
            return Promise.resolve(false);
        });
    }
}

export function ModelNotInUse(modelId) {
    return (dispatch, getState) => {
        var Service = feathers.service('products');
        let output = {};

        return Service.find({
            query: {
                model: modelId
            }
        })
        .then((data) => {
            if (data.total) {
                output.status = false;
                output.message = "Model could not be deleted. <br /> It is still in use";
                return Promise.resolve(output);
            } else {
                output.status = true;
                return Promise.resolve(output);
            }
        })
        .catch(() => {
            output.status = false;
            output.message = "An error occured. Please try again";
            return Promise.resolve(output);
        })
    }
}

/* ================ closing models actions ================ */


/* ================  branch actions ================ */

export function GetAllBranches() {
    return (dispatch, getState) => {
        var branchService = feathers.service('branches');
        let query = {};
        let { userData } = getState().login;
        let session = {
            branchId: userData.branch_info._id,
            branchName: userData.branch_info.branch_name,
        }

        if(session.branchName !== "MAIN"){
            query.branch_name = {
                $ne: "MAIN"
            }
        }

        return branchService.find({query: query}).then((branches) => {
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

export const UpdateBranch = (id,branchName) => {
    return (dispatch, getState) => {
        var branchService = feathers.service('branches');
        let output = {};

        return branchService.find({
            query: {
                branch_name: branchName
            }
        })
        .then((result) => {
            if(result.data.length > 0){
                output.status = false;
                output.message = `The branch ${branchName} already exists`;
                return Promise.resolve(output);
            }else{
                return branchService.patch(id, {branch_name: branchName}).then((result) => {
                    output.status = true;
                    output.message = `Branch name successfully updated`;
                    return Promise.resolve(output);
                }).catch((err) => {
                    if ((err.message).includes('already exists')) {
                        output.status = false;
                        output.message = `The branch ${branchName} already exists`;
                    } else {
                        output.status = false;
                        output.message = `Failed to update branch`;
                    }
                    return Promise.resolve(output);
                });
            }
        })
        .catch(() => {
            output.status = false;
            output.message = `Failed to update branch`;
            return Promise.resolve(output);
        })
    }
}

export function DeleteBranch(id) {
    return (dispatch, getState) => {
        var branchService = feathers.service('branches');

        return branchService.remove(id).then((data) => {
            return Promise.resolve(true);
        })
        .catch(() => {
            return Promise.resolve(false);
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
                    dataSelection = [],
                    data = [];
                results.forEach((value, index) => {
                    const branch = value.branch ? value.branch.branch_name : 'No branch';
                    const actionBtn = '<button class="btn btn-sm btn-primary edit"><span class="fa fa-edit" /></button> <button class="btn btn-sm btn-danger delete" data-toggle="modal" data-target="#confirm_brand_delete1"><span class="fa fa-trash" /> </button>';
                    data.push([value._id, index + 1, value.brand_name, actionBtn]);
                    dataSelection.push([value._id, index + 1, value.brand_name, branch]);
                });

                dispatch(SetBrands(dataSelection))

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

export function AddBrand(brandName, branch) {
    return (dispatch, getState) => {
        var brandsService = feathers.service('brands');
        let output = {};

        return brandsService.find({
            query: {
                brand_name: brandName
            }
        })
        .then((res) => {
            if(res.data.length > 0){
                output.status = false;
                output.message = `The brand ${brandName} already exists`;

                return Promise.resolve(output);
            }else{
                return brandsService.create({
                    brand_name: brandName
                })
                .then(() => {
                    output.status = true;
                    output.message = `Brand successfully added`;
                    return Promise.resolve(output);
                })
                .catch(() => {
                    output.status = false;
                    output.message = `Error adding brand. Please try again`;
                    return Promise.resolve(output);
                })
            }
        })
        .catch((err) => {
            output.status = false;
            output.message = `Error adding brand. Please try again`;
            return Promise.resolve(output);
        })
    }
}

export function SetBrands(data) {
    return {
        type: BRAND_DATATABLES,
        data: data
    }
}

export const UpdateBrand = (id,brandName) => {
    return (dispatch, getState) => {
        var brandsService = feathers.service('brands');
        let output = {};

        return brandsService.find({
            query: {
                brand_name: brandName
            }
        })
        .then((res) => {
            if(res.data.length > 0){
                output.status = false;
                output.message = `The brand ${brandName} already exists`;

                return Promise.resolve(output);
            }else{
                return brandsService.patch(id,{brand_name: brandName})
                .then(() => {
                    output.status = true;
                    output.message = `Brand successfully updated`;
                    return Promise.resolve(output);
                })
                .catch(() => {
                    output.status = false;
                    output.message = `Error adding brand. Please try again`;
                    return Promise.resolve(output);
                })
            }
        })
        .catch((err) => {
            output.status = false;
            output.message = `Error adding brand. Please try again`;
            return Promise.resolve(output);
        })
    }
}

export function DeleteBrand(id) {
    return (dispatch, getState) => {
        var brandService = feathers.service('brands');

        return brandService.remove(id).then((data) => {
            return Promise.resolve(true);
        })
        .catch(() => {
            return Promise.resolve(false);
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
                var actionBtn = '';

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

export const GetArea = () => {
    return (dispatch, getState) => {
        let Service = feathers.service("customer-area");
        let data = [];

        return Service.find()
        .then((result) => {
            if(result.data.length > 0){
                let col = result.data;
                col.map((v,i) => {
                    console.log(v)
                    data.push([
                        v,
                        i + 1,
                        v.area_name.name,
                        // '',
                        '',
                    ])
                })

                return Promise.resolve(data);
            }else{
                return Promise.resolve(false);
            }
        })
        .catch((e) => {
            console.log(e)
            return Promise.resolve(false);
        })
    }
}

export const AddArea = (area) => {
    return (dispatch, getState) => {
        let Service = feathers.service("customer-area");
        let output = {};

        return Service.find({
            query: {
                area_name: {
                    name: area
                }
            }
        })
        .then((result) => {
            if(result.data.length > 0){
                output.status = false;
                output.message = `The area ${area} already exists`;
                return Promise.resolve(output);
            }else{
                return Service.create({
                    area_name: {
                        name: area
                    }
                })
                .then(() => {
                    output.status = true;
                    output.message = "Customer area successfully added";
                    return Promise.resolve(output);
                })
                .catch(() => {
                    output.status = false;
                    output.message = "Failed to add customer area";
                    return Promise.resolve(output);
                })
            }
        })
        .catch(() => {
            output.status = false;
            output.message = "Failed to add area";
            return Promise.resolve(output);
        })
    }
}

export const UpdateArea = (id,areaName) => {
    return (dispatch, getState) => {
        let Service = feathers.service("customer-area");
        let output = {};

        return Service.find({
            query: {
                area_name: {
                    name: areaName
                }
            }
        })
        .then((result) => {
            if(result.data.length > 0){
                output.status = false;
                output.message = `The area ${areaName} already exists`;
                return Promise.resolve(output);
            }else{
                return Service.patch(id,{area_name: {name: areaName}})
                .then(() => {
                    output.status = true;
                    output.message = "Customer area successfully updated";
                    return Promise.resolve(output);
                })
                .catch(() => {
                    output.status = false;
                    output.message = "Failed to update customer area";
                    return Promise.resolve(output);
                })
            }
        })
        .catch(() => {
            output.status = false;
            output.message = "Failed to update customer area";
            return Promise.resolve(output);
        })
    }
}

export const DeleteArea = (id) => {
    return (dispatch,getState) => {
        let Service = feathers.service("customer-area");
        return Service.remove(id)
        .then(() => {
            return Promise.resolve(true);
        })
        .catch(() => {
            return Promise.resolve(false);
        })
    }
}



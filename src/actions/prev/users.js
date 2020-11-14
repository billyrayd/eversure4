import {
    USERS_LIST,
    SET_USER_INFO,
    SET_PERMISSION_USER,
    DESIGNATION_LIST,
    SELECTED_USER_PERMISSION,
    ACTIVE_USER_IN_PERMISSION,
    EDIT_USER_INFO,
} from 'constants/prev/users';

import feathers from 'helpers/feathers';

const _user = 'stratium', _pass = 'unitb1ts';

export function addUser(data) {
    return (dispatch, getState) => {
        const userService = feathers.service('users'),
            authService = feathers.service('authentication');

        // return authService.create({
        return feathers.authenticate({
            strategy: 'local',
            username: _user,
            password: _pass
            // username: data.username,
            // password: data.password,
            // fullname: data.fullName,
            // email: data.email,
            // branch: data.branch,
            // type: data.type,
            // address: data.address
        }).then((auth) => {
            return userService.create({
                username: data.username,
                password: data.password,
                fullname: data.fullName,
                email: data.email,
                branch: data.branch,
                type: data.type,
                address: data.address
            }).then((data) => {
                return Promise.resolve('success');
            }).catch((err) => {
                console.log('data', err)
                if ((err.message).includes('email')) {
                    return Promise.resolve('eemail');
                } else if ((err.message).includes('username')) {
                    return Promise.resolve('eusername');
                } else if ((err.message).includes('fullname')) {
                    return Promise.resolve('efullname');
                } else {
                    return Promise.resolve(false);
                }
            });
        }).catch((err) => {
            console.log('data', err)
            return Promise.resolve(false);
        });
    }
}

export const userNameExists = (username) => {
    return (dispatch, getState) => {
        let output = {};
        return feathers.service("users").find({
            query: {
                username: username
            }
        })
        .then((result) => {
            if(result.data.length > 0){
                output.status = true;
                output.message = "Username already exists";
            }else{
                output.status = false;
                output.message = "";
            }

            return Promise.resolve(output)
        })
        .catch((error) => {
            output.status = true;
            output.message = "An error occured";
            output.data = error;

            return Promise.resolve(output)
        })
    }
} 

export function getCheckEmailIfExist(email) {
    return (dispatch, getState) => {
        const userService = feathers.service('users');
        let query = {
            query: {
                username: {
                    $nin: ['test2', 'stratium']
                },
                status: {
                    $ne: 0
                }
            }
        };
        return userService.find(query).then((users) => {
            let exist = false;
            const results = users.data;
            if (users.total > 0) {
                results.forEach((value, index) => {
                    if (value.email === email) {
                        exist = true;
                    }
                });
            } else {
                return Promise.resolve(false)
            }
            return Promise.resolve(exist);
        }).catch((err) => {
            return Promise.resolve([]);
        });
    }
}

export function GetAllUsers(branch_name, branch) {
    return (dispatch, getState) => {
        const userService = feathers.service('users');
        let query;
        if (branch_name !== 'MAIN') {
            query = {
                query: {
                    username: {
                        $nin: ['test2', 'stratium']
                    },
                    status: {
                        $ne: 0
                    },
                    branch: branch
                }
            }
        } else {
            query = {
                query: {
                    username: {
                        $nin: ['test2', 'stratium']
                    },
                    status: {
                        $ne: 0
                    }
                }
            }
        }
        return userService.find(query).then((users) => {
            const results = users.data,
                usersData = [];

            if (users.total > 0) {
                results.forEach((value, index) => {
                    // const branches = value.branches ? value.branches.branch_name : 'None'
                    const branches = (value.branch_info ? value.branch_info.branch_name : 'None'),
                        // position = value.user_position_info ? value.user_position_info[0].position_type : 'None';
                        position = value.user_position_info ? value.user_position_info.position_type : 'None';
                    const actionBtn = '<button class="btn btn-sm btn-info view"><span class="fa fa-eye" /> </button> ' +
                        '<button class="btn btn-sm btn-primary edit"><span class="fa fa-edit" /></button>' +
                        ' <button class="btn btn-sm btn-danger delete"><span class="fa fa-trash" /> </button> ';
                    usersData.push([value, value.fullname ? value.fullname : 'none', value.username ? value.username : 'none', position, branches, actionBtn]);
                });
            } else {
                return Promise.resolve(false)
            }
            return Promise.resolve(usersData);
        }).catch((err) => {
            console.log('err ', err)
            return Promise.resolve(false);
        });
    }
}

export function setUsers(users) {
    return {
        type: USERS_LIST,
        data: users
    }
}

export function deleteUser(id) {
    return (dispatch, getState) => {
        const userService = feathers.service('users');

        userService.remove(id).then((data) => {
            console.log('data', data)
        }).catch((err) => {
            console.log('data', err)
        });
    }
}

export function setUserInfo(userInfo) {
    return {
        type: SET_USER_INFO,
        data: userInfo
    }
}

export function GetUserDesignation() {
    return (dispatch, getState) => {
        const positionsService = feathers.service('user-position');
        let query = {};
        let { userData } = getState().login;
        let session = {
            branchId: userData.branch_info._id,
            branchName: userData.branch_info.branch_name,
        }

        if(session.branchName !== "MAIN"){
            query.position_type = {
                $ne: "ADMINISTRATOR"
            }
        }

        return positionsService.find({query: query}).then((positions) => {
            const results = positions.data,
                data = [],
                designationList = [];

            results.forEach((value, index) => {
                const actionBtn = '<tr><td><button id="' + value._id + '" class="btn btn-sm btn-block btn-primary ct-userPermission"><span class="fa fa-user" />' + value.position_type + '</button></td></tr>';
                
                data.push([value._id, index + 1, value.position_type, actionBtn]);
                designationList.push({value: value._id, label: value.position_type});
            });

            dispatch(SetDesignation(designationList));

            return Promise.resolve(data);

        }).catch((err) => {
            return Promise.resolve(false);
        })
    }
}



export const AddUserRole = (role) => {
    return (dispatch, getState) => {
        let Service = feathers.service("user-position");
        let output = {};

        return Service.find({
            query: {
                position_type: role
            }
        })
        .then((result) => {
            if(result.data.length > 0){
                output.status = false;
                output.message = `The role ${role} already exists`;

                return Promise.resolve(output);
            }else{
                return Service.create({
                    position_type: role
                })
                .then(() => {
                    output.status = true;
                    output.message = `The role successfully added`;

                    return Promise.resolve(output);
                })
                .catch(() => {
                    output.status = false;
                    output.message = `Failed to add role`;

                    return Promise.resolve(output);
                })
            }
        })
        .catch(() => {
            output.status = false;
            output.message = `Failed to add role`;

            return Promise.resolve(output);
        })
    }
}

export function SetDesignation(data) {
    return {
        type: DESIGNATION_LIST,
        data: data
    }
}

export function checkPermissions(id) {
    return (dispatch, getState) => {
        const permissionService = feathers.service('permission');

        return permissionService.find({
            query: {
                user_id: id
            }
        }).then((result) => {
            const data = [];

            // permissionService.remove(result.data[1]._id)

            if (result.total > 0) {
                data['status'] = 1;
                data['data'] = result.data[0]._id;
            } else {
                data['status'] = 0
            }

            return Promise.resolve(data);
        }).catch((err) => {
            console.log('err ', err)
        });
    }
}

export function savePermissions(id, dashboard, inventory, customer, reports, user, category, accounting) {
    return (dispatch, getState) => {
        const permissionService = feathers.service('permission');

        return permissionService.create({
            user_id: id,
            permissions: {
                dashboard: dashboard === '' ? 0 : dashboard,
                inventory: inventory === '' ? 0 : inventory,
                user: user === '' ? 0 : user,
                customer: customer === '' ? 0 : customer,
                report: reports === '' ? 0 : reports,
                category: category === '' ? 0 : category,
                accounting: accounting === '' ? 0 : accounting,
            }
        }).then((data) => {
            return Promise.resolve(true)
        }).catch((error) => {
            console.log('savePermissions error', error)
            return Promise.resolve(false)
        });
    }
}

export function updatePermissions(id, dashboard, inventory, customer, reports, user, category, accounting) {
    return (dispatch, getState) => {
        const permissionService = feathers.service('permission');
        const sess_id = getState().login.userData._id;
        const usertype = getState().login.userData.type;

        return permissionService.patch(id,
            {
                permissions: {
                    dashboard: dashboard === '' ? 0 : dashboard,
                    inventory: inventory === '' ? 0 : inventory,
                    user: user === '' ? 0 : user,
                    customer: customer === '' ? 0 : customer,
                    report: reports === '' ? 0 : reports,
                    category: category === '' ? 0 : category,
                    accounting: accounting === '' ? 0 : accounting,
                }
            }).then((data) => {
            return Promise.resolve(true)
        }).catch((error) => {
            console.log('updatePermissions error', error)
            return Promise.resolve(false)
        });
    }
}

export function getSelectedPermissions(user_id) {
    return (dispatch, getState) => {
        const permissionService = feathers.service('permission');

        let params = {
            query: {
                user_id: user_id
            }
        }

        return permissionService.find({query: {user_id: user_id}}).then((result) => {
            return Promise.resolve(result);
        }).catch((err) => {
            console.log('err ', err)
        });
    }
}

export function saveSelectedPermissions(permissions) {
    const dashboard = permissions.dashboard > 0 ? (permissions.dashboard > 1 ? {
            label: 'Full access',
            value: 2
        } : {label: 'View only', value: 1}) : {label: 'No access', value: 0},
        inventory = permissions.inventory > 0 ? (permissions.inventory > 1 ? {
            label: 'Full access',
            value: 2
        } : {label: 'View only', value: 1}) : {label: 'No access', value: 0},
        user = permissions.user > 0 ? (permissions.user > 1 ? {label: 'Full access', value: 2} : {
            label: 'View only',
            value: 1
        }) : {label: 'No access', value: 0},
        customer = permissions.customer > 0 ? (permissions.customer > 1 ? {
            label: 'Full access',
            value: 2
        } : {label: 'View only', value: 1}) : {label: 'No access', value: 0},
        report = permissions.report > 0 ? (permissions.report > 1 ? {
            label: 'Full access',
            value: 2
        } : {label: 'View only', value: 1}) : {label: 'No access', value: 0},
        category = permissions.category > 0 ? (permissions.category > 1 ? {
            label: 'Full access',
            value: 2
        } : {label: 'View only', value: 1}) : {label: 'No access', value: 0},
        accounting = permissions.accounting > 0 ? (permissions.accounting > 1 ? {
            label: 'Full access',
            value: 2
        } : {label: 'View only', value: 1}) : {label: 'No access', value: 0},
        // accounting = permissions.accounting > 0 ? ( permissions.accounting > 1 ? {label: 'Full access', value: 2} : {label: 'View only', value: 1} )  : {label: 'No access', value: 0},
        data = {
            dashboard: dashboard,
            inventory: inventory,
            user: user,
            customer: customer,
            report: report,
            category: category,
            accounting: accounting,
        };

    return {
        type: SELECTED_USER_PERMISSION,
        data: data
    }
}

export function activeUserInPermission(id) {
    return {
        type: ACTIVE_USER_IN_PERMISSION,
        data: id,
    }
}

export function userInfoEdit(data) {
    const user_id = data[0]._id,
        name = data[1],
        username = data[2],
        position = data[3],
        userEmail = data[0].email

    const selectedPos = {
        value: data[0].user_position_info._id,
        label: data[0].user_position_info.position_type
    }

    const userData = {
        user_id,
        name,
        username,
        position,
        userEmail,
        selectedPos
    };

    return {
        type: EDIT_USER_INFO,
        data: userData
    }
}

export function saveUserUpdateprev(id, data) {
    return (dispatch, getState) => {
        const Service = feathers.service('users');
        let query;
        let output = {};

        if (data.password === "") {
            query = {
                fullname: data.fullname,
                username: data.username,
                type: data.position,
                email: data.email,
            }
        } else {
            query = {
                fullname: data.fullname,
                username: data.username,
                type: data.position,
                password: data.password,
                email: data.email,
            }
        }

        return Service.find({
            query: {
                username: data.username
            }
        })
        .then((duplicate) => {
            if(duplicate.data.length > 0){
                output.status = true;
                output.data = "exists";
                output.message = "Username already taken";

                return Promise.resolve(output);
            }else{
                return Service.patch(id, query).then((data) => {
                    output.status = true;
                    output.message = "User info successfully updated";
                    return Promise.resolve(output)
                }).catch((error) => {
                    output.status = false;
                    output.message = "An error occured. Please try again.";
                    return Promise.resolve(output);
                });
            }
        })
        .catch((e) => {
            output.status = false;
            output.message = "An error occured. Please try again.";

            return Promise.resolve(output);
        })

        
    }
}

export const saveUserUpdate = (id, data) => {
    return (dispatch, getState) => {
        const Service = feathers.service('users');
        let currentUsername = getState().users.userInfoEdit.username;
        let output = {};
        let query = {};

        if(data.fullname){
            query.fullname = data.fullname;
        }
        if(data.username){
            query.username = data.username;
        }
        if(data.position){
            query.position = data.position;
        }
        if(data.password){
            query.password = data.password;
        }
        if(data.email){
            query.email = data.email;
        }

        if(data.username){
            return Service.find({
                query: {
                    username: data.username
                }
            })
            .then((duplicate) => {
                if(duplicate.data.length > 0){
                    output.status = true;
                    output.data = "taken";
                    output.message = "Username already taken";

                    // if(currentUsername == data.username){
                    //     output.message = "No changes made";
                    //     output.data = "same";
                    // }

                    return Promise.resolve(output);
                }else{
                    return Service.patch(id, query).then((data) => {
                        output.status = true;
                        output.message = "User info successfully updated";
                        return Promise.resolve(output)
                    }).catch((error) => {
                        output.status = false;
                        output.message = "An error occured. Please try again.";
                        return Promise.resolve(output);
                    });
                }
            })
        }else{
            return Service.patch(id, query).then((data) => {
                output.status = true;
                output.message = "User info successfully updated";
                return Promise.resolve(output)
            }).catch((error) => {
                output.status = false;
                output.message = "An error occured. Please try again.";
                return Promise.resolve(output);
            });
        }
    }
}


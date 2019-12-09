const initialState = {
    bikeSellers: [],
    roles: [],
    idBikeSellerSearch: '',
    loading: false,
    errors: {},
    forceReload: false
}

export const actionCreators = {
    requestBikeSellers: () => async (dispatch, getState) => {

        const url = 'https://localhost:44315/api/BikeSeller';
        const response = await fetch(url);
        const bikeSellers = await response.json();
        console.log(bikeSellers);
        dispatch({ type: 'FETCH_BIKESELLERS', bikeSellers });
    },
    requestRoles: () => async (dispatch, getState) => {

        const url = 'https://localhost:44315/api/Role';
        const response = await fetch(url);
        const roles = await response.json();
        console.log(roles);
        dispatch({ type: 'FETCH_ROLES', roles });
    },
    requestBikeSellersbyId: idBikeSellerSearch => async (dispatch, getState) => {

        const url = 'https://localhost:44315/api/BikeSeller/' + idBikeSellerSearch;
        const response = await fetch(url);
        const bikeSeller = await response.json();
        const bikeSellers = [];
        bikeSellers.push(bikeSeller);
        console.log(bikeSellers);
        dispatch({ type: 'FETCH_BIKESELLERSBYID', bikeSellers });
    },
    saveBikeSeller: bikeSeller => async (dispatch, getState) => {

        console.log(bikeSeller);
        const url = 'https://localhost:44315/api/BikeSeller';
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const requestOptions = {
            method: 'POST',
            headers,
            body: JSON.stringify(bikeSeller)
        };
        
        const request = new Request(url, requestOptions);
        await fetch(request);
        dispatch({ type: 'SAVE_BIKESELLER', bikeSeller });
    },
    updateBikeSeller: (bikeSeller, Id) => async (dispatch, getState) => {

        const url = 'https://localhost:44315/api/BikeSeller/' + Id;
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const requestOptions = {
            method: 'PUT',
            headers,
            body: JSON.stringify(bikeSeller)
        };
        const request = new Request(url, requestOptions);
        console.log(bikeSeller);
        await fetch(request);
        dispatch({ type: 'UPDATE_BIKESELLER', bikeSeller });
    },
    deleteBikeSeller: Id => async (dispatch, getState) => {
        const url = 'https://localhost:44315/api/BikeSeller/' + Id;
        const requestOptions = {
            method: 'DELETE',
        };
        const request = new Request(url, requestOptions);
        await fetch(request);
        dispatch({ type: 'DELETE_BIKESELLER', Id });
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    switch (action.type) {
        case 'FETCH_ROLES': {
            return {
                ...state,
                roles: action.roles,
                loading: false,
                errors: {},
                forceReload: false
            }
        }
        case 'FETCH_BIKESELLERS': {
            return {
                ...state,
                bikeSellers: action.bikeSellers,
                loading: false,
                errors: {},
                forceReload: false
            }
        }
        case 'FETCH_BIKESELLERSBYID': {
            return {
                ...state,
                bikeSellers: action.bikeSellers,
                loading: false,
                errors: {},
                forceReload: false
            }
        }
        case 'SAVE_BIKESELLER': {
            return {
                ...state,
                bikeSellers: Object.assign({}, action.bikeSeller),
                forceReload: true
            }
        }
        case 'UPDATE_BIKESELLER': {
            return {
                ...state,
                bikeSellers: Object.assign({}, action.bikeSeller),
                forceReload: true
            }
        }
        case 'DELETE_BIKESELLER': {
            return {
                ...state,
                Id: action.Id,
                forceReload: true
            }
        }
        default:
            return state;
    }
};
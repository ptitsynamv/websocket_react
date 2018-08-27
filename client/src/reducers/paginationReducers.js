import C from '../constants/constants';

let defaultState = {
    [C.PAGINATION_SKIP]: 0,
    [C.PAGINATION_LIMIT]: 2
};

export const pagination = (state = defaultState, action) => {
    switch (action.type) {
        case C.PAGINATION_MESSAGE:
            return {
                [C.PAGINATION_SKIP]: state.PAGINATION_SKIP + state.PAGINATION_LIMIT,
                [C.PAGINATION_LIMIT]: state.PAGINATION_LIMIT
            };
        default :
            return state
    }
};
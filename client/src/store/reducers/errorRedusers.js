import C from '../../constants/constants';

export const error = (state = {}, action) => {
    switch (action.type) {
        case C.ADD_ERROR:
            return {
                "code": action.code,
                "message": action.message,
            };
        case C.REMOVE_ERROR:
            return {};
        default:
            return state
    }
};


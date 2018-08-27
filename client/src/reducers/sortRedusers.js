import C from '../constants/constants';

export const sort = (state = C.SORTED_BY_DATE, action) => {
    switch (action.type) {
        case C.SORT_MESSAGE:
            return action.sortBy;
        default :
            return state
    }
};
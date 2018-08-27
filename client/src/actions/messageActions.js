import C from '../constants/constants'


export const addMessage = ({userId, userName, comment, color, date}) =>
    ({
        type: C.ADD_MESSAGE,
        userId,
        userName,
        comment,
        color,
        date,
    });

export const sortMessage = (sortedBy) => {
    switch (sortedBy) {
        case C.SORTED_BY_DATE:
            return {
                type: C.SORT_MESSAGE,
                sortBy: C.SORTED_BY_DATE
            };
        default:
            return {
                type: C.SORT_MESSAGE,
                sortBy: C.SORTED_BY_DATE
            }

    }
};



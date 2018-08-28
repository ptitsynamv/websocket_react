import {compose} from 'redux'
import C from '../constants/constants'

export const getFirstArrayItem = array => {
    return array[0]
};

export const filterArrayById = (array, id) => {
    return array.filter(item => item.id.toString() === id);
};

export const findById = compose(
    getFirstArrayItem,
    filterArrayById
);

const sortBy = (type, field) => {
    switch (type) {
        case  C.SORTED_BY_DATE : {
            return (a, b) => new Date(a[field]) - new Date(b[field]);
        }

        case "string" :
            return (a, b) => (a[field] < b[field]) ? -1 : 1;
        default:
            return (a, b) => b[field] - a[field];
    }
};

export const sortFunction = sort => {
    switch (sort) {
        case C.SORTED_BY_DATE:
            return sortBy(C.SORTED_BY_DATE, 'date');
        default:
            sortBy("string", "title");
    }
};



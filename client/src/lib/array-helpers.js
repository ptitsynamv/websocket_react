import { compose } from 'redux'

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


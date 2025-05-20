import C from '../../constants/constants'

export const addError = ({code, message}) =>
    ({
        type: C.ADD_ERROR,
        code,
        message
    });

export const removeError = () =>
    ({
        type: C.REMOVE_ERROR
    });

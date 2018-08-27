export const AuthGuard = () => {
    let currentUser = window.store.getState().currentUser;
    if (Object.keys(currentUser).length) {
        return true
    }
    return false

};


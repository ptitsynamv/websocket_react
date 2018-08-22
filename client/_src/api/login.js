/**
 * Mocking client-server processing
 */
import _users from './users.json'

const TIMEOUT = 100

export default {
    getUsers: (cb, timeout) => setTimeout(() => cb(_users), timeout || TIMEOUT),
}

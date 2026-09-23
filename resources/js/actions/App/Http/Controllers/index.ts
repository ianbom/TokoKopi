import Customer from './Customer'
import Auth from './Auth'
import Settings from './Settings'
import Admin from './Admin'

const Controllers = {
    Customer: Object.assign(Customer, Customer),
    Auth: Object.assign(Auth, Auth),
    Settings: Object.assign(Settings, Settings),
    Admin: Object.assign(Admin, Admin),
}

export default Controllers
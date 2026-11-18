import Customer from './Customer'
import StoryController from './StoryController'
import Auth from './Auth'
import Settings from './Settings'
import Admin from './Admin'

const Controllers = {
    Customer: Object.assign(Customer, Customer),
    StoryController: Object.assign(StoryController, StoryController),
    Auth: Object.assign(Auth, Auth),
    Settings: Object.assign(Settings, Settings),
    Admin: Object.assign(Admin, Admin),
}

export default Controllers
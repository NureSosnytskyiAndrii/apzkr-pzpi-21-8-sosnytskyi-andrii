import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Login from './components/navbar/pages/Login';
import Register from './components/navbar/pages/Register';
import Admin from "./components/navbar/pages/Admin";
import UserList from "./components/admin/UserList";
import Details from "./components/admin/Details";
import OrganizationList from "./components/admin/OrganizationList";
import OfficialList from "./components/admin/OfficialList";
import StateList from "./components/admin/StateList";
import MapView from "./components/admin/map/MapView";
import UserMapView from "./components/users/interfaces/map/UserMapView";
import CurrentLocationList from "./components/admin/CurrentLocationList";
import PhysicalState from "./components/admin/PhysicalState";
import SensorData from "./components/admin/SensorData";
import Navigation from './components/navbar/Navbar';
import EditOrganization from "./components/admin/edit/EditOrganiation";
import CreateOrganization from "./components/admin/add/CreateOrganization";
import Footer from "./components/footer/Footer";
import CreateOfficial from "./components/admin/add/CreateOfficial";
import EditOfficial from "./components/admin/edit/EditOfficial";
import UserLocations from "./components/users/interfaces/user/UserLocations";
import UserPhysicalState from "./components/users/interfaces/user/UserPhysicalStates";
import UserInfo from "./components/users/interfaces/user/UserInfo";
import PhysicalStateDetails from "./components/users/interfaces/PhysicalStateDetails";
import Home from "./components/navbar/pages/Home";
import './translation/i18n'

const App = () => {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <>
                <Navigation user={user} setUser={setUser}/>
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Home user={user}/>}/>
                        <Route path="/login" element={<Login setUser={setUser}/>}/>
                        <Route path="/register" element={<Register/>}/>
                        {user && user.role === "admin" && (
                            <>
                                <Route path="/admin" element={<Admin/>}/>
                                <Route path="/admin/user_list" element={<UserList/>}/>
                                <Route path="/admin/organizations" element={<OrganizationList/>}/>
                                <Route path="/admin/states" element={<StateList/>}/>
                                <Route path="/admin/states/details/:employeeId/:organizationId/:locationId" element={<Details/>}/>
                                <Route path="/admin/organizations/create" element={<CreateOrganization/>}/>
                                <Route path="/admin/organizations/edit/:id" element={<EditOrganization/>}/>
                                <Route path="/admin/officials" element={<OfficialList/>}/>
                                <Route path="/admin/officials/create" element={<CreateOfficial/>}/>
                                <Route path="/admin/officials/edit/:id" element={<EditOfficial />} />
                                <Route path="/admin/officials/state_list/:id" element={<MapView/>}/>
                                <Route path="/admin/officials/current_location_list/:id" element={<CurrentLocationList/>}/>
                                <Route path="/admin/map/map_view/:latitude/:longitude" element={<MapView/>}/>
                                <Route path="/admin/officials/physical_state/:id" element={<PhysicalState/>}/>
                                <Route path="/admin/officials/physical_state/sensor_data/:id" element={<SensorData/>}/>
                            </>
                        )}
                        {user && user.role === "user" && (
                            <>
                                <Route path="/user/locations" element={<UserLocations user={user}/>}/>
                                <Route path="/user/map/map_view/:latitude/:longitude" element={<UserMapView user={user}/>}/>
                                <Route path="/user/physical_states" element={<UserPhysicalState user={user}/>}/>
                                <Route path="/user/physical_states/details" element={<PhysicalStateDetails/>}/>
                                <Route path="/user/user-info" element={<UserInfo />} />
                            </>
                        )};
                    </Routes>
                </div>
                <Footer/>
            </>
        </Router>
    );
};

export default App;

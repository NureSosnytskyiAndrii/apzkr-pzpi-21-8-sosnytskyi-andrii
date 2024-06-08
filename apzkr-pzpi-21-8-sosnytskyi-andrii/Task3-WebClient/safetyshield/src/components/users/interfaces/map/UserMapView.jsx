import React from 'react';
import { Link, useParams } from 'react-router-dom';
import UserLeafletMap from "./UserLeafletMap";
import { useTranslation } from 'react-i18next';

const UserMapView = ({ user }) => {
    const { latitude, longitude } = useParams();
    const { t } = useTranslation();

    return (
        <div>
            <h2><span className="text-primary">{user.name + ' ' + user.surname + `'s`}</span> {t('user_info.locationOnMap')}</h2>
            <UserLeafletMap latitude={latitude} longitude={longitude} />
            <div className="mt-2 mb-2" style={{ display: "flex", justifyContent: "center" }}>
                <Link type="button" className="btn btn-outline-primary" to="/user/locations">{t('user_info.goBack')}</Link>
            </div>
        </div>
    );
};

export default UserMapView;

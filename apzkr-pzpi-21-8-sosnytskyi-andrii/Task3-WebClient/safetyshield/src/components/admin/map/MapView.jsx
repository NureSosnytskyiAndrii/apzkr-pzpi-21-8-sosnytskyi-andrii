import React from 'react';
import {Link, useParams} from 'react-router-dom';
import LeafletMap from './LeafletMap';
import {useTranslation} from "react-i18next";

const MapView = () => {
    const { latitude, longitude } = useParams();
    const { t } = useTranslation();

    return (
        <div>
            <h2>{t('admin.locationOnMap')}</h2>
            <LeafletMap latitude={latitude} longitude={longitude} />
            <div className="mt-2 mb-2" style={{display: "flex", justifyContent: "center"}}>
                <Link type="button" className="btn btn-outline-primary" to="/admin/officials/">{t('button.goBack')}</Link>
            </div>
        </div>
    );
};

export default MapView;




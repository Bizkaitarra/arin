import React, {useEffect} from 'react';
import {AdMob, BannerAdPosition} from '@capacitor-community/admob';

const AdBanner: React.FC = () => {
    useEffect(() => {
        const initializeAdmob = async () => {
            await AdMob.initialize({
                initializeForTesting: false,
            });

            await AdMob.showBanner({
                adId: 'ca-app-pub-6441432321179917/8474861162',
                npa: true,
                isTesting: false,
                position: BannerAdPosition.BOTTOM_CENTER,
                margin: 40
            });
        };

        initializeAdmob();

        return () => {
            AdMob.removeBanner();
        };
    }, []);

    return (
            <div id="banner_container">
            </div>
        );
};

export default AdBanner;

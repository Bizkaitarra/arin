import React, {useEffect, useState} from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar,
    useIonViewWillLeave
} from '@ionic/react';
import {clearIntervals} from "../services/IntervalServices";
import {useTranslation} from "react-i18next";
import {
    arrowBackOutline,
    helpCircleOutline
} from "ionicons/icons";
import {useHistory} from 'react-router-dom';
import {App as CapacitorApp} from '@capacitor/app';
import {Toast} from '@capacitor/toast';
import ReviewModal from "./ReviewModal";

interface PageProps {
    title: string;
    icon?: string;
    children: React.ReactNode;
    internalPage?: boolean;
}

const Page: React.FC<PageProps> = ({title, icon, children, internalPage = false}) => {
    const {t} = useTranslation();
    const history = useHistory();
    const [exitAttempt, setExitAttempt] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    useEffect(() => {
        let backButtonListener: any;

        const setupBackButtonListener = async () => {
            backButtonListener = await CapacitorApp.addListener('backButton', () => {
                if (history.length > 1) {
                    history.goBack();
                } else {
                    if (exitAttempt) {
                        CapacitorApp.exitApp();
                    } else {
                        setExitAttempt(true);
                        Toast.show({text: 'Pulsa otra vez para salir'});

                        setTimeout(() => {
                            setExitAttempt(false);
                        }, 2000);
                    }
                }
            });
        };

        setupBackButtonListener();

        return () => {
            if (backButtonListener) {
                backButtonListener.remove();
            }
        };
    }, [exitAttempt, history]);

    useEffect(() => {
        const launchCount = parseInt(localStorage.getItem("launchCount") || "0", 10) + 1;
        localStorage.setItem("launchCount", launchCount.toString());

        if (launchCount === 5) {
            setShowReviewModal(true);
        }
    }, []);

    useIonViewWillLeave(() => {
        clearIntervals();
    });

    return (
        <>
            <ReviewModal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)}/>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            {internalPage && (
                                <IonButton onClick={() => history.goBack()}>
                                    <IonIcon icon={arrowBackOutline}/>
                                </IonButton>
                            )}
                        </IonButtons>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <IonTitle style={{ paddingLeft: internalPage ? '0' : '16px' }}>
                                {icon && <IonIcon icon={icon} style={{ verticalAlign: 'middle', marginRight: '8px' }} />}
                                {title}
                            </IonTitle>
                        </div>
                        <IonButtons slot="end">
                            <IonButton onClick={() => history.push('/guided-setup')}>
                                <IonIcon icon={helpCircleOutline}/>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="page-container page-content">
                    {children}
                </IonContent>
            </IonPage>
        </>
    );
};

export default Page;

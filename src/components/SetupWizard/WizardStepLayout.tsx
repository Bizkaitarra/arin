import React, { useState, useRef, useEffect } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import './SetupWizard.css';

interface WizardStepLayoutProps {
    title?: string;
    children: React.ReactNode;
    onNext?: () => void;
    onBack?: () => void;
    onSkip?: () => void;
    nextLabel?: string;
    backLabel?: string;
    hideButtons?: boolean;
    footer?: React.ReactNode; // Allow custom footer if needed, otherwise use default buttons
}

const WizardStepLayout: React.FC<WizardStepLayoutProps> = ({
    title,
    children,
    onNext,
    onBack,
    onSkip,
    nextLabel,
    backLabel,
    hideButtons = false,
    footer
}) => {
    const { t } = useTranslation();
    const contentRef = useRef<HTMLDivElement>(null);
    const [showTopShadow, setShowTopShadow] = useState(false);
    const [showBottomShadow, setShowBottomShadow] = useState(false);

    const effectiveNextLabel = nextLabel || t('Siguiente');
    const effectiveBackLabel = backLabel || t('Atrás');

    const checkScroll = () => {
        if (contentRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
            setShowTopShadow(scrollTop > 0);
            // Show bottom shadow if we are not at the bottom (with a small buffer)
            setShowBottomShadow(scrollTop + clientHeight < scrollHeight - 5);
        }
    };

    useEffect(() => {
        checkScroll();
        // Re-check on resize
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [children]); // Re-check when children change

    return (
        <div className="wizard-step-layout animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                {title && <h2 className="wizard-title" style={{ margin: 0, flex: 1 }}>{title}</h2>}
                {onSkip && (
                    <IonButton fill="clear" size="small" onClick={onSkip} style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'normal' }}>
                        {t('Terminar')}
                    </IonButton>
                )}
            </div>

            <div className="wizard-content-wrapper">
                <div
                    className={`scroll-shadow-top ${showTopShadow ? 'visible' : ''}`}
                />

                <div
                    className="wizard-scrollable-content"
                    ref={contentRef}
                    onScroll={checkScroll}
                >
                    {children}
                </div>

                <div
                    className={`scroll-shadow-bottom ${showBottomShadow ? 'visible' : ''}`}
                >
                    <div className="scroll-more-indicator">
                        <IonIcon icon={chevronDownOutline} />
                    </div>
                </div>
            </div>

            {!hideButtons && (
                <div className="wizard-footer">
                    {footer ? footer : (
                        <div className="wizard-actions">
                            {onBack && (
                                <IonButton className="wizard-btn wizard-btn-secondary" fill="clear" onClick={onBack}>
                                    {effectiveBackLabel}
                                </IonButton>
                            )}
                            {onNext && (
                                <IonButton className="wizard-btn" onClick={onNext}>
                                    {effectiveNextLabel}
                                </IonButton>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default WizardStepLayout;

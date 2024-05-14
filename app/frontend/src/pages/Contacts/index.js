import React, { useState } from 'react';
import PrimaryAppBar from '../../components/appbar';
import ContactProfile from './contactProfile';
import ContactsList from './contactLists';

function Contacts() {
    const [showContactProfile, setShowContactProfile] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [selectedContactEmail, setSelectedContactEmail] = useState('');

    // Function to handle showing the contact profile
    const showProfile = (contactId, contactEmail) => {
        console.log('showprofile', contactId, contactEmail)
        setSelectedContactId(contactId);
        setSelectedContactEmail(contactEmail);
        setShowContactProfile(true);
    };

    // Function to handle going back to the contacts list
    const showContactsList = () => {
        setShowContactProfile(false);
        setSelectedContactEmail('');
        setSelectedContactId(null);
    };
    console.log(selectedContactEmail, selectedContactId)
    return (
        <>
            <PrimaryAppBar />
            {showContactProfile ? (
                <ContactProfile
                    contactId={selectedContactId}
                    contactEmail={selectedContactEmail}
                    onClick={showContactsList}
                />
            ) : (
                <ContactsList handleClick={showProfile} />
            )}
        </>
    );
}

export default Contacts;

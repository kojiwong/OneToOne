import React, { useState, useEffect, useContext } from 'react';
import Contact from './contact';
import SearchBar from './search';
import Dialog from '../../components/dialog';
import SelectCalendar from './selectCalendar';
import axios from 'axios';
import { API_URL, handleCancel } from '../../constants';
import { TextField, Typography, makeStyles } from '@material-ui/core';
import { AuthContext } from '../../context/AuthContext';

const useStyles = makeStyles((theme) => ({
    errorText: {
        color: 'red',
    }
}));

function ContactsList({handleClick}) {
    const classes = useStyles();
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [unfinalizedCalendars, setUnfinalizedCalendars] = useState([]);
    const [newContactText, setNewContactText] = useState('');
    const [selectCalendar, setSelectCalendar] = useState(null);
    const [checkedContacts, setCheckedContacts] = useState([]);
    const { accessToken } = useContext(AuthContext);
    const [contactUserId, setContactUserId] = useState({});

    useEffect(() => {
        // Fetch contacts and calendars when the component mounts
        fetchData();
    }, [accessToken]);

    const fetchData = async () => {
        try {
            const contactsResponse = await axios.get( API_URL + 'users/contacts/view/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const calendarsResponse = await axios.get(API_URL + 'users/calendars/view/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(contactsResponse, calendarsResponse)
            setContacts(contactsResponse.data.contacts);
            setFilteredContacts(contactsResponse.data.contacts);
            setUnfinalizedCalendars(calendarsResponse.data.calendars.filter(calendar => !calendar.finalized));
            console.log(contactsResponse.data)
            var contactId = {}
            for (const contact of contactsResponse.data.contacts) {
                var userId = await getUserId(contact);
                contactId[contact.email] = userId;
            }
            setContactUserId(contactId);
            console.log('contact id', contactUserId);
            console.log(contactId)

        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error (e.g., show error message to the user)
        }
    };

    const getUserId = async (userContact) => {
        try {
            const response = await axios.get( API_URL + `users/${userContact.email}/id/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(response.data.user_id)
            return response.data.user_id;
        } catch (error) {
            console.error('Error fetching user id: ', error);
            return null;
        }
    }

    const handleToggle = (user) => {
        setCheckedContacts(prevCheckedContacts => {
            const isChecked = prevCheckedContacts.some(contact => contact.email === user.email);
            if (isChecked) {
                // If user is already checked, remove it from the list
                return prevCheckedContacts.filter(contact => contact.email !== user.email);
            } else {
                // If user is not checked, add it to the list
                return [...prevCheckedContacts, user];
            }
        });
        console.log(checkedContacts)
    };

    const handleSearch = (query) => {
        const filtered = contacts.filter(contact =>
            contact.name.toLowerCase().includes(query.toLowerCase()) ||
            contact.email.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredContacts(filtered);
    };

    const handleAddContact = async () => {
        if (!newContactText) return; // Check if newContactText is empty or null
        console.log(newContactText)
        try {
            const response = await axios.post(API_URL + 'users/contacts/add/', { contact_email: newContactText }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('New contact added:', response.data);
            const newContact = { ...response.data.contact };
            setContacts(prevContacts => [...prevContacts, newContact]);
            setFilteredContacts(prevContacts => [...prevContacts, newContact]);
            setNewContactText(''); // Clear the input field
        } catch (error) {
            console.error('Error adding new contact:', error);
        }
        window.location.reload(); // Reload the page to see the new contact 
    };
    const handleDeleteSelectedContacts = async () => {
        for (const contact of checkedContacts) {
            console.log(contact)
             // Find the user contact by email
             const userContact = contacts.find(lcontact => lcontact.email === contact.email);
             if (!userContact) {
                 console.error(`User contact not found for email: ${contact.email}`);
                 continue; // Skip to the next contact if the user contact is not found
             }
             try {
                const response = await axios.post(API_URL + 'users/contacts/remove/', { contact_email: userContact.email }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Selected Contacts Deleted:', response.data);
                
            } catch (error) {
                console.error('Error deleting contacts:', error);
            }
            // Update state to remove deleted contacts
            setContacts(prevContacts => prevContacts.filter(contact => !checkedContacts.includes(contact.email)));
            setFilteredContacts(prevFilteredContacts =>
                prevFilteredContacts.filter(contact => !checkedContacts.includes(contact.email))
            );
            setCheckedContacts([]); // Clear the list of checked contacts
            window.location.reload(); // Reload the page to reflect changes
        }
    };
    const handleInviteSelectedContacts = async () => {
        console.log('Inviting selected contacts to calendar:', checkedContacts);
        for (const contact of checkedContacts){
            console.log(contact, contacts)
            // Find the user contact by email
            const userContact = contacts.find(lcontact => lcontact.email === contact.email);
            if (!userContact) {
                console.error(`User contact not found for email: ${contact.email}`);
                continue; // Skip to the next contact if the user contact is not found
            }
            console.log(userContact, selectCalendar)
            const userId = await getUserId(userContact);  // Wait for getUserId to finish
            console.log(userId);
            try {
                var payload = {
                    user: userId,
                    calendar: selectCalendar.calendar_id
                }
                const response = await axios.post(API_URL + 'calendars/invite/', payload, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
            } catch (error) {
                console.error('Error inviting user: ', error)
            }

        }

    };

    const getSelectedContactsNames = () => {
        console.log(checkedContacts)
        console.log(checkedContacts.map(contact => contact.name))
        return checkedContacts.map(contact => contact.name);
    };

    return (
    <>
        <div style={{ margin: '10px 20px' }}>
                <SearchBar onSearch={handleSearch}/>
                {filteredContacts.map((contact, index) => (
                    <div style={{margin: '10px 0'}} key={index}>
                        <Contact 
                            contact={contact} 
                            contact_id={contactUserId[contact.email]}
                            onToggle={handleToggle} 
                            checked={checkedContacts.some(checkedContact => checkedContact.email === contact.email)}
                            onClick={handleClick}
                        />
                    </div>
                ))}
                <div style={{ marginTop: '20px',  display: 'flex', justifyContent: 'space-around' }}>
                    <Dialog 
                        onYes={handleAddContact}
                        onNo={handleCancel}
                        buttonText="Add Contact"
                        dialogQuestion="Do you want to add a new contact?"
                        dialogText="Please enter the contact's email address."
                        additionalField={
                            <>
                            <TextField 
                                id="outlined-basic" 
                                label="New Contact's Email Address" 
                                variant="outlined" 
                                style={{width: '100%'}} 
                                error={newContactText == ''}
                                helperText={newContactText == '' ? "Contact Email is required" : ""}
                                required
                                onChange={(e) => setNewContactText(e.target.value)} 
                            />
                            </>
                        }
                    />
                    <Dialog 
                        onYes={getSelectedContactsNames().length > 0 ? handleDeleteSelectedContacts : handleCancel}
                        onNo={getSelectedContactsNames().length > 0 ? handleCancel : ()=>{console.log('onNo')}}
                        yesText={getSelectedContactsNames().length > 0 ? "Yes" : "Ok"}
                        noText={getSelectedContactsNames().length > 0 ? "No" : ""}
                        buttonText="Delete Contact"
                        dialogQuestion={getSelectedContactsNames().length > 0 ? "Are you sure you want to delete the selected contacts?": "Please Select at least one contact to delete"}
                        dialogText={getSelectedContactsNames().join(', ')}
                    />

                    <Dialog 
                        onYes={getSelectedContactsNames().length > 0 ? handleInviteSelectedContacts: handleCancel}
                        onNo={getSelectedContactsNames().length > 0 ? handleCancel: ()=>{console.log('onNo')}}
                        yesText={getSelectedContactsNames().length > 0 ? "Yes" : "Ok"}
                        noText={getSelectedContactsNames().length > 0 ? "No" : ""}
                        buttonText="Invite to Calendar"
                        dialogQuestion={getSelectedContactsNames().length > 0 ? "Are you sure you want to invite the selected contacts to calendar?":"Please Select at least one contact to invite"}
                        dialogText={getSelectedContactsNames().join(', ')}
                        additionalField={getSelectedContactsNames().length > 0 ? (
                            <SelectCalendar handleOnChange={setSelectCalendar} calendarlist={unfinalizedCalendars}/>
                        ):(<></>)
                        }
                    />
                </div>
        </div>
    </>
    );
}

export default ContactsList;


/**
 * CALENDAR MODEL
 *  - Name
 *  - Description
 *  - Start_date (when does the calendar start)
 *  - End_date (when does it end)
 *  - Deadline (when do the invitees need to submit their availabilities by)
 *  - Owner (which user owns this calendar)
 *  - Is_finalized (checking if the calendar is finalized or not)
 */
export const calendarDatabase = [
    { 
        id: 1, 
        name: 'Work Calendar', 
        description: 'Calendar for work-related events',
        start_date: new Date('2023-04-01'),
        end_date: new Date('2023-06-30'),
        deadline: new Date('2023-04-10'),
        owner: 'John Doe',
        is_finalized: false,
    },
    {
        id: 2,
        name: 'Company Offsite',
        start_date: new Date('2023-05-01T09:00:00'),
        end_date: new Date('2023-05-03T17:00:00'),
        deadline: new Date('2023-04-20T23:59:59'),
        Owner: 'Jane Smith',
        is_finalized: true,
    }
]

/**
 * EVENT MODEL
 *  - Name
 *  - Start_time (when does this event start and end)
 *  - End_time
 *  - Last_modified
 *  - Calendar (which calendar does this event belong to)
 *  - Owner (who owns this event)
 *  - Event_type (choice of high preference, low preference, or finalized)
 */
export const eventDatabase = [
    { 
        id: 1, 
        name: 'Team Meeting', 
        start_time: new Date('2023-04-15T10:00:00'), 
        end_time: new Date('2023-04-15T11:00:00'),
        Last_modified: new Date('2023-04-10T09:30:00'),
        Calendar: calendarDatabase[0],
        Owner: 'John Doe',
        Event_type: 'high preference',
    },
    { 
        id: 2, 
        title: 'Client Presentation', 
        start: new Date('2023-04-20T14:00:00'), 
        end: new Date('2023-04-20T15:30:00'),
        Last_modified: new Date('2023-04-15T11:00:00'),
        Calendar: calendarDatabase[0],
        Owner: 'Jane Smith',
        Event_type: 'low preference',
    },
    
]
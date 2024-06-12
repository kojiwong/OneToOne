import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../../constants';
import { DayPilotCalendar, DayPilot } from "@daypilot/daypilot-lite-react";
import { AuthContext } from '../../context/AuthContext';
import Button from '@mui/material/Button';



const App = props => {
    const { accessToken } = useContext(AuthContext);
    const calendarRef = useRef()

    const [calendarId, setCalendarId] = useState(props.calendarId);
    const [suggestedEvents, setSuggestedEvents] = useState(props.suggestedEvents)
    const [isClickedSuggested, setIsClickedSuggested] = useState(false);
    const [calendar, setCalendar] = useState({is_finalied: false})

    const editEvent = async (e) => {
      const dp = calendarRef.current.control;
      const modal = await DayPilot.Modal.prompt("Update event text:", e.text());
      if (!modal.result) { return; }
      e.data.text = modal.result;
      dp.events.update(e);
    };

    const [config, setConfig] = useState({
      viewType: "days",
      days: 7,
      durationBarVisible: false,
      timeRangeSelectedHandling: "Enabled",
      onTimeRangeSelected: async args => {
        const dp = calendarRef.current.control;
        const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
        dp.clearSelection();
        if (!modal.result) { return; }
        dp.events.add({
          start: args.start,
          end: args.end,
          id: DayPilot.guid(),
          text: modal.result
        });
      },
      onEventClick: async args => {
        await editEvent(args.e);
      },
      contextMenu: new DayPilot.Menu({
        items: [
          {
            text: "Delete",
            onClick: async args => {
              const dp = calendarRef.current.control;
              dp.events.remove(args.source);
            },
          },
          {
            text: "-"
          },
          {
            text: "Edit...",
            onClick: async args => {
              await editEvent(args.source);
            }
          }
        ]
      }),
      onBeforeEventRender: args => {
        args.data.areas = [
          {
            top: 3,
            right: 3,
            width: 20,
            height: 20,
            symbol: "icons/daypilot.svg#minichevron-down-2",
            fontColor: "#fff",
            toolTip: "Show context menu",
            action: "ContextMenu",
          },
          {
            top: 3,
            right: 25,
            width: 20,
            height: 20,
            symbol: "icons/daypilot.svg#x-circle",
            fontColor: "#fff",
            action: "None",
            toolTip: "Delete event",
            onClick: async args => {
              const dp = calendarRef.current.control;
              dp.events.remove(args.source);
            }
          }
        ];
  
  
        const participants = args.data.participants;
        if (participants > 0) {
          // show one icon for each participant
          for (let i = 0; i < participants; i++) {
            args.data.areas.push({
              bottom: 5,
              right: 5 + i * 30,
              width: 24,
              height: 24,
              action: "None",
              image: `https://picsum.photos/24/24?random=${i}`,
              style: "border-radius: 50%; border: 2px solid #fff; overflow: hidden;",
            });
          }
        }
      }
    });

    const get_events = async () => {
      const events_response = await axios.get(API_URL + `calendars/${calendarId}/get_events/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      const events = events_response.data.events
      const calendar_response = await axios.get(API_URL + `calendars/${calendarId}/view/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const calendar_data = calendar_response.data
      setCalendar(calendar_data)



      calendarRef.current.control.update({
        startDate: calendar_data.start_date,
        events: events.concat(suggestedEvents).map(e => {
          return {
                  id: e.id,
                  owner_id: e.owner,
                  text: e.name,
                  start: e.start_time,
                  end: e.end_time,
                  event_type: e.event_type,
            }
          }
        )
      })
    }

    const handleSuggestedEvents = async () => {
      const response = await axios.get(API_URL + `calendars/${calendarId}/suggested/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
        else {
          console.log(error);
          return <div>Hello Error</div>;
        }
      });
  
      setSuggestedEvents(response.data.suggested_events)
      setIsClickedSuggested(true)
      if (response.data.overlap == true) {
        alert('Schedule Overlap. Not able to get everyone`s availabilities. Please Resolve Conflicts.');
      }
    }

    const handleFinalizeCalendar = async () => {
      const final_events = calendarRef.current.control.events.list.filter(event => event.event_type == "FN")
      .map(final_event => {
        return {
          name: final_event.text.split(" ")[1],
          owner: final_event.owner_id,
          event_type: final_event.event_type,
          start_time: final_event.start + "Z",
          end_time: final_event.end + "Z",
          calendar: calendarId,
        }
      });
      const response = await axios.post(API_URL + `calendars/${calendarId}/finalize/`, 
      {
        events: JSON.stringify(final_events)
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
        else {
          console.log(error);
          return <div>Hello Error</div>;
        }
      })

      calendarRef.current.control.update({
        events: final_events.map(e => {
          return {
              id: e.id,
              owner_id: e.owner,
              text: e.name,
              start: e.start_time,
              end: e.end_time,
              event_type: e.event_type,
            }
          }
        )
      })
      window.location.reload()
    }

    

    useEffect(() => {
      get_events()
    }, [suggestedEvents])

    return (
        <div>
            <DayPilotCalendar {...config} ref={calendarRef} />
            {calendar.is_finalized ? <></> :
             <Button variant="outlined" color="primary" onClick={handleSuggestedEvents}> 
             Generate Suggested Meetings 
             </Button>
            }
            {calendar.is_finalized || !isClickedSuggested ? <></> : <Button variant="outlined" color="primary" onClick={handleFinalizeCalendar}>
              Finalize Calendar 
            </Button>}
        </div>
    );
}




export default App;

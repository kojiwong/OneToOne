import { API_URL } from "../../constants";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import { Grid } from "@mui/material";
import bellIcon from './bell.png';




function StatusCard(calendar_id) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { accessToken } = useContext(AuthContext);
    console.log(calendar_id.calendar)


    const url = API_URL + "calendars/" + calendar_id.calendar + "/list/status"
    function remind(calendar_id) {
      const remind_url = API_URL + "calendars/" + calendar_id.calendar + "/reminder/"
      const response = axios.post(remind_url, 
        null,
        {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }


    useEffect(() => {
        const fetchData = async () => {
          try {
            // const response = await axios.get(url);
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setData(response.data);
            setLoading(false);
            
          } catch (error) {
            setError(error);
            setLoading(false);
          }
        };
    
        fetchData();
    
        // Clean up function
        return () => {
          // Perform any cleanup if needed
        };
      }, []); // Empty dependency array ensures useEffect runs only once on component mount
    
      if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>Error: {error.message}</div>;
      }

      console.log("data", data);
    
      return (
        <div className="border=solid border-2 p-4 rounded">
          {/* Display your data */}
          <h3 className="text-center">Calendar Status</h3>
          <br></br>
          {data && (
            <ul>
                  <Grid container spacing={3}>
                    <Grid item sm={6} className="text-center">Contact Name</Grid>
                    <Grid item sm={3} className="text-center">Added</Grid>
                    <Grid item sm={3}>Remind</Grid>
                  </Grid>
              {data.map((item, index) => (
                <li key={index}>
                  <Grid container spacing={3} className="pl-4">
                    <Grid item sm={6}>{item.first_name}</Grid>
                    <Grid item sm={3} className="text-center">{item.accepted ? <span style={{ color: 'green' }}>&#10004;</span> : <span style={{ color: 'red' }}>&#10008;</span>}</Grid>
                    <Grid item sm={3}>
                      {!item.accepted ?
                        <button class="bell bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-2 rounded-md text-center" onClick={() => remind(calendar_id)}>
                        <img src={bellIcon} alt="Remind" width="18" /> 
                        </button>
                        :
                        <button class="bell bg-blue-200 text-white font-bold py-2 px-2 rounded-md text-center cursor-not-allowed">
                        <img src={bellIcon} alt="Remind" width="18" /> 
                        </button>
                      }
                    </Grid>
                  </Grid>
                  
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    };

export default StatusCard;
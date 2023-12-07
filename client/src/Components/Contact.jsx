import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = ({listing}) => {

    const [landLord,setLandLord]=useState(null);
    const [loading,setLoading]=useState(false);
    const [Error,setError]=useState(false);
    const [message,setMessage]=useState("");
    useEffect(()=>{
        const fetchLandLordData=async()=>{
            try{
                setLoading(true);
                setError(false);
                const res=await fetch(`/api/user/${listing.userRef}`);
            const data=await res.json();
            if(data.success==false){
                setLoading(false);
                setError(true);
                return;
            }
            setLandLord(data);
             setLoading(false);
             setError(false);
            }catch(error){
                setLoading(false);
                setError(true);
                // console.log(error.message);

            }

        }
        fetchLandLordData();

    },[listing.userRef]);
    const handleChange=(e)=>{
        setMessage(e.target.value);

    }

  return (
    <div>
      {landLord &&
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landLord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={handleChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

          <Link
          to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message          
          </Link>
        </div> 
      }
    </div>
  );
}

export default Contact;

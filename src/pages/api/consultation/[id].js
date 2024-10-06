"use client"
import { useState, useEffect } from 'react';

const VideoCall = ({ roomUrl }) => (
  <iframe
    src={roomUrl}
    style={{ width: '100%', height: '500px', border: '0' }}
    allow="camera; microphone; fullscreen; display-capture"
  />
);

export default function ConsultationPage({ consultationId }) {
  const [roomUrl, setRoomUrl] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`/api/telemedicine/${consultationId}/start-session`, {
          method: 'POST',
        });
        const data = await res.json();
        if (data.success) {
          setRoomUrl(data.roomUrl);
        }
      } catch (error) {
        console.error('Error fetching video room:', error);
      }
    };

    fetchRoom();
  }, [consultationId]);

  const endConsultation = async () => {
    try {
      const res = await fetch(`/api/telemedicine/${consultationId}/end-session`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        alert('Consultation ended and room deleted.');
        setRoomUrl(null); // Clear the room URL after ending the consultation
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error ending consultation:', error);
      alert('Error ending consultation.');
    }
  };

  if (!roomUrl) return <p>Loading...</p>;

  return (
    <div>
      <h1>Telemedicine Consultation {consultationId}</h1>
      <VideoCall roomUrl={roomUrl} />
      <button onClick={endConsultation} style={{ marginTop: '20px' }}>
        End Consultation
      </button>
    </div>
  );
}

// Get consultation ID from the URL
export async function getServerSideProps(context) {
  const { id } = context.params;
  return {
    props: {
      consultationId: id,
    },
  };
}

import { useEffect, useState } from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import EventLine from './components/EventLine';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:8080/games');
            const data = await res.json();
            setData(data);
        }
        fetchData();
    }, [])


    return (
        <div className='bg-dark-bg flex flex-col justify-start space-y-2 h-screen overflow-auto'>
            {data && Object.values(data).length > 0 &&
                <table className="self-center">
                    <thead className=''>
                        <tr className="font-semibold">
                            <th className='sticky'></th>
                            <th className='sticky'></th>
                            <th className='sticky'>Streams</th>
                            <th className='sticky'>Block</th>
                            <th className='sticky'>Type</th>
                            <th className='sticky'>Match</th>
                        </tr>
                    </thead>
                    <tbody >
                        {Object.values(data)?.filter((event: any) => (!["tft_esports"].includes(event.Event?.league?.slug))).map((event: any, index: number) => {
                            return <EventLine event={event.event} key={index}></EventLine>
                        })}
                    </tbody>
                </table>
            }
        </div>
    )
}

export default App

import { useCallback, useEffect, useState } from 'react';
import kofi from './assets/images/ko-fi-ar21.svg';
import './App.css';
import EventLine from './components/EventLine';
import { Twitch, Twitter } from './components/SocialMedia';
import { BrowserOpenURL } from "../wailsjs/runtime";

function App() {
    const [data, setData] = useState(null);
    const [fetching, setFetching] = useState(false);

    const fetchData = useCallback(async () => {
        if (fetching) return;
        setFetching(true);
        console.log('fetching data');
        const res = await fetch('https://api.lolhub.gg/lolesports/games');
        const data = await res.json();
        setData(data);
        setFetching(false);
    }, [setData]);

    useEffect(() => {
        fetchData();
    }, [])


    return (
        <div className='bg-dark-bg flex flex-col justify-start space-y-2 h-screen overflow-auto p-2 relative'>
            <button onClick={() => { fetchData() }} className='rounded-md bg-palette-teal p-1 w-20 self-center font-semibold'>{fetching ? "Updating" : "Update"}</button>
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
            <div className='absolute bottom-0 right-0 w-screen h-10 flex'>
                <div className='cursor-pointer' onClick={() => { BrowserOpenURL("https://twitter.com/Bruno_De_Simone") }}>
                    <Twitter className={`m-2 left-3 h-6 w-6 self-center stroke-black stroke-2`} aria-hidden="true" />
                </div>
                <div>
                    <img className='cursor-pointer' width={80} src={kofi} onClick={() => { BrowserOpenURL("https://ko-fi.com/dezio") }} />
                </div>
            </div>
        </div>
    )
}

export default App

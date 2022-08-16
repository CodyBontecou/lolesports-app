import { useCallback, useEffect, useMemo, useState } from "react";
import LateralInfo from "../components/LateralInfo";
import { v4 as uuidv4 } from 'uuid';
import { Link, useParams } from "react-router-dom";
import InputOBS from "../components/InputOBS";

declare type dispatchWS = {
    type: string
    body: { [key: string]: any }
}
const Event: React.FC = () => {
    let params = useParams();
    const [ws, setWS] = useState<WebSocket | null>(null)
    const [game, setGame] = useState("")
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [chornoInterval, setChronoInterval] = useState<number | null>(null);
    const [ID, setID] = useState("")
    const [frames, setFrames] = useState(new Map())
    const [event, setEvent] = useState<any>(null);
    const [displayInfo, setDisplayInfo] = useState({
        lateral: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`http://localhost:8080/event/${params.eventId}`);
            const data = await res.json();
            setEvent(data);
        }
        fetchData();
    }, [])

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:34920`);
        ws.onopen = function () {
            console.log("Connected to websocket");
            setWS(ws)
        };

        ws.onerror = function (error) {
            console.log('WebSocket Error ' + JSON.stringify(error));
        }

        ws.onclose = function (event) {
            console.log('WebSocket closed ' + JSON.stringify(event));
            setWS(null)
        }
    }, []);

    useEffect(() => {
        if (ws == null || !ws.OPEN) {
            return
        }

        console.log("send")
        let newMessage: dispatchWS = {
            type: "display",
            body: {
                "event": params.eventId,
                "game": game,
                ...displayInfo
            }
        }
        console.log(newMessage)
        ws.send(JSON.stringify(newMessage))

    }, [ws, params.eventId, game, displayInfo])

    const startChrono = useCallback(() => {
        if (running) return

        setRunning(true)
        let chronoInterval = setInterval(() => {
            setTime(time => time + 1)

        }, 1000)
        setChronoInterval(chronoInterval)
    }, [running]);

    const stopChrono = useCallback(() => {
        if (!running) return

        setRunning(false)
        if (chornoInterval) {
            clearInterval(chornoInterval)
        }
        setChronoInterval(null)
    }, [running]);

    let horas: string | number = Math.floor(time / 3600)
    let minutos: string | number = Math.floor((time / 60) % 60)
    let segundos: string | number = Math.floor(time % 60)
    segundos = segundos < 10 ? "0" + segundos : segundos

    const blueSide = event?.games != undefined ? event?.games[game]?.game_metadata?.blueTeamMetadata : undefined
    const redSide = event?.games != undefined ? event?.games[game]?.game_metadata?.redTeamMetadata : undefined
    return (
        <div className="bg-dark-bg h-screen">
            <Link to={`/`}>
                HOME
            </Link>
            <main className="flex flex-col justify-center">
                <div className="flex justify-center">
                    {event &&
                        <div className="flex-col justify-start">
                            <div className="flex justify-center">
                                <div className="w-14 h-14 relative self-center">
                                    {event.event?.league?.image &&
                                        <img
                                            src={event.event.league.image}
                                        />
                                    }
                                </div>
                                <div className="text-4xl self-center font-bold">{event.event?.league?.name}</div>

                            </div>

                            {event.event?.match ?
                                <div className="flex justify-around space-x-0.5 self-center">
                                    {event.event.match?.teams?.length > 0 &&
                                        <>
                                            <div className="h-12 w-12 relative  self-center">
                                                <img src={event.event.match.teams[0]?.image} />
                                            </div>
                                            <div className="self-center">{event.event.match.teams[0]?.code}</div>
                                        </>
                                    }

                                    <div className='self-center h-full'>vs</div>
                                    {event.event.match?.teams?.length > 1 &&
                                        <>
                                            <div className="self-center">{event.event.match.teams[1]?.code}</div>
                                            <div className="h-12 w-12 relative">
                                                <img src={event.event.match.teams[1]?.image} />
                                            </div>
                                        </>
                                    }
                                </div> :
                                <div>"No match"</div>
                            }

                            {event.event?.match?.games &&
                                <div className="flex justify-center space-x-1">
                                    {event.event.match.games.map((game: any, index: number) => {
                                        if (event.games != null && event.games[game.id]) {
                                            return (
                                                <button onClick={() => setGame(game.id)} key={index} className="bg-palette-teal p-1 rounded-sm font-semibold">Match {game.number}</button>
                                            )
                                        }
                                    })}
                                </div>


                            }
                        </div>
                    }
                    <div className="flex flex-col self-center bg-dark-block py-2 rounded-sm">
                        <div className="flex justify-center text-6xl h-20">
                            <input className="w-20 text-center bg-dark-block" onChange={(e) => { setTime(Number(e.target.value) * 3600 + Number(minutos) * 60 + Number(segundos)) }} value={horas} />
                            :
                            <input className="w-20 text-center bg-dark-block" onChange={(e) => { setTime(Number(horas) * 3600 + Number(e.target.value) * 60 + Number(segundos)) }}
                                value={minutos} />
                            :
                            <input className="w-20 text-center bg-dark-block" onChange={(e) => { setTime(Number(horas) * 3600 + Number(minutos) * 60 + Number(e.target.value)) }}
                                value={segundos} />
                        </div>
                        <div className="flex self-center space-x-2">
                            <button className="self-center bg-dark-block font-bold border-2 rounded-sm p-1 mt-2" onClick={startChrono}>Start</button>
                            <button className="self-center bg-dark-block font-bold border-2 rounded-sm p-1 mt-2" onClick={stopChrono}>Stop</button>
                        </div>
                    </div>
                </div>
                {game != "" &&
                    <>
                        <InputOBS link={`http://localhost:3000/lolesports/lateral`} hidden={displayInfo["lateral"]} id={"lateral"} setDisplayInfo={setDisplayInfo} />
                        <div className="flex">
                            <LateralInfo side={"Blue Side"} team={blueSide} game={event?.games[game]} teams={event.event.match.teams} />
                            <LateralInfo side={"Red Side"} team={redSide} game={event?.games[game]} teams={event.event.match.teams} />
                        </div>
                    </>
                }
            </main >
        </div >
    );
};

export default Event;

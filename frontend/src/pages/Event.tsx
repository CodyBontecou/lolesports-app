import { useCallback, useEffect, useMemo, useState } from "react";
import LateralInfo from "../components/LateralInfo";
import { v4 as uuidv4 } from 'uuid';
import { Link, useParams } from "react-router-dom";
import InputOBS from "../components/InputOBS";
import Clock from "../components/Clock";

declare type dispatchWS = {
    type: string
    body: { [key: string]: any }
}

export interface displayInfo {
    lateral: boolean
    clock: boolean
}

const Event: React.FC = () => {
    let params = useParams();
    const [ws, setWS] = useState<WebSocket | null>(null)
    const [game, setGame] = useState("")
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [chornoInterval, setChronoInterval] = useState<number | null>(null);
    const [frames, setFrames] = useState(new Map())
    const [event, setEvent] = useState<any>(null);
    const [displayInfo, setDisplayInfo] = useState<displayInfo>({
        lateral: false,
        clock: true
    });
    const [fetching, setFetching] = useState(false);

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

        let newMessage: dispatchWS = {
            type: "display",
            body: {
                "event": params.eventId,
                "game": game,
                ...displayInfo
            }
        }
        ws.send(JSON.stringify(newMessage))
    }, [ws, params.eventId, game, displayInfo])

    useEffect(() => {
        if (ws == null || !ws.OPEN) {
            return
        }

        const frame = frames.get(time) || {};
        let newMessage: dispatchWS = {
            type: "frame",
            body: {
                ...frame,
                time: time
            }
        }
        console.log(time)
        ws.send(JSON.stringify(newMessage))

    }, [time, ws])

    useEffect(() => {
        console.log(fetching)
        console.log(frames.has(time) && frames.has(time + 5))
        console.log(game == "")
        if (fetching || frames.has(time) && frames.has(time + 5) || game == "") return
        setFetching(true)
        console.log("fetch")
        console.log(`http://localhost:8080/frames/${game}/${time}`)
        fetch(`http://localhost:8080/frames/${game}/${time}`).
            then(res => res.json()).
            then(frames => {
                setFetching(false)
                if (!Array.isArray(frames)) return
                setFrames((prev) => {
                    let newMap = new Map(prev)
                    frames.forEach((frame: any) => {
                        newMap.set(frame.second, frame)
                    })
                    return newMap
                })
            }).catch(err => {
                console.error(err)
                setFetching(false)
            });
    }, [game, time])

    const startChrono = useCallback(() => {
        if (running) return
        setRunning(true)
        let chronoInterval = setInterval(() => {
            setTime(time => time + 1)
        }, 1000)
        setChronoInterval(chronoInterval)
    }, [running, setRunning, setTime, setChronoInterval]);

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
        <div className="bg-dark-bg h-screen overflow-auto">
            <Link to={`/`}>
                HOME
            </Link>
            <main className="flex flex-col justify-center">
                <>
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
                        <Clock horas={horas} minutos={minutos} segundos={segundos} setTime={setTime} startChrono={startChrono} stopChrono={stopChrono} />
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
                    {JSON.stringify(frames.size)}
                </>
            </main >
        </div >
    );
};

export default Event;

//import { Twitch } from '../SocialMedia';

import { Link } from "react-router-dom";
import { Twitch } from "./SocialMedia";

interface Props {
    event: any;
}

const EventLine: React.FC<Props> = ({ event }) => {
    return <tr className="w-full bg-dark-block justify-between font-semibold">
        <td className="w-10 h-10 relative">
            {event.league?.image &&
                <img
                    src={event.league.image}
                    className="w-full h-full object-cover"
                />
            }
        </td>
        <td className="self-center h-full">{event.league.name}</td>
        <td className="justify-center self-center">
            <div className='flex justify-center'>
                {event?.streams?.find((stream: any) => stream.provider === "twitch") &&
                    <Twitch className={`h-6 w-6 self-center `} aria-hidden="true" />
                }
                {event?.streams?.find((stream: any) => stream.provider === "trovo") && false &&
                    <Twitch className={`h-6 w-6 self-center `} aria-hidden="true" />
                }
            </div>
        </td>
        <td>
            {event.blockName}
        </td>
        <td>
            {event.match && event.match.strategy.type === "bestOf" && `BO${event.match.strategy.count}`}
        </td>
        <td className="self-center">
            {event.match ?
                <div className="flex h-full space-x-0.5 justify-between">
                    {event.match?.teams?.length > 0 &&
                        <>
                            <div className="h-8 w-8 relative">
                                <img src={event.match.teams[0]?.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="self-center">{event.match.teams[0]?.code}</div>
                        </>
                    }

                    <div className='self-center h-full'>vs</div>
                    {event.match?.teams?.length > 1 &&
                        <>
                            <div className="self-center">{event.match.teams[1]?.code}</div>
                            <div className="h-8 w-8 relative">
                                <img src={event.match.teams[1]?.image} className="w-full h-full object-cover" />
                            </div>
                        </>
                    }
                </div> :
                "No match"
            }
        </td>
        <td>
            <Link to={`/event/${event.id}`}>
                Click me!
            </Link>
        </td>
    </tr>
}

export default EventLine;
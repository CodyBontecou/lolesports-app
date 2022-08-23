interface Props {
    team: any;
    game: any;
}

const RunesInfo: React.FC<Props> = ({ team, game }) => {
    if (!game?.perks_metadata) return <></>

    return <div className="flex center">
        {team?.participantMetadata?.map((participant: any, index: number) => (
            <div className="flex flex-col justify-start w-full" key={index}>
                <div className='flex self-center space-x-1'>
                    <p className="self-center">{participant.summonerName}</p>
                    <div className="w-8 h-8 relative self-center">
                        <img src={`/champs/${participant.championId}.webp`} />
                    </div>
                </div>
                <div className="flex self-center">
                    <div className="flex">
                        <div className="flex flex-col justify-start">
                            <div className="w-9 h-9 relative self-center">
                                <img src={`/perk-images/processed/${game.perks_metadata[participant.participantId].perks[0]}.webp`} />
                            </div>
                            {game.perks_metadata[participant.participantId].perks.length === 8 &&
                                <div key={index} className="w-5 h-5 relative self-center">
                                    <img src={`/perk-images/processed/5007.webp`} />
                                </div>
                            }
                            {game.perks_metadata[participant.participantId].perks.slice(6, 9).map((perk: any, index: number) => (
                                <div key={index} className="w-5 h-5 relative self-center">
                                    <img src={`/perk-images/processed/${perk}.webp`} />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col justify-center space-y-1">
                            {game.perks_metadata[participant.participantId].perks.slice(1, 4).map((perk: any, index: number) => (
                                <div key={index} className="w-7 h-7 relative self-center">
                                    <img src={`/perk-images/processed/${perk}.webp`} />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col justify-center space-y-1">
                            {game.perks_metadata[participant.participantId].perks.slice(4, 6).map((perk: any, index: number) => (
                                <div key={index} className="w-7 h-7 relative self-center">
                                    <img src={`/perk-images/processed/${perk}.webp`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
}

export default RunesInfo;
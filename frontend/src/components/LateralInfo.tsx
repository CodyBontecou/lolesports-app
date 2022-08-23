interface Props {
    side: string;
    team: any;
    game: any;
    teams: any;
}

const LateralInfo: React.FC<Props> = ({ side, team, game, teams }) => {

    return <div className="flex xl:flex-col justify-start w-fit xl:w-full self-center space-x-2 xl:space-x-0">
        <p className="self-center">{side}</p>
        {teams.filter((sTeam: any) => sTeam.id === team?.esportsTeamId).map((team: any, index: number) =>
            <div key={index} className="shrink-0 h-10 w-10 relative self-center">
                <img src={team.image} />
            </div>
        )}
        {team?.participantMetadata?.map((participant: any, index: number) => (
            <div className="flex flex-col justify-start w-full" key={index}>
                <p className="self-center whitespace-nowrap">{participant.summonerName}</p>
                <div className="flex self-center">
                    <div className="flex flex-col">
                        {game.perks_metadata &&
                            <div className="flex flex-col justify-center  space-y-1">
                                <div className="w-6 h-6 relative self-center">
                                    <img src={`/perk-images/processed/${game.perks_metadata[participant.participantId]?.perks[0]}.webp`} />
                                </div>
                                <div className="w-4 h-4 relative self-center">
                                    <img src={`/perk-images/processed/${game?.perks_metadata[participant.participantId]?.subStyleId}.webp`} />
                                </div>
                            </div>
                        }
                    </div>
                    <div className="flex flex-col">
                        <div className="w-12 h-12 relative self-center">
                            <img src={`/champs/${participant?.championId}.webp`} />
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
}

export default LateralInfo;
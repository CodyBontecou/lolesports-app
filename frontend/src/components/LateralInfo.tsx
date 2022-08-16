import img from '../assets/images/perk-images/processed/5001.webp'

interface Props {
    side: string;
    team: any;
    game: any;
    teams: any;
}

const LateralInfo: React.FC<Props> = ({ side, team, game, teams }) => {
    return <div className="flex flex-col justify-start w-32">
        <p className="self-center">{side}</p>
        {teams.filter((sTeam: any) => sTeam.id === team.esportsTeamId).map((team: any, index: number) =>
            <div key={index} className="h-14 w-14 relative self-center">
                <img src={team.image} />
            </div>
        )}
        {team?.participantMetadata?.map((participant: any, index: number) => (
            <div className="flex flex-col justify-start w-full" key={index}>
                <p className="self-center">{participant.summonerName}</p>
                <div className="flex self-center">
                    <div className="flex flex-col">
                        <div className="flex flex-col justify-center  space-y-1">
                            <div className="w-8 h-8 relative self-center">
                                <img src={`frontend/src/assets/images/perk-images/processed/${game.perks_metadata[participant.participantId].perks[0]}.webp`} />
                            </div>
                            <div className="w-5 h-5 relative self-center">
                                <img src={`frontend/src/assets/images/perk-images/processed/${game.perks_metadata[participant.participantId].subStyleId}.webp`} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="w-16 h-16 relative self-center">
                            <img src={`frontend/src/assets/images/champs/-1.webp`} />
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
}

export default LateralInfo;
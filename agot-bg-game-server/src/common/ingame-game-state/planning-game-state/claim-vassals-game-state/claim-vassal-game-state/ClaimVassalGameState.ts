import GameState from "../../../../GameState";
import ClaimVassalsGameState from "../ClaimVassalsGameState";
import Player from "../../../../ingame-game-state/Player";
import { ServerMessage } from "../../../../../messages/ServerMessage";
import { ClientMessage } from "../../../../../messages/ClientMessage";
import House from "../../../../ingame-game-state/game-data-structure/House";
import IngameGameState from "../../../IngameGameState";
import User from "../../../../../server/User";

export default class ClaimVassalGameState extends GameState<ClaimVassalsGameState> {
    house: House;

    get ingame(): IngameGameState {
        return this.parentGameState.ingame;
    }

    firstStart(house: House): void {
        this.house = house;
    }

    onServerMessage(message: ServerMessage): void {
    }

    onPlayerMessage(player: Player, message: ClientMessage): void {
        if (message.type == "claim-vassal") {
            if (player.house != this.house) {
                return;
            }

            const claimedVassal = message.house ? this.ingame.game.houses.get(message.house) : null;

            
            if (claimedVassal && !this.getClaimableVassals().includes(claimedVassal)) {
                return;
            }

            if (claimedVassal) {
                this.parentGameState.assignVassals(player.house, [claimedVassal]);
            }

            this.parentGameState.onClaimVassalFinish(player.house);
        }
    }

    getWaitedUsers(): User[] {
        return [this.parentGameState.ingame.getControllerOfHouse(this.house).user];
    }

    choose(house: House): void {
        this.ingame.entireGame.sendMessageToServer({
            type: "claim-vassal",
            house: house.id
        });
    }

    getClaimableVassals(): House[] {
        return this.ingame.getNonClaimedVassalHouses();
    }

    serializeToClient(_admin: boolean, _player: Player | null): SerializedClaimVassalGameState {
        return {
            type: "claim-vassal",
            house: this.house.id
        };
    }

    static deserializeFromServer(claimVassals: ClaimVassalsGameState, data: SerializedClaimVassalGameState): ClaimVassalGameState {
        const claimVassal = new ClaimVassalGameState(claimVassals);

        claimVassal.house = claimVassals.game.houses.get(data.house);
        
        return claimVassal;
    }
}

export interface SerializedClaimVassalGameState {
    type: "claim-vassal";
    house: string;
}
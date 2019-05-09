import HouseCardAbility from "./HouseCardAbility";

export default class HouseCard {
    id: string;
    name: string;
    combatStrength: number;
    swordIcons: number;
    towerIcons: number;
    ability: HouseCardAbility | null;
    state: HouseCardState = HouseCardState.AVAILABLE;

    constructor(id: string, name: string, combatStrength: number, swordIcons: number, towerIcons: number, ability: HouseCardAbility | null) {
        this.id = id;
        this.name = name;
        this.combatStrength = combatStrength;
        this.swordIcons = swordIcons;
        this.towerIcons = towerIcons;
        this.ability = ability;
    }

    serializeToClient(): SerializedHouseCard {
        return {
            id: this.id,
            name: this.name,
            combatStrength: this.combatStrength,
            swordIcons: this.swordIcons,
            towerIcons: this.towerIcons,
            abilityId: this.ability ? this.ability.id : null,
            state: this.state
        };
    }

    static deserializeFromServer(data: SerializedHouseCard): HouseCard {
        const houseCard = new HouseCard(
            data.id,
            data.name,
            data.combatStrength,
            data.swordIcons,
            data.towerIcons,
            null
        );

        houseCard.state = data.state;

        return houseCard;
    }
}

export interface SerializedHouseCard {
    id: string;
    name: string;
    combatStrength: number;
    swordIcons: number;
    towerIcons: number;
    abilityId: string | null;
    state: HouseCardState;
}

export enum HouseCardState {
    AVAILABLE,
    USED,
    DISCARDED
}

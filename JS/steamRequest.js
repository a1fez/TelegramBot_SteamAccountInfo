import axios from "axios";
import { Player } from "./player.js";
import { Steam_Api } from "./token.js";
export class SteamRequest {
    static async getPlayerById(steamId) {
        try {
            const res = await axios.get('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/', {
                params: {
                    key: Steam_Api,
                    steamids: steamId
                }
            });
            const playerData = res.data.response.players[0];
            if (!playerData)
                return null;
            return new Player(playerData);
        }
        catch (err) {
            console.log("Steam API error: ", err);
            return null;
        }
        ;
    }
}

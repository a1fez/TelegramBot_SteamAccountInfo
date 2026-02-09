export class Player {
    constructor(data) {
        this.id = data.steamid;
        this.name = data.personaname;
        this.profileUrl = data.profileurl;
        this.avatar = data.avatar;
        this.avatarMedium = data.avatarmedium;
        this.avatarFull = data.avatarfull;
        // перевод статуса
        this.status = this.parsePersonaState(data.personastate);
        // создание акка
        this.createdAt = data.timecreated
            ? new Date(data.timecreated * 1000).toLocaleDateString()
            : undefined;
        this.lastLogoff = data.lastlogoff
            ? new Date(data.lastlogoff * 1000).toLocaleString()
            : undefined;
        // текущая игра
        this.currentGame = data.gameextrainfo;
        this.country = data.loccountrycode;
    }
    parsePersonaState(state) {
        switch (state) {
            case 0:
                return "Оффлайн";
            case 1:
                return "Онлайн";
            case 2:
                return "Занят";
            case 3:
                return "Отошел";
            case 4:
                return "Спит";
            default:
                return "Unknown";
        }
    }
    getProfileInfo() {
        return (`👤 <b>${this.name}</b>\n` +
            `🆔 SteamID: <code>${this.id}</code>\n` +
            (this.currentGame ? `🎮 Играет в: ${this.currentGame}\n` : "") +
            (this.country ? `🌍 Страна: ${this.country}\n` : "") +
            (this.createdAt ? `📅 Аккаунт создан: ${this.createdAt}\n` : "") +
            (this.lastLogoff ? `📤 Последний выход: ${this.lastLogoff}\n` : "") +
            `\n<a href="${this.profileUrl}">Профиль Steam</a>`);
    }
}

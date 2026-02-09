import { TG_Token } from "./token.js";
import TelegramBot from 'node-telegram-bot-api';
import { SteamRequest } from "./steamRequest.js";
const Bot = new TelegramBot(TG_Token, { polling: true });
console.log('Bot works TS');
function sendMainMenu(chatId) {
    Bot.sendMessage(chatId, 'Главное меню. \nНажми на нужную кнопку', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'SteamID 📰', callback_data: 'butt_Steam' }],
                [{ text: 'Отслеживаемые игроки', callback_data: 'followed_Players' }]
            ]
        }
    });
}
Bot.onText(/\/start/, (msg) => {
    sendMainMenu(msg.chat.id);
});
Bot.on('callback_query', async (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;
    if (!msg)
        return;
    const chatId = msg.chat.id;
    switch (data) {
        case 'butt_Steam':
            await Bot.editMessageText("Введите SteamID пользователя:", {
                chat_id: chatId,
                message_id: msg.message_id
            });
            // Обработчик сообщений с фильтром по текущему чату
            const handler = async (replyMsg) => {
                if (replyMsg.chat.id !== chatId)
                    return; // только для текущего пользователя
                const steamId = replyMsg.text?.trim();
                if (!steamId) {
                    Bot.sendMessage(chatId, "Введите правильный SteamID");
                    return;
                }
                try {
                    const player = await SteamRequest.getPlayerById(steamId);
                    if (!player) {
                        Bot.sendMessage(chatId, "Игрок не найден");
                        sendMainMenu(chatId);
                        return;
                    }
                    await Bot.sendPhoto(chatId, player.avatarFull, {
                        caption: player.getProfileInfo(),
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "⬅️ Назад", callback_data: "menu_back" }]
                            ]
                        }
                    });
                }
                catch (err) {
                    console.error(err);
                    Bot.sendMessage(chatId, "Произошла ошибка при запросе Steam API");
                }
                finally {
                    Bot.off('message', handler); // удаляем обработчик после использования
                }
            };
            Bot.on('message', handler);
            break;
        case 'followed_Players':
            await Bot.editMessageText('В разработке ⚙️', {
                chat_id: chatId,
                message_id: msg.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⬅️ Назад', callback_data: 'menu_back_f' }]
                    ]
                }
            });
            break;
        case 'menu_back':
            Bot.sendMessage(chatId, 'Главное меню. \nНажми на нужную кнопку', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'SteamID 📰', callback_data: 'butt_Steam' }],
                        [{ text: 'Отслеживаемые игроки', callback_data: 'followed_Players' }]
                    ]
                }
            });
            break;
        case 'menu_back_f': {
            await Bot.editMessageText('Главное меню. \nНажми на нужную кнопку', {
                chat_id: chatId,
                message_id: msg.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'SteamID 📰', callback_data: 'butt_Steam' }],
                        [{ text: 'Отслеживаемые игроки', callback_data: 'followed_Players' }]
                    ]
                }
            });
        }
    }
    Bot.answerCallbackQuery(callbackQuery.id); // снимаем "ожидание" кнопки
});

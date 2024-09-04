import asyncio, aiogram, json
import aiogram.filters
import aiogram.fsm
import aiogram.fsm.storage
import aiogram.fsm.storage.memory
import aiogram.client.bot
import logging

import aiogram.utils
import aiogram.utils.keyboard

dispatcher = aiogram.Dispatcher(storage=aiogram.fsm.storage.memory.MemoryStorage())

@dispatcher.message(aiogram.filters.Command("start"))
async def start_message(message: aiogram.types.Message):
    await message.answer("Добро пожаловать в HelpResource", reply_markup=aiogram.types.InlineKeyboardMarkup(inline_keyboard=[[aiogram.types.InlineKeyboardButton(text="Menu", web_app=aiogram.types.WebAppInfo(url="https://mizentui.github.io/naimix"))]]))

async def main():
    with open("config.json", "r") as config_file:
        config = json.load(config_file)
    bot = aiogram.Bot(token=config["token"], default=aiogram.client.bot.DefaultBotProperties(parse_mode=aiogram.enums.ParseMode.HTML))
    await bot.delete_webhook(drop_pending_updates=True)
    await dispatcher.start_polling(bot, allowed_updates=dispatcher.resolve_used_update_types())

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
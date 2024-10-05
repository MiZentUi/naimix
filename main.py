import asyncio, aiogram, json
import aiogram.filters
import aiogram.fsm
import aiogram.fsm.storage
import aiogram.fsm.storage.memory
import aiogram.client.bot
import logging

from aiogram import F

import aiogram.utils
import aiogram.utils.keyboard

dispatcher = aiogram.Dispatcher(storage=aiogram.fsm.storage.memory.MemoryStorage())

@dispatcher.message(aiogram.filters.Command("start"))
async def start_message(message: aiogram.types.Message):
    await message.answer("Добро пожаловать в HelpResource!", reply_markup=aiogram.types.InlineKeyboardMarkup(inline_keyboard=[[aiogram.types.InlineKeyboardButton(text="Menu", web_app=aiogram.types.WebAppInfo(url="https://mizentui.github.io/naimix"))]]))

@dispatcher.message()
async def get_data(message):
    print(message)
    print(message.web_app_data)

async def main():
    with open("config.json", "r") as config_file:
        config = json.load(config_file)
    bot = aiogram.Bot(token=config["token"])
    await bot.delete_webhook(drop_pending_updates=True)
    await dispatcher.start_polling(bot, allowed_updates=dispatcher.resolve_used_update_types())

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
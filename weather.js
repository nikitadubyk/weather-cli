#!/usr/bin/env node
import { getArgs } from './helpers/args.js'
import { getIcon, getWeather } from './services/api.service.js'
import {
    printError,
    printHelp,
    printSuccess,
    printWeather,
} from './services/log.service.js'
import {
    saveKeyValue,
    TOKEN_DICTIONARY,
    getKeyValue,
} from './services/storage.service.js'

const saveToken = async token => {
    if (!token.length) {
        printError('Не передан токен')
        return
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.token, token)
        printSuccess('Токен сохранен')
    } catch (error) {
        printError(error.message)
    }
}

const saveCity = async city => {
    if (!city.length) {
        printError('Не передан город')
        return
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.city, city)
        printSuccess('Город сохранен')
    } catch (error) {
        printError(error.message)
    }
}

const getForcast = async () => {
    try {
        const city =
            process.env.CITY ?? (await getKeyValue(TOKEN_DICTIONARY.city))
        const weather = await getWeather(city)
        printWeather(weather, getIcon(weather.weather[0].icon))
    } catch (error) {
        if (error.response.status === 401) {
            return printError('Неверно указан токен')
        } else if (error.response.status === 404) {
            return printError('Неверно указан город')
        } else {
            return printError(error.message)
        }
    }
}

const initCLI = () => {
    const args = getArgs(process.argv)
    if (args.h) {
        printHelp()
    }
    if (args.s) {
        // сохранение города
        console.log(args.s)
        return saveCity(args.s)
    }
    if (args.t) {
        return saveToken(args.t)
    }
    getForcast()
}

initCLI()

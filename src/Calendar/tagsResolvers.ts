import { Context, ResolverMap } from "../@types/graphql-utils"
import { EventTag, EventTagTranslation } from "./EventTag.entity"

const adminOrThrow = async (context: Context) => {
  const roles = await context.user?.roles
  if (!roles?.find(role => role.type === "admin")) {
    throw new Error("Only admin can create and modify tags")
  }
}
export const tagResolvers: ResolverMap = {
  Mutation: {
    createEventTag: async (
      _,
      req: GQL.ICreateEventTagOnMutationArguments,
      context: Context,
      info: any
    ): Promise<EventTag> => {
      await adminOrThrow(context)
      const tag = new EventTag()
      tag.name = req.input.name
      tag.events = Promise.resolve([])


      const translations: EventTagTranslation[] = req.input.translations.map(
        translationInput => {
          const translation = new EventTagTranslation()
          translation.tag = Promise.resolve(tag)
          translation.language = translationInput.language
          translation.text = translationInput.text
          return translation
        }
      )

      tag.translations = Promise.resolve(translations)
      return tag.save()
    },
    modifyEventTag: async (
      _,
      req: GQL.IModifyEventTagOnMutationArguments,
      context: Context
    ) => {
      await adminOrThrow(context)
      const tag = await EventTag.findOne(req.input.id)
      tag.name = req.input.name
      const translations = await tag.translations
      const langToExistingTranslation: {[lang: string]: EventTagTranslation} = {}
      const langToInputTranslations: {[lang: string]: GQL.ICreateModifyEventTagTranslationInput} = {}

      translations.forEach(existingTranslation => langToExistingTranslation[existingTranslation.language] = existingTranslation)
      req.input.translations.forEach(translationInput => langToInputTranslations[translationInput.language] = translationInput)

      const removedTranslationsPromises = Object.keys(langToExistingTranslation).map((existingLang) => {
        if (!langToInputTranslations[existingLang]) {
          translations.splice(translations.findIndex(translation => translation.language === existingLang), 1)
          return langToExistingTranslation[existingLang].remove()
        }
        return null
      })
      await Promise.all(removedTranslationsPromises.filter(Boolean))

      const changedTranslationsPromises = Object.keys(langToExistingTranslation).map(existingLang => {
        const existingTranslation = langToExistingTranslation[existingLang]
        const matchingInput = langToInputTranslations[existingLang]

        if (existingTranslation && matchingInput && existingTranslation.text !== matchingInput.text ) {
          existingTranslation.text = matchingInput.text
          return existingTranslation.save()
        }
        return null
      })
      await Promise.all(changedTranslationsPromises.filter(Boolean))

      const newTranslationsPromises = Object.keys(langToInputTranslations).map(inputLang => {
        if (!langToExistingTranslation[inputLang]) {
          const newTranslation = new EventTagTranslation()
          newTranslation.tag = Promise.resolve(tag)
          translations.push(newTranslation)
          newTranslation.language = inputLang
          newTranslation.text = langToInputTranslations[inputLang].text
          return newTranslation.save()
        }
        return null
      })
      await Promise.all(newTranslationsPromises.filter(Boolean))
      tag.translations = Promise.resolve(translations)
      return tag.save()
    },
  },
  EventTag: {
    translation: async (tag: EventTag, req: any, context: Context): Promise<EventTagTranslation | null> => {
      if (!req.language) {
        throw new Error("Language required for getting specific translation")
      }
      console.log('Will look for translation with', tag.id, req.language)
      return EventTagTranslation.findOne({
        where: {
          tagId: tag.id,
          language: req.language
        }
      })
    }
  },
  Query: {
    tags: (_, req) => {
      return EventTag.find()
    }
  }
}
